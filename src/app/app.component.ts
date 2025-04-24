import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    NgxSpinnerComponent,
    NgxSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isSidebarOpen: boolean = false;
  isLoginPage: boolean = false;
  userData: any = null;

  ngOnInit(): void {
    this._Router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this._Router.url === '/login';
      }
    });
  }
  constructor(private _Router: Router, private _CookieService: CookieService) {
    this.userData = this._CookieService.get('_token')
      ? { loggedIn: true }
      : null;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
