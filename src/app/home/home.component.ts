import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { AttendanceComponent } from "../attendance/attendance.component";
import { Router } from "@angular/router";
import { ChartsComponent } from "../charts/charts.component";
import { TourService } from "ngx-tour-md-menu";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "../auth.service";
import { MatDialog } from "@angular/material";
import { RecOptionsDialogComponent } from "../rec-options-dialog/rec-options-dialog.component";
import { EditRosterComponent } from "../edit-roster/edit-roster.component";
import { AdminUserListComponent } from "../admin-user-list/admin-user-list.component";
import { ResetManualComponent } from "../password-actions/reset-manual/reset-manual.component";
import { DatabaseService } from "../database.service";
import { AddShiftDialogComponent } from "../add-shift-dialog/add-shift-dialog.component";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  public options: GridsterConfig = {
    itemChangeCallback: this.itemChange,
    itemResizeCallback: this.itemResize,
    resizable: {
      enabled: false
    },
    draggable: {
      enabled: false
    }
  };
  public dashboard;
  public tabActive;
  public cookieValue: string;
  public admin;
  public activeDash;

  public adminDash = [
    {
      x: 0,
      y: 0,
      rows: 10,
      cols: 10,
      component: AdminUserListComponent
    }
  ];
  public standardDash = [
    {
      x: 0,
      y: 0,
      rows: 16,
      cols: 10,
      component: AttendanceComponent
    },
    {
      x: 10,
      y: 0,
      rows: 8,
      cols: 6,
      component: EditRosterComponent
    },
    {
      x: 10,
      y: 8,
      rows: 8,
      cols: 6,
      component: ChartsComponent
    }
  ];
  constructor(
    private authService: AuthService,
    public router: Router,
    private tourService: TourService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private databaseService: DatabaseService
  ) {
    this.admin = this.authService.isAdmin;
  }

  itemChange(item, itemComponent) {
    //console.info("itemChanged", item, itemComponent);
  }

  itemResize(item, itemComponent) {
    //console.log("itemResized", item, itemComponent);
  }

  ngOnInit() {
    if (this.admin) {
      this.dashboard = this.adminDash;
      this.activeDash = "admin";
    } else {
      this.dashboard = this.standardDash;
      this.activeDash = "standard";
    }
  }

  ngAfterViewInit() {
    if (
      this.cookieService.check("tourComplete") !== true &&
      !this.authService.isAdmin
    ) {
      this.cookieService.set("tourComplete", "true");
      this.tourService.initialize([
        {
          anchorId: "start_off",
          content:
            "Welcome to the attendance editing and analysis system. " +
            "Let's start by going through some of the tools.",
          title: "Welcome",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_attendance",
          content: `This is the attendance table.
            You will find teachers below the students for every grade
            You can switch between grades and roles with these tabs`,
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_tab",
          content: `Student's names are color coded. BLACK means everything is okay,
          RED means you need to edit something, and TEAL means that it was edited and is now okay.`,
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_tab",
          content: `There is also a clickable EDIT button which allows you to make edits to
          That specific student. When making edits, make sure to click FINISH after you are
          Finished to send your changes, and save them.`
        },
        {
          anchorId: "attendance_date",
          content: "You can click here to change the attendance date.",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "attendance_download",
          content:
            "You can click here to download the attendance data for the selected date.",
          title: "Attendance",
          enableBackdrop: true
        },
        {
          anchorId: "chart_chart",
          content: "This chart shows the breakdown of attendance on a date.",
          title: "Chart",
          enableBackdrop: true
        },
        {
          anchorId: "chart_date",
          content: "You can change the date here",
          title: "Chart",
          enableBackdrop: true
        },
        {
          anchorId: "chart_role",
          content:
            "You can also change the role to see the breakdown of teachers, management etc.",
          title: "Chart",
          enableBackdrop: true
        },
        {
          anchorId: "edit-roster",
          content: `Here we have the roster table. This table will hold the whole roster of your current RE shift`,
          title: "Roster",
          enableBackdrop: true
        },
        {
          anchorId: "edit-roster_add",
          content: `Click here to add students to your roster`,
          title: "Roster",
          enableBackdrop: true
        },
        {
          anchorId: "edit-roster_delete",
          content: `Click here to remove students to your roster. Make sure you are
          first selecting people to remove before clicking this button.`,
          title: "Roster",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code",
          content: "Up here you can go through all the qr codes.",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_file",
          content: "Upload your file here to get new qr_codes.",
          title: "QR Codes",
          enableBackdrop: true,
          route: "/createqr"
        },
        {
          anchorId: "qr_code_pic",
          content:
            "Use this picture to help you figure out how to create the file.",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_roster",
          content: `Another (simpler) option is for you to update your roster fully on
          the home page, and then click here to generate QR Codes for your full Roster`,
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_reset",
          content: "You can clear and reset everything with this button.",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "qr_code_back",
          content: "And You can go back with this button",
          title: "QR Codes",
          enableBackdrop: true
        },
        {
          anchorId: "home_avatar",
          content:
            "Click here to access options with your account. Use this to logout when you are finished." +
            "You will also automatically be logged out when you close the tab, or browser.",
          title: "Avatar",
          enableBackdrop: true,
          route: "/home"
        },
        {
          anchorId: "end",
          content: "Thats all for now.",
          title: "Complete",
          enableBackdrop: false
        }
      ]);
      this.startTour();
    }
  }

  handleToolbarClick(event) {
    switch (event) {
      case "logout":
        this.authService.signOut().then(() => {
          this.router.navigate(["/login"]);
        });
        break;
      case "options":
        this.dialog
          .open(RecOptionsDialogComponent, {
            data: { config: this.authService.getCenters() }
          })
          .afterClosed()
          .toPromise()
          .then(res => {
            this.authService.setOptions(res.currentConfig);
            this.dashboard = this.standardDash;
          });
        break;
      case "qr":
        this.router.navigate(["/createqr"]);
        break;
      case "change-password":
        this.dialog.open(ResetManualComponent);
        break;
      case "switch":
        if (this.activeDash === "admin") {
          if (this.authService.hasCurrentConfig()) {
            this.dashboard = this.standardDash;
          } else {
            this.dialog
              .open(RecOptionsDialogComponent, {
                data: { config: this.authService.getCenters() }
              })
              .afterClosed()
              .toPromise()
              .then(res => {
                this.authService.setOptions(res.currentConfig);
                this.dashboard = this.standardDash;
              });
          }
        } else this.dashboard = this.adminDash;
      case "addShift":
        this.dialog
          .open(AddShiftDialogComponent, {
            data: { config: this.authService.getCurrentConfig() }
          })
          .afterClosed()
          .toPromise()
          .then(res => {
            if (res) {
              this.databaseService.addNewShift(res);
            }
          });
    }
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }
  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
  addItem() {
    this.dashboard.push({ x: 0, y: 0, rows: 0, cols: 0 });
  }

  startTour() {
    this.tourService.start();
  }
}
