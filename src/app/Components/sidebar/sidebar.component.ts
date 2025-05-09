import { Component, Input} from '@angular/core';
import {  RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent{
    userData: any = null;

    @Input() isSidebarOpen = false;

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }


}
