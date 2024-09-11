import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem("UserToken");
        let tenantId = '1'; // Replace this with the actual tenant logic

        let clonedRequest = req;

        // Add Authorization header if token exists
        if (token) {
            clonedRequest = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${token}`)
            });
        }

        // Add Tenant header if tenantId exists
        if (tenantId) {
            clonedRequest = clonedRequest.clone({
                headers: clonedRequest.headers.set("Tenant", tenantId)
            });
        }

        // Pass the modified request to the next handler
        return next.handle(clonedRequest);
    }
}
