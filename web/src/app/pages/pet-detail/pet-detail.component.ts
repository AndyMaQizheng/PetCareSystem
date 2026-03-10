import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.scss'
})
export class PetDetailComponent {
  readonly tags = ['狂犬疫苗 3 天后', '上周腹泻记录', 'AI 建议待确认'];

  readonly timeline = [
    { label: '早餐 150g', time: '今天 07:20', icon: 'restaurant' },
    { label: '户外散步 30 分钟', time: '昨天 18:30', icon: 'directions_walk' },
    { label: 'AI：水摄入偏低', time: '周日 10:00', icon: 'lightbulb' }
  ];
}
