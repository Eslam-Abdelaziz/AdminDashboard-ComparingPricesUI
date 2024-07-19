import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AuthService } from 'src/app/services/auth.service';
import { FooterComponent } from 'src/app/userLayout/footer/footer.component';
import { HeaderComponent } from 'src/app/userLayout/header/header.component';

@Component({

  selector: 'app-user-layout',
  standalone: true,
  imports: [

    PanelMenuModule,HeaderComponent,FooterComponent

  ],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']

})
export class UserLayoutComponent {
    items: any[];
    currentLanguage = localStorage.getItem('language') ?? 'en';
    constructor(private authService: AuthService,private translate :TranslateService) {}
    ngOnInit() {
        this.items = [
            {
                label:
                this.currentLanguage == 'en' ? 'Prfile' : 'الملف الشخصي',
                icon: 'pi pi-fw pi-user',
                routerLink: ['profile'],
            },
            {
                label: this.currentLanguage == 'en' ? 'Favourite' : 'المفضلة',
                icon: 'pi pi-fw pi-heart',
                routerLink: ['favorites'],
            },
            {
                label: this.currentLanguage == 'en' ? 'Histroy' : 'المحفوظات',
                icon: 'pi pi-fw pi-history',
                routerLink: ['history'],
            },
            {
                label: this.currentLanguage == 'en' ? 'Aler' : 'التنبيهات',
                icon: 'pi pi-fw pi-bell',
                routerLink: ['alerts'],
            },
            {
                label:this.currentLanguage == 'en' ? 'Logout' : 'تسجيل الخروج',
                icon: 'pi pi-fw pi-sign-out',
                command: () => this.logout(),
            },
        ];
    }

    logout() {
        this.authService.logout();
    }
}
