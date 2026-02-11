// Simple date formatting utility to replace date-fns
export function formatDate(date, formatStr) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();

    // Support common formats
    if (formatStr === 'MMM d, yyyy') {
        return `${months[month]} ${day}, ${year}`;
    }
    if (formatStr === 'MMMM d, yyyy') {
        return `${monthsFull[month]} ${day}, ${year}`;
    }

    // Default fallback
    return d.toLocaleDateString();
}
