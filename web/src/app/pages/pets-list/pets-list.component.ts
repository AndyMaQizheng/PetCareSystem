import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

interface PetSummary {
  id: string;
  name: string;
  species: string;
  age: string;
  status: string;
  avatar: string;
}

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './pets-list.component.html',
  styleUrl: './pets-list.component.scss'
})
export class PetsListComponent {
  readonly pets: PetSummary[] = [
    { id: 'pet-001', name: 'Lucky', species: '柴犬', age: '2 岁 7 个月', status: '疫苗即将到期', avatar: 'L' },
    { id: 'pet-002', name: 'Mimi', species: '布偶猫', age: '1 岁 3 个月', status: '饮食监控中', avatar: 'M' },
    { id: 'pet-003', name: 'Coco', species: '英短', age: '3 岁', status: '术后随访', avatar: 'C' }
  ];
}
