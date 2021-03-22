import * as helpers from '../../../src/controllers/bookings/validators';
import { NotesBehaviouralMarkers, validateBookingRequest } from '../../../src/controllers/bookings/validators';
import { BadRequestError } from '../../../src/errors';
import { BookingRequest } from '../../../src/interfaces/bookings';
import { KeyValue } from '../../../src/interfaces/slots';

const string4100 = 'a'.repeat(4100);
const string4096 = 'b'.repeat(4096);
const string72 = 'c'.repeat(72);
describe('Bookings validators', () => {
  describe('validateBookingReferenceId', () => {
    let params: KeyValue;
    beforeEach(() => {
      params = {
        bookingReferenceId: '0123456789',
      };
    });

    describe('returns a valid booking referece id successfully', () => {
      test('when id is 10 characters', () => {
        params.bookingReferenceId = '0123456789';

        const result = helpers.validateBookingReferenceId(params);

        expect(result).toEqual(params.bookingReferenceId);
      });

      test('when id is 72 characters', () => {
        params.bookingReferenceId = string72;

        const result = helpers.validateBookingReferenceId(params);

        expect(result).toEqual(params.bookingReferenceId);
      });
    });

    describe('throws a Bad Request Error', () => {
      test('when booking reference id not a string', () => {
        params.bookingReferenceId = null;

        expect(() => helpers.validateBookingReferenceId(params)).toThrow(BadRequestError);
      });

      test('when booking reference id less than 10 characters', () => {
        params.bookingReferenceId = '123';

        expect(() => helpers.validateBookingReferenceId(params)).toThrow(BadRequestError);
      });
      test('when booking reference id greater than 72 characters', () => {
        params.bookingReferenceId = 'This string is longer than 72 characters so should throw an exception when used';

        expect(() => helpers.validateBookingReferenceId(params)).toThrow(BadRequestError);
      });
    });
  });

  describe('validateNotesAndBehaviouralMarkers', () => {
    let bookingRequest: BookingRequest;
    let notesBehaviouralMarkers: NotesBehaviouralMarkers;

    beforeEach(() => {
      bookingRequest = {
        bookingReferenceId: '1234567890',
        reservationId: '1234567890',
        behaviouralMarkers: '',
        notes: '',
      };
      notesBehaviouralMarkers = {
        notes: '',
        behaviouralMarkers: '',
      };
    });

    describe('succesfully validates', () => {
      describe('a bookings request object', () => {
        test('when behaviouralMarkers and notes are 4096 characters', () => {
          bookingRequest.behaviouralMarkers = string4096;
          bookingRequest.notes = string4096;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).not.toThrow();
        });
      });

      describe('a notes and behavioural types object', () => {
        test('when behaviouralMarkers and notes are 4096 characters', () => {
          notesBehaviouralMarkers.behaviouralMarkers = string4096;
          notesBehaviouralMarkers.notes = string4096;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(notesBehaviouralMarkers)).not.toThrow();
        });
      });
    });

    describe('errors', () => {
      test('when called with an empty object', () => {
        expect(() => helpers.validateNotesAndBehaviouralMarkers({} as any)).toThrow(BadRequestError);
      });

      describe('when behaviouralMarkers throws a Bad Request Error', () => {
        test('when missing', () => {
          delete bookingRequest.behaviouralMarkers;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).toThrow(BadRequestError);
        });
        test('when not a string', () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore: Type 'boolean' is not assignable to type 'string'.
          bookingRequest.behaviouralMarkers = true;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).toThrow(BadRequestError);
        });
        test('when greater than 4096 characters', () => {
          bookingRequest.behaviouralMarkers = string4100;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).toThrow(BadRequestError);
        });
      });

      describe('when notes throws a Bad Request Error', () => {
        test('when missing', () => {
          delete bookingRequest.notes;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).toThrow(BadRequestError);
        });
        test('when not a string', () => {
          bookingRequest.notes = undefined;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).toThrow(BadRequestError);
        });
        test('when greater than 4096 characters', () => {
          bookingRequest.notes = string4100;

          expect(() => helpers.validateNotesAndBehaviouralMarkers(bookingRequest)).toThrow(BadRequestError);
        });
      });
    });
  });

  describe('validateBookingRequest', () => {
    let bookingRequest: BookingRequest;
    beforeEach(() => {
      bookingRequest = {
        bookingReferenceId: '1234567890',
        reservationId: '1234567890',
        behaviouralMarkers: '',
        notes: '',
      };
    });
    describe('succesfully validates', () => {
      test('when bookingReferenceId and reservationId on a booking are 10 characters', () => {
        expect(() => validateBookingRequest(bookingRequest)).not.toThrow();
      });

      test('when bookingReferenceId and reservationId on a booking are 72 characters', () => {
        bookingRequest.bookingReferenceId = string72;
        bookingRequest.reservationId = string72;

        expect(() => validateBookingRequest(bookingRequest)).not.toThrow();
      });

      test('when notes and behavioural markers are valid', () => {
        expect(() => validateBookingRequest(bookingRequest)).not.toThrow();
      });
    });

    describe('errors', () => {
      test('when called with an empty object', () => {
        expect(() => helpers.validateBookingRequest({} as any)).toThrow(BadRequestError);
      });

      test('when multiple booking request parameters are invalid', () => {
        bookingRequest.behaviouralMarkers = string4100;
        bookingRequest.bookingReferenceId = '123';
        delete bookingRequest.reservationId;
        expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
      });

      test('when notes/behavioural markers are invalid', () => {
        delete bookingRequest.notes;
        bookingRequest.behaviouralMarkers = undefined;
        expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
      });

      describe('bookingReferenceId and reservationId errors', () => {
        test('when called with an undefined object', () => {
          delete bookingRequest.bookingReferenceId;
          delete bookingRequest.reservationId;

          expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
        });

        describe('bookingReferenceId throws a Bad Request Error', () => {
          test('when not a string', () => {
            bookingRequest.bookingReferenceId = null;
            expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
          });

          test('when less than 10 characters', () => {
            bookingRequest.bookingReferenceId = '123';

            expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
          });
          test('when greater than 72 characters', () => {
            bookingRequest.bookingReferenceId = 'This string is longer than 72 characters so should throw an exception when used';

            expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
          });
        });

        describe('reservationId throws a Bad Request Error', () => {
          test('when not a string', () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore: Type 'number' is not assignable to type 'string'.
            bookingRequest.reservationId = 100;

            expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
          });
          test('when less than 10 characters', () => {
            bookingRequest.reservationId = '0';

            expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
          });
          test('when greater than 72 characters', () => {
            bookingRequest.reservationId = 'This string is longer than 72 characters so should throw an exception when used';

            expect(() => validateBookingRequest(bookingRequest)).toThrow(BadRequestError);
          });
        });
      });
    });
  });
});
