export enum ErrorTrigger {
  UNAUTHORISED = '123456-401',
  FORBIDDEN = '123456-403',
  NOT_FOUND = '123456-404',
  CONFIRM_NOT_FOUND = '123457-404',
  CONFIRM_BLANK = '123458-404',
  CONFIRM_BLANK_GET_NOT_FOUND = '123459-404',
  TOO_MANY_REQUESTS = '123456-429',
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

export enum RequestType {
  SLOTS,
  RESERVATIONS,
  CONFIRM_BOOKING,
  GET_BOOKING,
}
