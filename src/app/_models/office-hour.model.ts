export class PeerTeacher {
  name: string;
  photoUrl: string;
  email: string;
  officeHours: OfficeHour[];
  classes: string[];

  public isActive = (): boolean => {
    if (!this.officeHours) {
      return false;
    }
    for (let i = 0; i < this.officeHours.length; i++) {
      const officeHour = this.officeHours[i];
      if (officeHour.isActive()) {
        return true;
      }
    }
    return false;
  };
}

export class OfficeHour {
  dayOfWeek: DayOfWeek;
  start: Time;
  end: Time;
  public isActive = (): boolean => {
    const currentDate = new Date();
    const currentWeekDay: DayOfWeek = currentDate.getDay();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    if (this.dayOfWeek === currentWeekDay) {
      if (this.end.hour > currentHour && this.start.hour < currentHour) {
        return true;
      } else if (this.end.hour === currentHour) {
        if (this.end.minute > currentMinute) {
          return true;
        }
      } else if (this.start.hour === currentHour) {
        if (this.start.minute < currentMinute) {
          return true;
        }
      }
    }
  };
}

// Military Time
export class Time {
  hour: number;
  minute: number;

  public toString = (): string => {
    let period = "AM";
    let hour = this.hour;
    if (this.hour > 12) {
      hour -= 12;
      period = "PM";
    }
    if (this.minute === 0) {
      return `${hour} ${period}`;
    }
    if (this.minute > 9) {
      return `${hour}:${this.minute} ${period}`;
    } else {
      return `${hour}:${this.minute}0 ${period}`;
    }
  };
}

export enum DayOfWeek {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}
