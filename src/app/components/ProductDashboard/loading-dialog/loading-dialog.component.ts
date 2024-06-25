import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
@Component({
    selector: 'app-loading-dialog',
    standalone: true,
    imports: [ProgressSpinnerModule, DialogModule],
    templateUrl: './loading-dialog.component.html',
})
export class LoadingDialogComponent {
    display: boolean = true;
    @Input() header: string = 'Loading';
}
