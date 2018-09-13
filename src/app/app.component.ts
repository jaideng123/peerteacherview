import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  PeerTeacher,
  DayOfWeek,
  OfficeHour,
  Time
} from "./_models/office-hour.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  people = [];
  currentPeople = [];
  reviewSessions = [];
  constructor(http: HttpClient) {
    http.get("api/teachers").subscribe(
      (data: any) => {
        this.people = data.peer_teachers;
        this.updateTeachers();
      },
      err => console.log(err)
    );
    // setInterval(() => this.updateTeachers(), 5000);
  }

  convertToOfficeHours(entry: string): OfficeHour[] {
    entry = entry.toLowerCase();
    const dayRegex = /[a-z]+day/g;
    const weekdayName = entry.match(dayRegex)[0].toUpperCase();
    const weekday: DayOfWeek = <DayOfWeek>DayOfWeek[weekdayName.toUpperCase()];
    entry = entry.replace(dayRegex, "");
    entry = this.stripCharacters(entry, /\s/g, /,/g, /\./g);
    const rawtimes = entry.split("|");
    const officeHours = rawtimes
      .map(rawtime => this.convertTimeToOfficeHour(rawtime))
      .map(officeHour => {
        officeHour.dayOfWeek = weekday;
        return officeHour;
      });
    return officeHours;
  }

  convertTimeToOfficeHour(time: string): OfficeHour {
    const period = time.match(/am|pm/g)[0];
    time = time.replace(/am|pm/g, "");
    const times = time.split("-");
    const officeHour = new OfficeHour();
    officeHour.start = this.convertStringToTime(times[0]);
    officeHour.end = this.convertStringToTime(times[1]);
    return officeHour;
  }

  convertStringToTime(s: string): Time {
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

  stripCharacters(s: string, ...args: any[]) {
    args.forEach(target => {
      s = s.replace(target, "");
    });
    return s;
  }

  convertResponseToPeerTeachers(response: any[]): PeerTeacher[] {
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
          .map(officeHour => this.convertToOfficeHours(officeHour));
        // Flatten out array
        peerTeacher.officeHours = [].concat.apply([], peerTeacher.officeHours);
      }
      return peerTeacher;
    });
  }

  peerTeacherIsActive(peerTeacher: PeerTeacher): boolean {
    if (!peerTeacher.officeHours) {
      return false;
    }
    const currentDate = new Date();
    const currentWeekDay: DayOfWeek = currentDate.getDay();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    for (let i = 0; i < peerTeacher.officeHours.length; i++) {
      const officeHour = peerTeacher.officeHours[i];
      if (officeHour.dayOfWeek === currentWeekDay) {
        console.log(peerTeacher);
        if (
          officeHour.end.hour > currentHour &&
          officeHour.start.hour < currentHour
        ) {
          return true;
        } else if (officeHour.end.hour === currentHour) {
          if (officeHour.end.minute > currentMinute) {
            return true;
          }
        } else if (officeHour.start.hour === currentHour) {
          if (officeHour.start.minute < currentMinute) {
            return true;
          }
        }
      }
    }
    return false;
  }

  convertToDayOfWeekString(dayOfWeek: DayOfWeek): string {
    return DayOfWeek[dayOfWeek].substring(0, 3);
  }

  convertTimeToString(time: Time): string {
    let period = "AM";
    let hour = time.hour;
    if (time.hour > 12) {
      hour -= 12;
      period = "PM";
    }
    if (time.minute === 0) {
      return `${hour} ${period}`;
    }
    if (time.minute > 9) {
      return `${hour}:${time.minute} ${period}`;
    } else {
      return `${hour}:${time.minute}0 ${period}`;
    }
  }

  updateTeachers() {
    console.log("Checking");
    const peerTeachers = this.convertResponseToPeerTeachers(this.people);
    this.currentPeople = peerTeachers.filter(this.peerTeacherIsActive);
  }
}
