import { HttpRequest, HttpRequestParams, HttpRequestQuery } from '@azure/functions';

import Slots from '../../domain/slots';
import {
  SlotResponse,
  SlotsQuery,
  DateAvailability,
} from '../../interfaces/slots';
import { generateAvailabilityBasedOnPreferredDate, isInvalid, spansMoreThan6Months } from '../../utils/date';
import { BadRequestError } from '../../errors';
import checkForErrorTriggers from '../../utils/checkForErrorTriggers';
import { RequestType } from '../../enums';

export const getSlots = (req: HttpRequest): SlotResponse[] => {
  const { testCentreId } = parseParams(req.params as Record<string, string>);
  const {
    testTypes,
    dateFrom,
    dateTo,
    preferredDate,
  } = parseQuery(req.query);

  const slots = new Slots(testCentreId, testTypes);
  slots.generateRandomBetween(dateFrom, dateTo);
  slots.sortByDateTime();

  let optionalAvailability: DateAvailability | undefined;
  if (preferredDate) {
    optionalAvailability = generateAvailabilityBasedOnPreferredDate(preferredDate);
  }

  return slots.toResponse(optionalAvailability);
};

const parseParams = (params: HttpRequestParams): { testCentreId: string } => {
  const { testCentreId } = params;

  if (!testCentreId) {
    throw new BadRequestError();
  }

  checkForErrorTriggers(testCentreId, RequestType.SLOTS);

  return {
    testCentreId,
  };
};

const parseQuery = (query: HttpRequestQuery): SlotsQuery => {
  if (!query.testTypes || !query.dateFrom || !query.dateTo) {
    throw new BadRequestError();
  }

  let testTypes: string[];
  try {
    testTypes = JSON.parse(query.testTypes) as string[];
  } catch (e) {
    throw new BadRequestError();
  }

  const dateFrom = new Date(query.dateFrom);
  const dateTo = new Date(query.dateTo);
  if (isInvalid(dateFrom) || isInvalid(dateTo) || dateFrom > dateTo || spansMoreThan6Months(dateFrom, dateTo)) {
    throw new BadRequestError();
  }

  let preferredDate;
  if (query.preferredDate) {
    preferredDate = new Date(query.preferredDate);
  }

  return {
    testTypes,
    dateFrom,
    dateTo,
    preferredDate,
  };
};
