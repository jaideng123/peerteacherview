import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  PeerTeacher,
  DayOfWeek,
  OfficeHour,
  Time
} from "./_models/office-hour.model";
import { PeerTeacherService } from "./_services/peer-teacher.service";
import { Observable, interval } from "rxjs";
import { timeInterval, flatMap, startWith, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  currentPeople$: Observable<PeerTeacher[]>;
  constructor(private peerTeacherService: PeerTeacherService) {
    this.currentPeople$ = interval(5000).pipe(
      startWith(0),
      timeInterval(),
      flatMap(() => peerTeacherService.FetchPeerTeachers()),
      map(peerTeachers =>
        peerTeachers.filter(peerTeacher => peerTeacher.isActive())
      )
    );
  }

  convertToDayOfWeekString(dayOfWeek: DayOfWeek): string {
    return DayOfWeek[dayOfWeek].substring(0, 3);
  }
}
