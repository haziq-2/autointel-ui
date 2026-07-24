"""AutoTrader vehicle scraper using Playwright + HTML/API parsing.

AutoTrader is Akamai-protected; this scraper uses a persistent Chrome profile
and renders search pages with Playwright, then parses listing data from API
responses or rendered HTML.
"""

from __future__ import annotations

import json
from contextlib import contextmanager
from typing import Any, Iterator

from loguru import logger

from config import Settings, get_settings
from models import Source, VehicleListing
from scrapers.autotrader_parser import parse_search_html, parse_search_payload
from services.autotrader_locations import build_search_url
from services.city_resolver import ResolvedRegion
from utils import human_delay, random_user_agent

try:
    from playwright.sync_api import Error as PWError
    from playwright.sync_api import TimeoutError as PWTimeoutError
    from playwright.sync_api import sync_playwright
except ImportError:  # pragma: no cover
    PWError = Exception  # type: ignore[misc, assignment]
    PWTimeoutError = TimeoutError  # type: ignore[misc, assignment]
    sync_playwright = None  # type: ignore[assignment]


def _stable_user_agent(profile_dir) -> str:
    ua_file = profile_dir / "user_agent.txt"
    if ua_file.exists():
        return ua_file.read_text(encoding="utf-8").strip()
    ua = random_user_agent()
    profile_dir.mkdir(parents=True, exist_ok=True)
    ua_file.write_text(ua, encoding="utf-8")
    return ua


@contextmanager
def _browser_context(settings: Settings) -> Iterator:
    if sync_playwright is None:
        raise RuntimeError(
            "Playwright is not installed. Run 'pip install playwright' and 'playwright install chromium'."
        )
    user_agent = _stable_user_agent(settings.autotrader_profile_dir)
    launch_kwargs: dict[str, Any] = {
        "user_data_dir": str(settings.autotrader_profile_dir),
        "headless": settings.autotrader_headless,
        "user_agent": user_agent,
        "viewport": {"width": 1366, "height": 900},
        "locale": "en-US",
        "args": [
            "--disable-blink-features=AutomationControlled",
            "--no-first-run",
            "--no-default-browser-check",
        ],
        "ignore_default_args": ["--enable-automation"],
    }
    channel = (settings.autotrader_browser_channel or "").strip()
    if channel:
        launch_kwargs["channel"] = channel

    with sync_playwright() as pw:
        try:
            context = pw.chromium.launch_persistent_context(**launch_kwargs)
        except Exception as exc:
            if channel:
                logger.warning("AutoTrader: failed to launch '{}': {}. Using bundled Chromium.", channel, exc)
                launch_kwargs.pop("channel", None)
                context = pw.chromium.launch_persistent_context(**launch_kwargs)
            else:
                raise
        page = context.pages[0] if context.pages else context.new_page()
        try:
            yield context, page
        finally:
            try:
                page.wait_for_timeout(1_500)
            except Exception:  # noqa: BLE001
                pass
            context.close()


class AutotraderScraper:
    """Scrapes used vehicle listings from AutoTrader.com for a US region."""

    source = Source.CARGURUS

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def scrape(self, region: ResolvedRegion) -> list[VehicleListing]:
        if region.country_code and region.country_code != "US":
            logger.info("AutoTrader is US-only; skipping region '{}'", region.raw_input)
            return []
        if not region.autotrader_zip:
            logger.warning(
                "No US ZIP code for '{}'. AutoTrader search may be less accurate.",
                region.raw_input,
            )

        per_page = self.settings.autotrader_results_per_page
        max_pages = max(1, (self.settings.autotrader_max_listings + per_page - 1) // per_page)
        max_pages = min(max_pages, self.settings.autotrader_max_pages)

        collected: dict[str, VehicleListing] = {}
        try:
            with _browser_context(self.settings) as (_context, page):
                for page_num in range(max_pages):
                    first_record = page_num * per_page
                    url = build_search_url(
                        location_slug_value=region.autotrader_location_slug,
                        zip_code=region.autotrader_zip,
                        radius_km=region.radius_km,
                        first_record=first_record,
                        num_records=per_page,
                    )
                    logger.info("AutoTrader scraping page {}: {}", page_num + 1, url)
                    raw_cards = self._fetch_search_page(page, url)
                    if not raw_cards:
                        logger.warning("AutoTrader page {} returned no listings.", page_num + 1)
                        break

                    for card in raw_cards:
                        listing = self._to_listing(card, region)
                        if listing:
                            collected[listing.listing_id] = listing
                        if len(collected) >= self.settings.autotrader_max_listings:
                            break

                    logger.debug("AutoTrader page {}: {} unique total", page_num + 1, len(collected))
                    if len(collected) >= self.settings.autotrader_max_listings:
                        break
                    if len(raw_cards) < per_page:
                        break
                    human_delay(self.settings.autotrader_min_delay, self.settings.autotrader_max_delay)
        except PWError as exc:
            logger.error("AutoTrader browser error: {}", exc)
        except Exception as exc:  # noqa: BLE001
            logger.error("AutoTrader scrape failed: {}", exc)

        listings = list(collected.values())[: self.settings.autotrader_max_listings]
        logger.info("AutoTrader produced {} listing(s)", len(listings))
        return listings

    def _fetch_search_page(self, page, url: str) -> list[dict[str, Any]]:
        api_payloads: list[dict] = []

        def on_response(response) -> None:
            resp_url = response.url
            if "/cars/api/search" not in resp_url:
                return
            content_type = (response.headers or {}).get("content-type", "")
            if "json" not in content_type:
                return
            try:
                api_payloads.append(response.json())
            except Exception:  # noqa: BLE001
                pass

        page.on("response", on_response)
        try:
            page.goto(url, timeout=60_000, wait_until="domcontentloaded")
            try:
                page.wait_for_load_state("networkidle", timeout=15_000)
            except PWTimeoutError:
                pass
            page.wait_for_timeout(self.settings.autotrader_page_wait_ms)
        except PWError as exc:
            logger.warning("AutoTrader navigation failed: {}", exc)
            return []

        title = (page.title() or "").lower()
        if "page unavailable" in title or "access denied" in title:
            logger.warning(
                "AutoTrader blocked this request (Akamai). "
                "Try AUTOWATCH_AUTOTRADER_HEADLESS=false and AUTOWATCH_AUTOTRADER_BROWSER_CHANNEL=chrome."
            )
            return []

        for payload in api_payloads:
            parsed = parse_search_payload(payload)
            if parsed:
                logger.debug("AutoTrader parsed {} listing(s) from API response", len(parsed))
                return parsed

        html = page.content()
        parsed = parse_search_html(html)
        if parsed:
            logger.debug("AutoTrader parsed {} listing(s) from HTML", len(parsed))
        return parsed

    def _to_listing(self, card: dict[str, Any], region: ResolvedRegion) -> VehicleListing | None:
        listing_id = str(card.get("listing_id") or "")
        listing_url = card.get("listing_url") or ""
        title = (card.get("title") or "").strip()
        if not listing_id or not listing_url or not title:
            return None
        return VehicleListing(
            source=self.source,
            listing_id=listing_id,
            title=title,
            listing_url=listing_url,
            price=card.get("price"),
            currency="USD",
            year=card.get("year"),
            make=card.get("make"),
            model=card.get("model"),
            mileage=card.get("mileage"),
            location=card.get("location") or region.display_name,
            image_url=card.get("image_url"),
            vin=card.get("vin"),
            condition=card.get("condition"),
            fuel=card.get("fuel"),
            transmission=card.get("transmission"),
            raw_payload=json.dumps(card),
        )
