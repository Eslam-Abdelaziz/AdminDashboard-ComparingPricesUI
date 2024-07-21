import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FavIcon',
    pure: true,
    standalone:true
})
export class FavIconPipe implements PipeTransform {
    transform(link: string): string {
        const url = new URL(link);
        const domainName = 'https://' + url.hostname + '/favicon.ico';
        return domainName;
    }
}
