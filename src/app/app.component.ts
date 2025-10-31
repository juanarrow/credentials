import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StrapiAuthService } from './core/services/strapi-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'credentials';

  strapiAuth:StrapiAuthService = inject(StrapiAuthService);
  constructor(){
  

  }
}
