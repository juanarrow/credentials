import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  translationService = inject(TranslationService);
  
  get currentLang(): string {
    return this.translationService.getCurrentLanguage();
  }
  
  changeLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }
}

