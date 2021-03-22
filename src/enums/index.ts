export enum ERROR_TRIGGER {
  UNAUTHORISED = '123456-401',
  FORBIDDEN = '123456-403',
  NOT_FOUND = '123456-404',
  INTERNAL_SERVER_ERROR = '123456-500',
  SERVICE_UNAVAILABLE = '123456-503',
}

export enum DAY {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum REQUEST_TYPE {
  SLOTS,
  RESERVATIONS,
  CONFIRM_BOOKING,
}
