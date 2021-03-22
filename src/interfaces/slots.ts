export interface SlotsQuery {
  testTypes: string[];
  dateFrom: Date;
  dateTo: Date;
}

export interface SlotResponse {
  testCentreId: string;
  testTypes: string[];
  startDateTime: string;
  quantity: number;
}

export interface KeyValue {
  [key: string]: string;
}
