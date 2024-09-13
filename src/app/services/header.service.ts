import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  //Observables
  private Tenant$ = new BehaviorSubject<string>("1");

  constructor() {
    this.getTenantFromLocalStorage();
  }

  //methods
  getTenantFromLocalStorage() {
    let tenantFRomLocalstorage = localStorage.getItem("Tenant");
    if(tenantFRomLocalstorage){
      this.Tenant$.next(tenantFRomLocalstorage);
    } else {
      this.Tenant$.next("1");
    }
  }

  getTenant(): Observable<string> {
    return this.Tenant$.asObservable();
  }

  changeTenant(tenant: string) {
    this.Tenant$.next(tenant);
    localStorage.setItem("Tenant", tenant);
  }
}
