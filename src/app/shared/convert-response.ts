import {
  OfficeHour,
  PeerTeacher,
  Time,
  DayOfWeek
} from "../_models/office-hour.model";

export function convertResponseToPeerTeachers(response: any[]): PeerTeacher[] {
  return response.map(person => {
    const peerTeacher = new PeerTeacher();
    peerTeacher.name = person.name.split("|")[0];
    peerTeacher.email = person.email_url.replace("mailto:", "");
    // We have to do this because the html structure is inconsistent on the PT web page
    if (person.pic) {
      peerTeacher.photoUrl = person.pic;
    } else {
      peerTeacher.photoUrl = person.pic_alt;
    }
    peerTeacher.classes = person.course_list.map(course => course.name);
    if (person.office_hours_list) {
      peerTeacher.officeHours = person.office_hours_list
        .map(officeHour => officeHour.name)
        .map(officeHour => convertToOfficeHours(officeHour));
      // Flatten out array
      peerTeacher.officeHours = [].concat.apply([], peerTeacher.officeHours);
    }
    return peerTeacher;
  });
}

export function convertToOfficeHours(entry: string): OfficeHour[] {
  entry = entry.toLowerCase();
  const dayRegex = /[a-z]+day/g;
  const weekdayName = entry.match(dayRegex)[0].toUpperCase();
  const weekday: DayOfWeek = <DayOfWeek>DayOfWeek[weekdayName.toUpperCase()];
  entry = entry.replace(dayRegex, "");
  entry = stripCharacters(entry, /\s/g, /,/g, /\./g);
  const rawtimes = entry.split("|");
  const officeHours = rawtimes
    .map(rawtime => convertTimeToOfficeHour(rawtime))
    .map(officeHour => {
      officeHour.dayOfWeek = weekday;
      return officeHour;
    });
  return officeHours;
}

export function convertTimeToOfficeHour(time: string): OfficeHour {
  const period = time.match(/am|pm/g)[0];
  time = time.replace(/am|pm/g, "");
  const times = time.split("-");
  const officeHour = new OfficeHour();
  officeHour.start = convertStringToTime(times[0]);
  officeHour.end = convertStringToTime(times[1]);
  return officeHour;
}

export function convertStringToTime(s: string): Time {
  const time = new Time();
  if (s.search(":") > -1) {
    time.hour = parseInt(s.split(":")[0]);
    time.minute = parseInt(s.split(":")[1]);
  } else {
    time.hour = parseInt(s);
    time.minute = 0;
  }
  // The Peer Teacher Room is only open 9AM - 8PM
  // So we can assume any hour between 12 and 9 is PM
  if (time.hour < 9 && time.hour >= 1) {
    time.hour += 12;
  }
  return time;
}

export function stripCharacters(s: string, ...args: any[]): string {
  args.forEach(target => {
    s = s.replace(target, "");
  });
  return s;
}
