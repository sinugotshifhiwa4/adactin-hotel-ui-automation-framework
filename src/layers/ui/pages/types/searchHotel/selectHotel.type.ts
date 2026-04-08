/**
 * Defines the structure of the options that can be used to identify a row in the hotel search results.
 */
export interface HotelSearchRowIdentifier {
  location?: string;
  hotel?: string;
  roomType?: string;
  numberOfRooms?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfDays?: number;
}
