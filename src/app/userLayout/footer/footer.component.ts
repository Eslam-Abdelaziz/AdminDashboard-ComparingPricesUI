import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  //life cycle
  constructor(private headerservice:HeaderService) {
  }

  //methods
  changeTenant(tenant: string) {
    this.headerservice.changeTenant(tenant);
  }
}
