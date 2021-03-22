export interface ReservationsRequest {
  testCentreId: string;
  testTypes: string[];
  startDateTime: string;
  quantity: number;
  lockTime: number;
}

export interface ReservationsResponse {
  testCentreId: string;
  testTypes: string[];
  startDateTime: string;
  reservationId: string;
}
