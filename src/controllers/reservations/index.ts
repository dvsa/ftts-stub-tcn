import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ApplicationError } from '../../errors';
import { ReservationsResponse } from '../../interfaces/reservations';
import { deleteReservation, makeReservation } from './reservations-controller';

const httpTrigger: AzureFunction = (context: Context, req: HttpRequest): void => {
  if (context.res) {
    context.res.headers = { 'Content-Type': 'application/json' };
  }
  switch (req.method) {
    case 'POST':
      handleRequest<ReservationsResponse[]>(context, req, makeReservation);
      break;
    case 'DELETE':
      handleRequest<void>(context, req, deleteReservation);
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: {
          ...context.res?.headers,
          ...error.headers,
        },
        body: error.toResponse(),
      };
    } else {
      throw error;
    }
  }
  context.done();
};

export default httpTrigger;
