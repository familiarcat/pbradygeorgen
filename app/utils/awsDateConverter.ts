// awsDateConverter.ts

/**
 * Converts a year or a date string to an AWSDate string in the format YYYY-MM-DD.
 * @param {string | number} date - The date or year to convert.
 * @returns {string} - The AWSDate formatted string.
 * @throws Will throw an error if the input cannot be converted to a valid date.
 */
export function toAWSDate(date: string | number): string {
  if (typeof date === "number") {
    // Assume the number is a year
    return `${date}-01-01`
  } else if (typeof date === "string") {
    // Check if the string is a valid year
    const year = parseInt(date, 10)
    if (!isNaN(year) && year.toString() === date) {
      return `${year}-01-01`
    }

    // Otherwise, parse the date string
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }
    return parsedDate.toISOString().split("T")[0] // Extracts YYYY-MM-DD
  } else {
    throw new Error(`Unsupported date format: ${date}`)
  }
}
