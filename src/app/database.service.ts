import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import {
  AngularFireReturnTypes,
  getSchoolYearFromDate,
  Grades,
  PersonDTO,
  getArray,
  Roles,
  Statuses,
  shiftStartTime,
  Person
} from "src/constants";
import { first } from "rxjs/operators";
import { formatDate } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  constructor(private db: AngularFireDatabase) {}

  public get(queryString, type?): Promise<any> {
    switch (type) {
      case AngularFireReturnTypes.Array:
        return this.db
          .list(queryString)
          .valueChanges()
          .pipe(first())
          .toPromise();
      //array
      case AngularFireReturnTypes.Object:
      default:
        return this.db
          .object(queryString)
          .valueChanges()
          .pipe(first())
          .toPromise();
    }
  }

  public set(queryString, object) {
    return this.db.object(queryString).set(object);
  }

  public remove(queryString) {
    return this.db.object(queryString).remove();
  }

  public getRoster(schoolYear, config) {
    let cc = config;
    let shift = cc.re_shift.replace(", ", "/");
    const queryString =
      "REC/" +
      cc.re_center +
      "/" +
      cc.re_class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear;
    return this.get(queryString);
  }

  public queryAttendanceForSpecificDay(date, config) {
    const schoolYear = getSchoolYearFromDate(date);
    let shift = config.re_shift.replace(", ", "/");
    const queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/Dates/" +
      schoolYear +
      "/" +
      formatDate(date, "MMM d, y", "en-US");
    return this.get(queryString);
  }

  public async deleteFromRoster(person, schoolYear, config) {
    let shift = config.re_shift.replace(", ", "/");
    let queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear +
      "/" +
      person.Role +
      "/";
    if (person.Grade) {
      queryString += person.Grade + "/";
    }
    let res = await this.get(queryString);
    let index = res.indexOf(person.Name);
    res.splice(index, 1);
    this.set(queryString, res);
  }

  public async sendToRoster(person, schoolYear, config) {
    let shift = config.re_shift.replace(", ", "/");
    let queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/People/" +
      schoolYear +
      "/" +
      person.Role +
      "/";
    if (person.Grade) {
      queryString += person.Grade + "/";
    }
    let res = await this.get(queryString);
    if (res) {
      res.push(person.Name);
      this.set(queryString, res);
    } else {
      this.set(queryString, [person.Name]);
    }
  }

  public async getFormattedRoster(schoolYear, config) {
    let result: any = {};
    try {
      let roles = await this.getRoster(schoolYear, config);
      Object.entries(roles).forEach(([role, people]) => {
        let list: any = {};
        if (Grades[config.re_class].indexOf(Object.keys(people)[0]) !== -1) {
          Object.entries(people).forEach(([gradeStr, peopleInGrade]) => {
            list[gradeStr] = [];
            Object.entries(peopleInGrade).forEach(person =>
              list[gradeStr].push(
                new PersonDTO({ Name: person[1], Grade: gradeStr, Role: role })
              )
            );
          });
        } else {
          list.people = [];
          Object.entries(people).forEach(person =>
            list.people.push(
              new PersonDTO({ Name: person[1], Grade: null, Role: role })
            )
          );
        }
        result[role] = list;
      });
      return result;
    } catch (err) {
      console.log("ERROR ON [getPeopleFormatted]", err);
      return result;
    }
  }

  public async queryAttendanceForSpecificDayFormatted(date: Date, config) {
    let result: any = {};
    try {
      let items = await this.queryAttendanceForSpecificDay(date, config);
      if (items) {
        Object.entries(items).forEach(([role, snapShot]) => {
          let peoplePresent = getArray(snapShot, role, config.re_class);
          result[role] = peoplePresent;
        });
        return result;
      }
    } catch (err) {
      console.log("ERROR ON [queryAttendanceForSpecificDayFormatted],", err);
      return result;
    }
  }

  public sendToDatabase(date: Date, person: Person, config: any) {
    const schoolYear = getSchoolYearFromDate(date);
    let shift = config.re_shift.replace(", ", "/");
    let queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      shift +
      "/Dates/" +
      schoolYear +
      "/" +
      formatDate(date, "MMM d, y", "en-US");
    queryString += "/" + Roles[person.Role];
    if (person.Grade) queryString += "/" + person.Grade;
    queryString += "/" + person.Name;
    let obj = {};
    obj["Status"] = person.Status;
    if (person.Time) obj["Time"] = person.Time;
    if (obj["Status"] === Statuses.Present && (person.Reason || !person.Time))
      obj["Time"] = shiftStartTime(shift, true);
    else if (obj["Status"] === Statuses.Tardy) {
      obj["Time"] = shiftStartTime(shift, true);
    }
    if (person.Status !== Statuses.Present) {
      obj["Reason"] = person.Reason;
      if (person.Comments) {
        obj["Comments"] = person.Comments;
      }
    }
    this.set(queryString, obj);
  }

  public addNewShift(config) {
    const queryString =
      "REC/" +
      config.re_center +
      "/" +
      config.re_class +
      "/Shifts/" +
      config.re_shift.day +
      "/" +
      config.re_shift.startTime +
      "-" +
      config.re_shift.endTime +
      "/People/" +
      config.re_shift.schoolYear;
    this.set(queryString, 0);
  }
}
