import { HttpInterceptorFn } from '@angular/common/http';

export const myHttpInterceptor: HttpInterceptorFn = (req, next) => {
    let token = localStorage.getItem("UserToken");
        if (token) {
        let clonedRequest = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
        });
        return next(clonedRequest);
        }
    return next(req);
};
