import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import {
  confirmBooking,
  deleteBooking,
  getBooking,
  putBooking,
} from './bookings-controller';
import { ApplicationError } from '../../errors';
import { BookingFullResponse, BookingResponse } from '../../interfaces/bookings';

const httpTrigger: AzureFunction = (context: Context, req: HttpRequest): void => {
  if (context.res) {
    context.res.headers = { 'Content-Type': 'application/json' };
  }
  switch (req.method) {
    case 'GET':
      handleRequest<BookingFullResponse>(context, req, getBooking);
      break;
    case 'PUT':
      handleRequest<BookingFullResponse>(context, req, putBooking);
      break;
    case 'DELETE':
      handleRequest<void>(context, req, deleteBooking);
      break;
    case 'POST':
      handleRequest<BookingResponse[]>(context, req, confirmBooking);
      break;
    default:
      // none
  }
};

const handleRequest = <T>(context: Context, req: HttpRequest, fun: (req: HttpRequest) => T): void => {
  let response;
  let status = 200;
  try {
    response = fun(req);
    if (req.method === 'DELETE') {
      status = 204;
    }
    context.res = {
      ...context.res,
      status,
      body: response,
    };
  } catch (error) {
    if (error instanceof ApplicationError) {
      context.res = {
        ...context.res,
        status: error.code,
        body: error.toResponse(),
      };
    } else {
      throw error;
    }
  }
  context.done();
};

export default httpTrigger;
