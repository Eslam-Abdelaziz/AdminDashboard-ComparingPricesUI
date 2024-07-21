import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FavIcon',
    pure: true,
    standalone:true
})
export class FavIconPipe implements PipeTransform {
    transform(link: string): string {
        const url = new URL(link);
        const domain = url.hostname;
        const size = 96; // specify the desired size of the favicon
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
        return faviconUrl;
    }
}
