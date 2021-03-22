import { BadRequestError } from '../../errors';
import { BookingFullResponse, BookingRequest } from '../../interfaces/bookings';
import { KeyValue } from '../../interfaces/slots';

type BookingStatic = Omit<BookingFullResponse, 'bookingReferenceId' | 'notes' | 'behaviouralMarkers'>;
export type NotesBehaviouralMarkers = Pick<BookingRequest, 'notes' | 'behaviouralMarkers'>;

export const staticBookingResponseDetails: BookingStatic = {
  reservationId: '5050302b-e9f5-476e-b22b-6856a8026e81',
  testTypes: ['Car'],
  startDateTime: '2021-10-02T09:15:00+0000',
  testCentreId: 'test-centre',
};

export const validateBookingReferenceId = (params: KeyValue): string => {
  const { bookingReferenceId } = params;
  if (typeof bookingReferenceId !== 'string' || bookingReferenceId.length < 10 || bookingReferenceId.length > 72) {
    throw new BadRequestError();
  }
  return bookingReferenceId;
};

export const validateNotesAndBehaviouralMarkers = <T extends NotesBehaviouralMarkers>(obj: T): void => {
  const conditionsArray: boolean[] = [
    typeof obj.notes !== 'string' || obj.notes.length > 4096,
    typeof obj.behaviouralMarkers !== 'string' || obj.behaviouralMarkers.length > 4096,
  ];

  if (conditionsArray.includes(true)) {
    throw new BadRequestError();
  }
};

export const validateBookingRequest = (booking: BookingRequest): void => {
  validateNotesAndBehaviouralMarkers<BookingRequest>(booking);
  const conditionsArray: boolean[] = [
    typeof booking.bookingReferenceId !== 'string' || booking.bookingReferenceId.length < 10 || booking.bookingReferenceId.length > 72,
    typeof booking.reservationId !== 'string' || booking.reservationId.length < 10 || booking.reservationId.length > 72,
  ];

  if (conditionsArray.includes(true)) {
    throw new BadRequestError();
  }
};
