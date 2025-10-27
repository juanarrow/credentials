import { Injectable, signal } from '@angular/core';
import { Credentials } from '../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _user:any={
      name: "Juan",
      surname: "García",
      email: "juan@juan.es"
  };

  public user:any|null;

  constructor() { 
    this.user = signal<any>(null);
    let cookie = localStorage.getItem('AUTHENTICATION');
    if(cookie)
      this.user.set(this._user);
  }

  login(credentials:Credentials){

    localStorage.setItem('AUTHENTICATION', JSON.stringify(credentials));
    
    this.user.set(this._user)
  }

  logout(){
    localStorage.removeItem('AUTHENTICATION');
    this.user.set(null);
  }

}
