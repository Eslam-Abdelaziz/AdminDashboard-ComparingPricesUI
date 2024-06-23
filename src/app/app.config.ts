import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

//import { routes } from './app-routing.module';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { myHttpInterceptor } from './Intercetor/my-http.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [ provideClientHydration(), importProvidersFrom(BrowserAnimationsModule),provideHttpClient(),
        provideHttpClient(withInterceptors([myHttpInterceptor])),
    ]
};
