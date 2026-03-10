import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MOCK_PETS, PetSummary } from '../../data/mock-pets';

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './pets-list.component.html',
  styleUrl: './pets-list.component.scss'
})
export class PetsListComponent {
  readonly pets: PetSummary[] = MOCK_PETS;
}
