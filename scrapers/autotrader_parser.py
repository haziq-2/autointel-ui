"""Parse AutoTrader search HTML and API JSON into raw listing dicts."""

from __future__ import annotations

import json
import re
from typing import Any

from bs4 import BeautifulSoup, Tag

_LISTING_ID_RE = re.compile(r"listingId=(\d+)|/vehicle/(\d+)|/cars-for-sale/vehicle/(\d+)")
_YEAR_RE = re.compile(r"\b(19[5-9]\d|20[0-4]\d)\b")


def _safe_int(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, int) and not isinstance(value, bool):
        return value
    if isinstance(value, float):
        return int(value)
    if isinstance(value, str):
        cleaned = re.sub(r"[^\d]", "", value.replace(",", ""))
        return int(cleaned) if cleaned else None
    return None


def _safe_float(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    if isinstance(value, str):
        cleaned = re.sub(r"[^\d.]", "", value.replace(",", ""))
        try:
            return float(cleaned) if cleaned else None
        except ValueError:
            return None
    return None


def listing_id_from_url(url: str) -> str | None:
    match = _LISTING_ID_RE.search(url or "")
    if not match:
        return None
    return next(g for g in match.groups() if g)


def parse_search_payload(data: Any) -> list[dict[str, Any]]:
    """Parse AutoTrader search API JSON."""
    if not isinstance(data, dict):
        return []
    raw_items: list[dict] = []
    for key in ("listings", "items", "results", "inventory"):
        candidate = data.get(key)
        if isinstance(candidate, list):
            raw_items = candidate
            break
        if isinstance(candidate, dict):
            for sub_key in ("listings", "items", "results"):
                sub = candidate.get(sub_key)
                if isinstance(sub, list):
                    raw_items = sub
                    break
        if raw_items:
            break

    listings: list[dict[str, Any]] = []
    for item in raw_items:
        parsed = _normalize_api_item(item)
        if parsed:
            listings.append(parsed)
    return listings


def parse_search_html(html: str) -> list[dict[str, Any]]:
    """Parse rendered AutoTrader search HTML."""
    soup = BeautifulSoup(html, "html.parser")
    listings = _extract_from_next_data(soup)
    if listings:
        return listings
    listings = _extract_from_json_ld(soup)
    if listings:
        return listings
    return _extract_from_cards(soup)


def _normalize_api_item(item: dict[str, Any]) -> dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    listing_id = str(item.get("listingId") or item.get("id") or "")
    title = item.get("title") or item.get("heading") or ""
    year = _safe_int(item.get("year")) or _safe_int(_YEAR_RE.search(title).group(1) if _YEAR_RE.search(title) else None)
    price = _safe_float(
        item.get("price")
        or (item.get("pricingDetail") or {}).get("primary")
        or item.get("listPrice")
    )
    mileage = _safe_int(item.get("mileage") or item.get("mileageString"))
    listing_url = item.get("url") or item.get("clickUrl") or ""
    if listing_url and not listing_url.startswith("http"):
        listing_url = f"https://www.autotrader.com{listing_url}"
    if not listing_id and listing_url:
        listing_id = listing_id_from_url(listing_url) or ""
    if not listing_id:
        return None
    if not listing_url:
        listing_url = f"https://www.autotrader.com/cars-for-sale/vehicle/{listing_id}"

    location = item.get("location")
    if isinstance(location, dict):
        city = location.get("city", "")
        state = location.get("state", "")
        location = f"{city}, {state}".strip(", ")

    images = item.get("images") or item.get("imageUrls") or item.get("photos") or []
    image_url = None
    if isinstance(images, list) and images:
        first = images[0]
        image_url = first if isinstance(first, str) else first.get("url") or first.get("src")
    elif isinstance(item.get("imageUrl"), str):
        image_url = item["imageUrl"]

    return {
        "listing_id": listing_id,
        "title": title or f"{year or ''} {item.get('make', '')} {item.get('model', '')}".strip(),
        "listing_url": listing_url,
        "price": price,
        "year": year,
        "make": item.get("make") or item.get("makeCode"),
        "model": item.get("model") or item.get("modelCode"),
        "mileage": mileage,
        "location": location if isinstance(location, str) else None,
        "image_url": image_url,
        "vin": item.get("vin"),
        "transmission": item.get("transmission"),
        "fuel": item.get("fuelType"),
        "condition": item.get("listingType"),
    }


def _extract_from_next_data(soup: BeautifulSoup) -> list[dict[str, Any]]:
    script = soup.find("script", id="__NEXT_DATA__")
    if not script or not script.string:
        return []
    try:
        data = json.loads(script.string)
    except (json.JSONDecodeError, TypeError):
        return []
    page_props = data.get("props", {}).get("pageProps", {})
    raw_items: list[dict] = []
    for key in ("listings", "initialListings", "searchResults", "results"):
        candidate = page_props.get(key)
        if isinstance(candidate, list) and candidate:
            raw_items = candidate
            break
        if isinstance(candidate, dict):
            for sub_key in ("listings", "items", "results"):
                sub = candidate.get(sub_key)
                if isinstance(sub, list) and sub:
                    raw_items = sub
                    break
        if raw_items:
            break
    return [x for item in raw_items if (x := _normalize_api_item(item))]


def _extract_from_json_ld(soup: BeautifulSoup) -> list[dict[str, Any]]:
    listings: list[dict[str, Any]] = []
    for script in soup.find_all("script", type="application/ld+json"):
        if not script.string:
            continue
        try:
            data = json.loads(script.string)
        except (json.JSONDecodeError, TypeError):
            continue
        items = data if isinstance(data, list) else [data]
        for item in items:
            if not isinstance(item, dict):
                continue
            if item.get("@type") in ("Car", "Vehicle", "Product", "Offer"):
                normalized = _normalize_json_ld_item(item)
                if normalized:
                    listings.append(normalized)
    return listings


def _normalize_json_ld_item(item: dict[str, Any]) -> dict[str, Any] | None:
    name = item.get("name", "")
    year_match = _YEAR_RE.search(name)
    year = _safe_int(item.get("vehicleModelDate") or (year_match.group(1) if year_match else None))
    brand = item.get("brand")
    make = brand.get("name") if isinstance(brand, dict) else brand
    price = None
    offers = item.get("offers")
    if isinstance(offers, dict):
        price = _safe_float(offers.get("price"))
    source_url = item.get("url") or ""
    if source_url and not source_url.startswith("http"):
        source_url = f"https://www.autotrader.com{source_url}"
    listing_id = listing_id_from_url(source_url) if source_url else None
    if not listing_id:
        return None
    mileage_data = item.get("mileageFromOdometer")
    mileage = _safe_int(mileage_data.get("value") if isinstance(mileage_data, dict) else mileage_data)
    return {
        "listing_id": listing_id,
        "title": name or "AutoTrader vehicle",
        "listing_url": source_url,
        "price": price,
        "year": year,
        "make": make,
        "model": item.get("model"),
        "mileage": mileage,
        "location": None,
        "image_url": item.get("image")[0] if isinstance(item.get("image"), list) and item.get("image") else item.get("image"),
        "vin": item.get("vehicleIdentificationNumber"),
    }


def _extract_from_cards(soup: BeautifulSoup) -> list[dict[str, Any]]:
    cards: list[Tag] = soup.find_all(attrs={"data-cmp": re.compile(r"inventoryListing|listing", re.I)})
    if not cards:
        cards = soup.select("[data-listing-id], a[href*='/cars-for-sale/vehicle/']")
    listings: list[dict[str, Any]] = []
    seen: set[str] = set()
    for card in cards:
        parsed = _parse_card(card if card.name != "a" else card.parent or card)
        if not parsed:
            continue
        lid = parsed["listing_id"]
        if lid in seen:
            continue
        seen.add(lid)
        listings.append(parsed)
    if not listings:
        for anchor in soup.select("a[href*='/cars-for-sale/vehicle/'], a[href*='listingId=']"):
            href = anchor.get("href", "")
            listing_id = listing_id_from_url(href)
            if not listing_id or listing_id in seen:
                continue
            seen.add(listing_id)
            title = anchor.get_text(" ", strip=True) or "AutoTrader vehicle"
            listings.append(
                {
                    "listing_id": listing_id,
                    "title": title,
                    "listing_url": href if href.startswith("http") else f"https://www.autotrader.com{href}",
                    "price": _safe_float(title),
                    "year": _safe_int(_YEAR_RE.search(title).group(1) if _YEAR_RE.search(title) else None),
                    "make": None,
                    "model": None,
                    "mileage": None,
                    "location": None,
                    "image_url": None,
                    "vin": None,
                }
            )
    return listings


def _parse_card(card: Tag) -> dict[str, Any] | None:
    link = card.find("a", href=re.compile(r"/cars-for-sale/|listingId="))
    href = link["href"] if link and link.get("href") else ""
    listing_id = card.get("data-listing-id") or listing_id_from_url(href)
    if not listing_id:
        return None
    listing_url = href if href.startswith("http") else f"https://www.autotrader.com{href}"
    title_el = card.find(class_=re.compile(r"title|heading", re.I)) or card.find(["h2", "h3"])
    title = title_el.get_text(strip=True) if title_el else "AutoTrader vehicle"
    price_el = card.find(class_=re.compile(r"price|first-price", re.I))
    price = _safe_float(price_el.get_text(strip=True) if price_el else None)
    mileage_el = card.find(string=re.compile(r"[\d,]+\s*mi", re.I))
    mileage = _safe_int(str(mileage_el)) if mileage_el else None
    img = card.find("img")
    image_url = img.get("src") if img else None
    year = _safe_int(_YEAR_RE.search(title).group(1) if _YEAR_RE.search(title) else None)
    return {
        "listing_id": str(listing_id),
        "title": title,
        "listing_url": listing_url,
        "price": price,
        "year": year,
        "make": None,
        "model": None,
        "mileage": mileage,
        "location": None,
        "image_url": image_url,
        "vin": card.get("data-vin"),
    }
