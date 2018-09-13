export class PeerTeacher {
  name: string;
  photoUrl: string;
  email: string;
  officeHours: OfficeHour[];
  classes: string[];
}

export class OfficeHour {
  dayOfWeek: DayOfWeek;
  start: Time;
  end: Time;
}

// Military Time
export class Time {
  hour: number;
  minute: number;
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
