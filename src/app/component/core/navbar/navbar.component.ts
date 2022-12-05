import { Component, Input, OnInit, HostListener, ElementRef } from '@angular/core';
import { IMenu } from 'src/app/models/IMenu';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  @Input()
  public menuItems: IMenu[] = [];
  public outsideClick = false;
  public navbarOpen = false;

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  ToggleNavBar() {
    this.navbarOpen = !this.navbarOpen;
  }

  @HostListener('window:click', ['$event'])
  clickout(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
      if (this.navbarOpen) {
        this.navbarOpen = false;
      }

      this.outsideClick = false;
    } else {
      this.outsideClick = true;
    }
  }

}
