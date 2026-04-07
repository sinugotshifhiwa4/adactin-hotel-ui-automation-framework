export interface LocationRowIdentifier {
  location: string;
}

export interface HotelRowIdentifier {
  hotel: string;
}

export interface HotelSearchRowIdentifier {
  location?: string;
  hotel?: string;
  roomType?: string;
  numberOfRooms?: string;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfDays?: number;
}
