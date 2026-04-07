/**
 * Defines the types for the Search Hotel page, including the fields and their possible values.
 */
export interface SearchHotelFields {
  location: Location;
  hotel?: Hotel;
  roomType?: RoomType;
  numberOfRooms?: NumberOfRooms;
  checkInDate?: string;
  checkOutDate?: string;
  adultsPerRoom?: AdultsPerRoom;
  childrenPerRoom?: ChildrenPerRoom;
}

/**
 * Represents a city where the hotel is located.
 */
export type Location =
  | "Sydney"
  | "Melbourne"
  | "Brisbane"
  | "Adelaide"
  | "New York"
  | "Los Angeles"
  | "Paris"
  | "London";

/**
 * Represents the available hotel names.
 */
export type Hotel = "Hotel Creek" | "Hotel Sunshine" | "Hotel Hervey" | "Hotel Cornice";

/**
 * Represents the type of room available in a hotel.
 */
export type RoomType = "Standard" | "Double" | "Deluxe" | "Super Deluxe";

/**
 * Represents room numbers from 1 to 4.
 */
type N1to4 = "1 - One" | "2 - Two" | "3 - Three" | "4 - Four";

/**
 * Represents room numbers from 5 to 10.
 */
type N5to10 =
  | "5 - Five"
  | "6 - Six"
  | "7 - Seven"
  | "8 - Eight"
  | "9 - Nine"
  | "10 - Ten";

/**
 * Represents the total number of rooms for a booking.
 */
export type NumberOfRooms = N1to4 | N5to10;

/**
 * Represents the number of adults per room.
 */
export type AdultsPerRoom = N1to4;

/**
 * Represents the number of children per room, including zero.
 */
export type ChildrenPerRoom = "0 - None" | N1to4;
