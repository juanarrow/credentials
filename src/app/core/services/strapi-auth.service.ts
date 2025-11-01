import { inject, Injectable, signal } from '@angular/core';
import { Credentials, RegisterInfo } from '../models/credentials';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { ErrorService } from './error.service';
import { ErrorType } from '../models/app-error';


export interface LoginResponse {
  jwt: string
  user: StrapiUser
}

export interface RegisterResponse {
  jwt: string
  user: StrapiUser
}

export interface StrapiUser {
  id: number
  documentId: string
  username: string
  name?: string,
  surname?: string,
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}
type _User = User | null;

@Injectable({
  providedIn: 'root'
})
export class StrapiAuthService {
  
  public user: any | null;
  private token:string|null;
  private http:HttpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  constructor() {
    this.user = signal<any>(null);
    this.token = localStorage.getItem('token');
    this.me();
  }


  me(){
    if(this.token){
      this.http.get<StrapiUser>("http://localhost:1337/api/users/me",{
        headers:{
          "Authorization":`Bearer ${this.token}`
        }
      }).subscribe({
        next:(data)=>{
          const user:User = {
            name:data.name || '',
            surname:data.surname || '',
            email:data.email
          }
          this.setUser(user);
          
        },
        error:(err)=>{
          this.errorService.handleError(err);
        }
      });
    }    
  }

  setUser(user:User){
    this.user.set(user);
  }

  login(credentials: Credentials){
    const body = {
      identifier:credentials.email,
      password:credentials.password
    };
    this.http.post<LoginResponse>("http://localhost:1337/api/auth/local", body).subscribe({
      next:(data)=>{
        localStorage.setItem('token',data.jwt);
        const newUser:User = {
          email:data.user.email,
          name:data.user.name || '',
          surname:data.user.surname || ''
        }
        this.setUser(newUser);
      },
      error:(err: HttpErrorResponse)=>{
        if (err.status === 400) {
          this.errorService.setError('Usuario o contraseña incorrectos', ErrorType.AUTH);
        } else {
          this.errorService.handleError(err);
        }
      }
    })
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('token');
    this.token = null;
  }

  register(userInfo: RegisterInfo){
    const registerBody = {
      username: userInfo.email,
      email: userInfo.email,
      password: userInfo.password
    };
    
    this.http.post<RegisterResponse>("http://localhost:1337/api/auth/local/register", registerBody).subscribe({
      next:(data)=>{
        localStorage.setItem('token', data.jwt);
        this.token = data.jwt;
        
        const updateBody = {
          name: userInfo.name,
          surname: userInfo.surname
        };
        
        this.http.put<{data: StrapiUser}>(`http://localhost:1337/api/users/me`, updateBody, {
          headers: {
            "Authorization": `Bearer ${this.token}`
          }
        }).subscribe({
          next: (response) => {
            const updatedUser = response.data;
            const newUser:User = {
              email: updatedUser.email,
              name: updatedUser.name || userInfo.name,
              surname: updatedUser.surname || userInfo.surname
            }
            this.setUser(newUser);
          },
          error: (err) => {
            console.error('Error al actualizar perfil:', err);
            const newUser:User = {
              email: data.user.email,
              name: userInfo.name,
              surname: userInfo.surname
            }
            this.setUser(newUser);
            this.errorService.setError('Registro exitoso, pero no se pudieron guardar nombre y apellidos', ErrorType.VALIDATION);
          }
        });
      },
      error:(err: HttpErrorResponse)=>{
        if (err.status === 400) {
          if (err.error?.error?.message?.includes('Email') || err.error?.error?.message?.includes('email')) {
            this.errorService.setError('El email ya está registrado', ErrorType.VALIDATION);
          } else if (err.error?.error?.message?.includes('username')) {
            this.errorService.setError('El email ya está registrado', ErrorType.VALIDATION);
          } else {
            this.errorService.setError('Error al registrar. Verifica los datos', ErrorType.VALIDATION);
          }
        } else {
          this.errorService.handleError(err);
        }
      }
    })
  }
}
