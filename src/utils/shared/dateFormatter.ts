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

  public static generateId(prefix: string = "IT"): string {
    return `${prefix}-${this.formatLocalTime()}`;
  }

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
}
