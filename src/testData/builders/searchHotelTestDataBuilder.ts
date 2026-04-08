import { faker } from "@faker-js/faker";
import type {
  SearchHotelFields,
  Location,
  Hotel,
  RoomType,
  NumberOfRooms,
  AdultsPerRoom,
  ChildrenPerRoom,
} from "../../layers/ui/pages/types/searchHotel/searchHotel.type.js";
import DateFormatter from "../../utils/shared/dateFormatter.js";

export default class SearchHotelTestDataBuilder {
  /**
   * Generates a random set of search hotel fields data.
   *
   * If `overrides` is provided, it will merge the provided data with the generated data.
   * The generated data will ensure that the check-out date is always after the check-in date.
   *
   * @param overrides - Optional partial data to merge with the generated data.
   * @returns A complete set of search hotel fields data.
   */
  public static build(overrides: Partial<SearchHotelFields> = {}): SearchHotelFields {
    const checkInOffset = faker.number.int({ min: 1, max: 7 });
    const checkOutOffset = checkInOffset + faker.number.int({ min: 8, max: 25 });

    const baseData: SearchHotelFields = {
      location: this.getRandomLocation(),
      hotel: this.getRandomHotel(),
      roomType: this.getRandomRoomType(),
      numberOfRooms: this.getRandomNumberOfRooms(),
      checkInDate: DateFormatter.formatDateByOffset(checkInOffset),
      checkOutDate: DateFormatter.formatDateByOffset(checkOutOffset),
      adultsPerRoom: this.getRandomAdultsPerRoom(),
      childrenPerRoom: this.getRandomChildrenPerRoom(),
    };

    const finalData = { ...baseData, ...overrides };

    // Enforce rule: checkout must be AFTER checkin
    if (
      finalData.checkInDate &&
      finalData.checkOutDate &&
      !this.isCheckoutAfterCheckin(finalData.checkInDate, finalData.checkOutDate)
    ) {
      finalData.checkOutDate = DateFormatter.formatDateByOffset(
        this.getDaysDifferenceFromToday(finalData.checkInDate) + 1,
      );
    }

    return finalData;
  }

  /**
   * Determines if the check-out date is after the check-in date.
   * @param checkIn The check-in date string in 'dd/MM/yyyy' format.
   * @param checkOut The check-out date string in 'dd/MM/yyyy' format.
   * @returns True if the check-out date is after the check-in date, false otherwise.
   */
  private static isCheckoutAfterCheckin(checkIn: string, checkOut: string): boolean {
    const checkInDate = DateFormatter.parseDate(checkIn);
    const checkOutDate = DateFormatter.parseDate(checkOut);

    return checkOutDate.getTime() > checkInDate.getTime();
  }

  /**
   * Returns the number of days difference between the given date and today.
   * @param date The date string in 'dd/MM/yyyy' format.
   * @returns The number of days difference between the given date and today.
   */
  private static getDaysDifferenceFromToday(date: string): number {
    const target = DateFormatter.parseDate(date);
    const today = new Date();

    const diff = target.getTime() - today.setHours(0, 0, 0, 0);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // Individual generators

  /**
   * Returns a random location from the list of possible locations.
   * The possible locations are: Sydney, Melbourne, Brisbane, Adelaide, New York, Los Angeles, Paris, London.
   * @returns A random location from the list of possible locations.
   */
  public static getRandomLocation(): Location {
    return faker.helpers.arrayElement([
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Adelaide",
      "New York",
      "Los Angeles",
      "Paris",
      "London",
    ]);
  }

  /**
   * Returns a random hotel from the list of possible hotels.
   *
   * The possible hotels are:
   * - "Hotel Creek"
   * - "Hotel Sunshine"
   * - "Hotel Hervey"
   * - "Hotel Cornice"
   */
  public static getRandomHotel(): Hotel {
    return faker.helpers.arrayElement([
      "Hotel Creek",
      "Hotel Sunshine",
      "Hotel Hervey",
      "Hotel Cornice",
    ]);
  }

  /**
   * Generates a random value for the room type.
   *
   * Possible values are:
   * - "Standard"
   * - "Double"
   * - "Deluxe"
   * - "Super Deluxe"
   */
  public static getRandomRoomType(): RoomType {
    return faker.helpers.arrayElement(["Standard", "Double", "Deluxe", "Super Deluxe"]);
  }

  /**
   * Returns a random value for the number of rooms.
   * Possible values are:
   * - "1 - One"
   * - "2 - Two"
   * - "3 - Three"
   * - "4 - Four"
   * - "5 - Five"
   * - "6 - Six"
   * - "7 - Seven"
   * - "8 - Eight"
   * - "9 - Nine"
   * - "10 - Ten"
   */
  public static getRandomNumberOfRooms(): NumberOfRooms {
    return faker.helpers.arrayElement([
      "1 - One",
      "2 - Two",
      "3 - Three",
      "4 - Four",
      "5 - Five",
      "6 - Six",
      "7 - Seven",
      "8 - Eight",
      "9 - Nine",
      "10 - Ten",
    ]);
  }

  /**
   * Generates a random value for the number of adults per room.
   *
   * Possible values are:
   * - "1 - One"
   * - "2 - Two"
   * - "3 - Three"
   * - "4 - Four"
   */
  public static getRandomAdultsPerRoom(): AdultsPerRoom {
    return faker.helpers.arrayElement(["1 - One", "2 - Two", "3 - Three", "4 - Four"]);
  }

  /**
   * Generates a random value for the number of children per room.
   *
   * Possible values are:
   * - "0 - None"
   * - "1 - One"
   * - "2 - Two"
   * - "3 - Three"
   * - "4 - Four"
   */
  public static getRandomChildrenPerRoom(): ChildrenPerRoom {
    return faker.helpers.arrayElement([
      "0 - None",
      "1 - One",
      "2 - Two",
      "3 - Three",
      "4 - Four",
    ]);
  }
}
