import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-terms-and-conditions',
    standalone: true,
    imports: [TranslateModule],
    templateUrl: './terms-and-conditions.component.html',
    styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {
    lang = localStorage.getItem('language') ?? 'en';
}
