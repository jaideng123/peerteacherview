import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PeerTeacher } from "../_models/office-hour.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { convertResponseToPeerTeachers } from "../shared/convert-response";

@Injectable({
  providedIn: "root"
})
export class PeerTeacherService {
  constructor(private http: HttpClient) {}

  public FetchPeerTeachers(): Observable<PeerTeacher[]> {
    return this.http.get("api/teachers").pipe(
      map(data => (data as any).peer_teachers),
      map(convertResponseToPeerTeachers)
    );
  }
}
