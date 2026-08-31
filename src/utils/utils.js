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

// check