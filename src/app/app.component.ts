import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StrapiAuthService } from './core/services/strapi-auth.service';
import { ErrorToastComponent } from './shared/components/error-toast/error-toast.component';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'credentials';
  
  
  private translationService = inject(TranslationService);

  constructor(){
  

  }
}
