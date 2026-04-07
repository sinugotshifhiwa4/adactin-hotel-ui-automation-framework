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
   * Generates full valid search hotel data
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

  private static isCheckoutAfterCheckin(checkIn: string, checkOut: string): boolean {
    const checkInDate = this.parseDate(checkIn);
    const checkOutDate = this.parseDate(checkOut);

    return checkOutDate.getTime() > checkInDate.getTime();
  }

  private static parseDate(date: string): Date {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  private static getDaysDifferenceFromToday(date: string): number {
    const target = this.parseDate(date);
    const today = new Date();

    const diff = target.getTime() - today.setHours(0, 0, 0, 0);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // 🔹 Individual generators (reusable if needed)

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

  public static getRandomHotel(): Hotel {
    return faker.helpers.arrayElement([
      "Hotel Creek",
      "Hotel Sunshine",
      "Hotel Hervey",
      "Hotel Cornice",
    ]);
  }

  public static getRandomRoomType(): RoomType {
    return faker.helpers.arrayElement(["Standard", "Double", "Deluxe", "Super Deluxe"]);
  }

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

  public static getRandomAdultsPerRoom(): AdultsPerRoom {
    return faker.helpers.arrayElement(["1 - One", "2 - Two", "3 - Three", "4 - Four"]);
  }

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
