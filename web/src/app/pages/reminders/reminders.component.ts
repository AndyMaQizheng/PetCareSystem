import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss'
})
export class RemindersComponent {
  readonly reminders = [
    { title: 'Lucky 狂犬疫苗', due: '3 天后', type: '疫苗', severity: 'high' },
    { title: 'Mimi 体重复测', due: '今天 20:00', type: '健康', severity: 'medium' },
    { title: 'Coco 术后复诊', due: '下周一', type: '复诊', severity: 'medium' }
  ];
}
