import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-contact-us',
    standalone: true,
    imports: [TranslateModule],
    templateUrl: './contact-us.component.html',
    styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
    lang= localStorage.getItem('language')??'en'

}
