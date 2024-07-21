import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'domainName',
    standalone: true
})
export class DomainNamePipe implements PipeTransform {
    transform(link: string): string {
        const url = new URL(link);
        const domainName = url.hostname.split('.')[1];
        return domainName;
    }
}
