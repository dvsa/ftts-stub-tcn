import config from '../config';
import Slot from './slot';
import { random } from '../utils/math';
import { DateAvailability, SlotResponse } from '../interfaces/slots';

const {
  dayEndHour, dayStartHour, skipDays, fullDays,
} = config.slots;
const maxSlotsInDay = ((dayEndHour + 1) - dayStartHour) * 4;

class Slots {
  constructor(
    private testCentreId: string,
    private testTypes: string[],
    private slots: Slot[] = [],
  ) {}

  public asArray(): Slot[] {
    return this.slots;
  }

  public toResponse(availability?: DateAvailability): SlotResponse[] {
    return this.slots.map((slot) => ({
      testCentreId: this.testCentreId,
      testTypes: this.testTypes,
      startDateTime: slot.startTime.toISOString(),
      quantity: slot.quantity,
      ...availability,
    }));
  }

  public sortByDateTime(): void {
    this.slots.sort((slot1, slot2) => (slot1.isBefore(slot2) ? -1 : 1));
  }

  public generateRandomBetween(dateFrom: Date, dateTo: Date): void {
    const date = new Date(dateFrom);
    while (date <= dateTo) {
      if (!skipDays.includes(date.getDay())) {
        if (fullDays.includes(date.getDay())) {
          this.addFullDayOfSlotsOn(date);
        } else {
          this.addRandomSlotsOn(date);
        }
      }
      date.setDate(date.getDate() + 1);
    }
  }

  private addFullDayOfSlotsOn(date: Date): void {
    this.addRandomSlotsOn(date, maxSlotsInDay);
  }

  private addRandomSlotsOn(date: Date, numberOfSlots = random(2, maxSlotsInDay)): void {
    const slotsCapacity = this.slots.length + numberOfSlots;
    while (this.slots.length < slotsCapacity) {
      const slot = Slot.on(date);
      slot.randomiseStartTime();
      slot.randomiseQuantity();
      this.add(slot);
    }
  }

  private add(slot: Slot): void {
    if (!this.contains(slot)) {
      this.slots.push(slot);
    }
  }

  private contains(slot: Slot): boolean {
    return this.slots.find((s) => s.equals(slot)) !== undefined;
  }
}

export default Slots;
