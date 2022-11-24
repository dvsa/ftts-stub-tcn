export interface SlotsQuery {
  testTypes: string[];
  dateFrom: Date;
  dateTo: Date;
  preferredDate?: Date;
}

export interface SlotResponse {
  testCentreId: string;
  testTypes: string[];
  startDateTime: string;
  quantity: number;
  dateAvailableOnOrBeforePreferredDate?: string;
  dateAvailableOnOrAfterPreferredDate?: string;
  dateAvailableOnOrAfterToday?: string;
}

export type DateAvailability = {
  dateAvailableOnOrBeforePreferredDate: string;
  dateAvailableOnOrAfterPreferredDate: string;
  dateAvailableOnOrAfterToday: string;
};
