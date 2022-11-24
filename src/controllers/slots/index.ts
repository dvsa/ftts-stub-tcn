import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getSlots } from './slots-controller';
import { ApplicationError } from '../../errors';

const httpTrigger: AzureFunction = (context: Context, req: HttpRequest): void => {
  if (context.res) {
    context.res.headers = { 'Content-Type': 'application/json' };
  }

  let response;
  try {
    response = getSlots(req);
    context.res = {
      ...context.res,
      status: 200,
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
