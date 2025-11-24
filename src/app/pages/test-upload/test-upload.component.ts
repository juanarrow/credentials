import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-test-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent],
  templateUrl: './test-upload.component.html',
  styleUrl: './test-upload.component.scss'
})
export class TestUploadComponent {
  private fb = inject(FormBuilder);
  
  public form;

  constructor(){
    this.form = this.fb.group({
    avatar: [null, Validators.required],
    documento: [null],
    cv: [null]
  });
  }
  
  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario válido');
      console.log('Avatar:', this.form.value.avatar);
      console.log('Documento:', this.form.value.documento);
      console.log('CV:', this.form.value.cv);
    
      alert('Formulario enviado correctamente. Revisa la consola para ver los archivos.');
    }
  }
  
  reset() {
    this.form.reset();
  }
}

