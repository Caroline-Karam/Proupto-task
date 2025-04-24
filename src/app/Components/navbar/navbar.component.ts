import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    SidebarModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // isLoginPage: boolean = false;
  userData: any = null;

  // // Check the current route and update `isLoginPage`
  // ngOnInit(): void {
  //   this._Router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       this.isLoginPage = this._Router.url === '/login';
  //     }
  //   });
  // }
  constructor(
    // private _Router: Router,
    // private _CookieService: CookieService
  ) {
    // this.userData = this._CookieService.get('_token')
    //   ? { loggedIn: true }
    //   : null;
  }

  @Output() toggleSidebar = new EventEmitter<void>();

  onButtonClick() {
    this.toggleSidebar.emit();
  }
}
