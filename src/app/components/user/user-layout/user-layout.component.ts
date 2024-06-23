import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [

    PanelMenuModule,

  ],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent {
  items: any[];
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.items = [
      {
        label: ' Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['profile']
      },
      {
        label: ' Favorites',
        icon: 'pi pi-fw pi-heart',
        routerLink: ['favorites']
      },
      {
        label: ' History',
        icon: 'pi pi-fw pi-history',
        routerLink: ['history']
      },
      {
        label: ' Alerts',
        icon: 'pi pi-fw pi-bell',
        routerLink: ['alerts']
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.authService.logout();
  }
}
