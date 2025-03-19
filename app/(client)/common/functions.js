export function timeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 5) return `${days}d ago`;

    const options = { day: "numeric", month: "short" };
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString("en-US", options);
    }

    return date.toLocaleDateString("en-US", { ...options, year: "numeric" });
}

export function formatCount(number) {
    if (number < 1000) return number.toString();
    if (number < 1_000_000) return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    if (number < 1_000_000_000) return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
}

export const getFullDay = (timestamp) => {
    let date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
