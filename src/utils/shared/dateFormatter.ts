import type { SearchHotelFields } from "../../layers/ui/pages/types/searchHotel/searchHotel.type.js";
import ErrorHandler from "../errorHandling/errorHandler.js";

export default class DateFormatter {
  /**
   * Returns current date in format 'DD/MM/YYYY'
   */
  public static formatCurrentDate(): string {
    return this.formatDate(new Date());
  }

  /**
   * Formats a given date into 'DD/MM/YYYY'
   */
  public static formatDate(date: Date): string {
    return [
      String(date.getDate()).padStart(2, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      date.getFullYear(),
    ].join("/");
  }

  /**
   * Returns a date offset from today in 'DD/MM/YYYY'
   * @param daysFromToday (e.g. +5 future, -3 past, 0 today)
   */
  public static formatDateByOffset(daysFromToday: number): string {
    const targetDate = this.calculateDateOffset(daysFromToday);
    return this.formatDate(targetDate);
  }

  /**
   * Core reusable offset logic
   */
  private static calculateDateOffset(daysFromToday: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date;
  }

  /**
   * Keeps your original timestamp format for IDs
   */
  public static formatLocalTime(): string {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");
  }

  /**
   * Calculates the number of days between check-in and check-out dates.
   * Throws an error if either check-in or check-out date is undefined,
   * or if the check-out date is not after the check-in date.
   * @param options - Required search hotel options containing check-in and check-out dates.
   * @returns The number of days between check-in and check-out dates.
   */
  public static calculateNumberOfDays(options: SearchHotelFields): number {
    const { checkInDate, checkOutDate } = options;

    if (checkInDate === undefined || checkOutDate === undefined) {
      ErrorHandler.logAndThrow(
        "calculateNumberOfDays",
        "Check-in and check-out dates are required to calculate the number of days.",
      );
    }

    const [inDay, inMonth, inYear] = checkInDate.split("/").map(Number);
    const [outDay, outMonth, outYear] = checkOutDate.split("/").map(Number);

    const checkIn = new Date(inYear, inMonth - 1, inDay);
    const checkOut = new Date(outYear, outMonth - 1, outDay);

    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      ErrorHandler.logAndThrow(
        "calculateNumberOfDays",
        `Check-out date '${checkOutDate}' must be after check-in date '${checkInDate}'.`,
      );
    }

    return diffDays;
  }

  /**
   * Validates the check-in and check-out dates against the following rules:
   * 1. Check-in cannot be before today.
   * 2. Check-in must be before check-out.
   * @param options - Contains the check-in and check-out dates to be validated.
   */

  public static validateCheckInAndOutDates(options: SearchHotelFields): void {
    const { checkInDate, checkOutDate } = options;

    if (!checkInDate || !checkOutDate) return;

    const today = DateFormatter.parseDate(DateFormatter.formatDateByOffset(0));

    const checkIn = DateFormatter.parseDate(checkInDate);
    const checkOut = DateFormatter.parseDate(checkOutDate);

    // Rule 1: Check-in cannot be before today
    if (checkIn < today) {
      ErrorHandler.logAndThrow(
        "validateCheckInAndOutDates",
        `Check-in date '${checkInDate}' cannot be before today's date.`,
      );
    }

    // Rule 2: Check-in must be before check-out
    if (checkIn >= checkOut) {
      ErrorHandler.logAndThrow(
        "validateCheckInAndOutDates",
        `Check-in date '${checkInDate}' must be before check-out date '${checkOutDate}'.`,
      );
    }
  }

  /**
   * Parses a string to a Date object in the format "dd/MM/yyyy".
   * If the string is not in the correct format, or if the date is invalid, returns null.
   * @param value - The string to parse.
   * @returns {Date | null} The parsed date, or null if the string is invalid.
   */
  public static parseDate(date: string): Date {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
}
