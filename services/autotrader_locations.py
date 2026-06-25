"""AutoTrader search URL helpers and location slugs."""

from __future__ import annotations

import re
import unicodedata
from urllib.parse import urlencode

_RESULTS_PER_PAGE = 25


def km_to_autotrader_radius_miles(radius_km: float) -> int:
    """Convert km to miles and snap to a reasonable AutoTrader radius."""
    miles = int(round(radius_km * 0.621371))
    allowed = (10, 25, 50, 75, 100, 150, 200, 500)
    return min(allowed, key=lambda x: abs(x - miles))


def location_slug(city: str | None, state: str | None, raw_input: str) -> str:
    """Build AutoTrader path slug like ``dallas-tx`` from city/state."""
    if city and state:
        base = f"{city}-{state}"
    else:
        base = raw_input
    normalized = unicodedata.normalize("NFKD", base)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_only.lower()).strip("-")
    return re.sub(r"-+", "-", slug)


def build_search_url(
    *,
    location_slug_value: str,
    zip_code: str | None,
    radius_km: float,
    first_record: int = 0,
    num_records: int = _RESULTS_PER_PAGE,
    sort_by: str = "datelistedDESC",
) -> str:
    """Return an AutoTrader used-vehicle search URL for the region."""
    radius_mi = km_to_autotrader_radius_miles(radius_km)
    path = (
        f"/cars-for-sale/all-cars/{location_slug_value}"
        if location_slug_value
        else "/cars-for-sale/all-cars"
    )
    params: dict[str, str | int] = {
        "listingTypes": "USED",
        "searchRadius": radius_mi,
        "sortBy": sort_by,
        "numRecords": num_records,
        "firstRecord": first_record,
    }
    if zip_code:
        params["zip"] = zip_code
    return f"https://www.autotrader.com{path}?{urlencode(params)}"
