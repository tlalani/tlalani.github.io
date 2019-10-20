import { Component, OnInit, Inject } from "@angular/core";
import { Roles, Grades, Person, PersonDTO, Mgmt } from "src/constants";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-add-students-dialog",
  templateUrl: "./add-students-dialog.component.html",
  styleUrls: ["./add-students-dialog.component.scss"]
})
export class AddStudentsDialogComponent implements OnInit {
  public roles = Object.keys(Roles);
  public grades;
  public person: PersonDTO = new PersonDTO({});
  result: PersonDTO[] = [];
  private re_class;
  public mgmt = Object.keys(Mgmt);
  constructor(
    public dialogRef: MatDialogRef<AddStudentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.re_class = data.re_class;
  }

  ngOnInit() {
    this.grades = Grades[this.re_class];
  }

  hasGrade() {
    return this.mgmt.indexOf(this.person.Role) === -1;
  }

  canBeAdded() {
    return (
      this.person.Role &&
      ((this.hasGrade() && this.person.Grade) || !this.hasGrade()) &&
      this.person.Name &&
      this.person.Name.length > 0
    );
  }

  submit() {
    this.result.push(this.person);
    this.person = new PersonDTO({});
  }

  print(obj) {
    let s = "";
    Object.entries(obj).forEach(([key, val]) => {
      if (val) {
        s += key + ":" + val + "      ";
      }
    });
    return s;
  }

  undoAdd(i) {
    this.result.splice(i, 1);
  }

  closeDialog(hasResult) {
    if (hasResult) {
      this.dialogRef.close({ result: this.result });
    } else {
      this.dialogRef.close();
    }
  }
}