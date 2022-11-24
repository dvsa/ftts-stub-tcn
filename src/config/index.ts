import { DAY } from '../enums';

export default {
  slots: {
    dayStartHour: 9,
    dayEndHour: 17,
    maxSlotQuantity: 5,
    skipDays: [DAY.SUNDAY],
    fullDays: [DAY.FRIDAY],
  },
};
