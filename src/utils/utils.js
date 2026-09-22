export function getLocaleDateTime(timestamp, whatFor = "") {
  if (!timestamp) return whatFor ? "" : {};

  const d = new Date(timestamp);

  const date = d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // ensures AM/PM
  });

  if (whatFor === "date") return date;
  if (whatFor === "time") return time;

  return { date, time };
}

/**
 * Safe Event Poster URL resolver.
 * Handles new schema ({ url, public_id }) and legacy records (string or empty).
 */
export const getEventPosterUrl = (event) => {
  if (!event) return "";
  if (typeof event.posterImage === "string") {
    return event.posterImage.trim();
  }
  return event.posterImage?.url?.trim() || "";
};

/**
 * Generate a Google Maps Search/Location URL.
 * If valid coordinates are provided, links directly to the pin.
 * Otherwise falls back to searching by the location text.
 */
export const getGoogleMapsUrl = (event) => {
  if (!event) return "#";
  const lat = event.coordinates?.latitude;
  const lng = event.coordinates?.longitude;

  if (
    lat !== undefined &&
    lat !== null &&
    lat !== "" &&
    lng !== undefined &&
    lng !== null &&
    lng !== "" &&
    !isNaN(Number(lat)) &&
    !isNaN(Number(lng))
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${Number(lat)},${Number(lng)}`;
  }

  if (event.location?.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.trim())}`;
  }

  return "#";
};