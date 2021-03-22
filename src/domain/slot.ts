import config from '../config';
import { random, sample } from '../utils/math';

const { dayEndHour, dayStartHour, maxSlotQuantity } = config.slots;

class Slot {
  public static on(date: Date): Slot {
    const startTime = new Date(date);
    startTime.setHours(dayStartHour, 0, 0, 0);
    return new Slot(startTime, 1);
  }

  constructor(
    public startTime: Date,
    public quantity: number,
  ) {}

  public randomiseStartTime(): void {
    const hour = random(dayStartHour, dayEndHour);
    const min = sample([0, 15, 30, 45]);
    this.startTime.setHours(hour, min, 0, 0);
  }

  public randomiseQuantity(): void {
    this.quantity = random(1, maxSlotQuantity);
  }

  public equals(another: Slot): boolean {
    return this.startTime.getTime() === another.startTime.getTime();
  }

  public isBefore(another: Slot): boolean {
    return this.startTime < another.startTime;
  }
}

export default Slot;
