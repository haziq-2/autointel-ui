"""Tests for AutoTrader parsing and URLs."""

import json
from pathlib import Path

from scrapers.autotrader_parser import listing_id_from_url, parse_search_payload
from services.autotrader_locations import build_search_url, location_slug
from services.city_resolver import ResolvedRegion

FIXTURE = Path(__file__).resolve().parents[1] / "fixtures" / "autotrader_api_listings.json"


def _region() -> ResolvedRegion:
    return ResolvedRegion(
        raw_input="Dallas, TX",
        display_name="Dallas, TX",
        city="Dallas",
        state="TX",
        country="US",
        craigslist_subdomain="dallas",
        craigslist_area_name="dallas",
        craigslist_base_url="https://dallas.craigslist.org",
        facebook_query="Dallas, TX",
        facebook_slug="dallas",
        autotrader_zip="75201",
        autotrader_location_slug="dallas-tx",
    )


def test_location_slug():
    assert location_slug("Dallas", "TX", "Dallas, TX") == "dallas-tx"


def test_build_search_url_includes_zip_and_sort():
    url = build_search_url(
        location_slug_value="dallas-tx",
        zip_code="75201",
        radius_km=80.0,
    )
    assert "zip=75201" in url
    assert "sortBy=datelistedDESC" in url
    assert "/dallas-tx" in url


def test_listing_id_from_url():
    assert listing_id_from_url("https://www.autotrader.com/cars-for-sale/vehicle/782603846") == "782603846"
    assert listing_id_from_url("https://www.autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId=123") == "123"


def test_parse_search_payload_fixture():
    payload = {"listings": json.loads(FIXTURE.read_text(encoding="utf-8"))}
    listings = parse_search_payload(payload)
    assert len(listings) == 1
    assert listings[0]["listing_id"] == "782603846"
    assert listings[0]["price"] == 18875.0
    assert listings[0]["mileage"] == 69189
