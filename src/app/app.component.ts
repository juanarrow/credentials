import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StrapiAuthService } from './core/services/strapi-auth.service';
import { ErrorToastComponent } from './shared/components/error-toast/error-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'credentials';

  constructor(){
  

  }
}
