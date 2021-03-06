import { Component, OnInit, Input } from "@angular/core";
import { Person, PersonDTO, DEFAULT_USER_IMAGE } from "src/constants";
import { QrCodeService } from "./qr-code.service";

@Component({
  selector: "app-qr-code",
  templateUrl: "./qr-code.component.html",
  styleUrls: ["./qr-code.component.scss"]
})
export class QrCodeComponent implements OnInit {
  @Input() person: PersonDTO;
  public displayString: string;
  public shouldExist: boolean = true;
  public qrlink: string;
  public piclink: string;
  constructor(private qrCodeService: QrCodeService) {}

  ngOnInit() {
    this.displayString = this.person.Role + ":" + this.person.Name;
    const { folder, index } = this.qrCodeService.getFolderAndIndex(this.person);

    this.piclink =
      "https://firebasestorage.googleapis.com/v0/b/attendance-rec.appspot.com/o/pictures%2F" +
      folder +
      "%2F" +
      index +
      ".jpg?alt=media";

    this.qrlink =
      "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=" +
      this.displayString;
  }

  sendDelete() {
    this.shouldExist = false;
  }

  getDefaultUrl() {
    this.piclink = DEFAULT_USER_IMAGE;
  }
}
