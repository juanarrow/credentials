import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageAuthService } from '../../core/services/local-storate-auth.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  error;
  formLogin;
  private router:Router = inject(Router);
  readonly navigateTo:string = "";
  
  //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]
  constructor(private formSvc:FormBuilder,
    private auth:LocalStorageAuthService
  ){
    this.formLogin = this.formSvc.group({
      'email':['', [Validators.required, Validators.email]],
      'password':['', [Validators.required]],
    });
    this.error = signal(false);
    this.navigateTo = this.router.getCurrentNavigation()?.extras.state?.['navigateTo'] || '/dashboard';

  }

  async onSubmit(){
    console.log(this.formLogin.value);
    try{
      this.error.set(false);
      const response = await this.auth.login(this.formLogin.value as any);
      this.router.navigate([this.navigateTo]);
    }
    catch(error){
      this.error.set(true);
    }
    
  }

  getError(control:string){
       
    switch(control){
      case 'email':
        if(this.formLogin.controls.email.errors!=null && 
           Object.keys(this.formLogin.controls.email.errors).includes('required'))
           return "El campo email es requerido";
        else if(this.formLogin.controls.email.errors!=null && 
           Object.keys(this.formLogin.controls.email.errors).includes('email'))
           return "El email no es correcto";
        
        break;
      case 'password': 
        if(this.formLogin.controls.password.errors!=null && 
           Object.keys(this.formLogin.controls.password.errors).includes('required'))
           return "El campo email es requerido";
        break;
      default:return "";
    }
    return "";
  }

}
