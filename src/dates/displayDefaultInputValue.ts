
/**
 * Function used to convert a Date to a string that can be
 * used for the defaultValue attribute in an input element.
 * @param date - The date to display
 * @param includeTime - If the time should be included
 * @returns
 */
export function displayDefaultInputValue(date: Date, includeTime: boolean) {
    const pad = (num: number) => num.toString().padStart(2, '0')
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1) // Months are zero-based
    const day = pad(date.getDate())
    if (includeTime) {
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    return `${year}-${month}-${day}`
}
