import { HttpRequest } from '@azure/functions';

import Slots from '../../domain/slots';
import { SlotResponse, SlotsQuery, KeyValue } from '../../interfaces/slots';
import { isInvalid, spansMoreThan6Months } from '../../utils/date';
import { BadRequestError } from '../../errors';
import checkForErrorTriggers from '../../utils/error';
import { REQUEST_TYPE } from '../../enums';

export const getSlots = (req: HttpRequest): SlotResponse[] => {
  const { testCentreId } = parseParams(req.params);
  const { testTypes, dateFrom, dateTo } = parseQuery(req.query);

  const slots = new Slots(testCentreId, testTypes);
  slots.generateRandomBetween(dateFrom, dateTo);
  slots.sortByDateTime();

  return slots.toResponse();
};

const parseParams = (params: KeyValue): { testCentreId: string } => {
  const { testCentreId } = params;

  checkForErrorTriggers(testCentreId, REQUEST_TYPE.SLOTS);

  return {
    testCentreId,
  };
};

const parseQuery = (query: KeyValue): SlotsQuery => {
  let testTypes;
  try {
    testTypes = JSON.parse(query.testTypes);
  } catch (e) {
    throw new BadRequestError();
  }

  const dateFrom = new Date(query.dateFrom);
  const dateTo = new Date(query.dateTo);
  if (isInvalid(dateFrom) || isInvalid(dateTo) || dateFrom > dateTo || spansMoreThan6Months(dateFrom, dateTo)) {
    throw new BadRequestError();
  }

  return {
    testTypes,
    dateFrom,
    dateTo,
  };
};
