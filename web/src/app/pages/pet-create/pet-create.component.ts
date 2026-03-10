import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './pet-create.component.html',
  styleUrl: './pet-create.component.scss'
})
export class PetCreateComponent {
  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    name: ['', Validators.required],
    species: ['DOG', Validators.required],
    breed: [''],
    birthday: [''],
    notes: ['']
  });

  saveDraft(): void {
    console.log('draft pet payload', this.form.value);
  }
}
