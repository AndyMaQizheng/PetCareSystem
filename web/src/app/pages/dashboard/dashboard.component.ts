import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MOCK_PETS } from '../../data/mock-pets';

interface MetricCard {
  label: string;
  value: string;
  trend: string;
  icon: string;
  link: string;
}

interface InsightCard {
  pet: string;
  petId: string;
  summary: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule, MatChipsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly router = inject(Router);

  private readonly activePetCount = MOCK_PETS.length;

  readonly metrics: MetricCard[] = [
    { label: '活跃宠物', value: `${this.activePetCount}`, trend: `共 ${this.activePetCount} 只`, icon: 'pets', link: '/pets' },
    { label: '待办提醒', value: '4', trend: '2 个疫苗，2 个任务', icon: 'notifications_active', link: '/reminders' },
    { label: '一周事件', value: '38', trend: '同比 +12%', icon: 'query_stats', link: '/pets' },
    { label: 'AI 建议', value: '3', trend: '2 个高优先级', icon: 'lightbulb', link: '/pets' }
  ];

  readonly upcomingReminders = [
    { title: 'Lucky 狂犬疫苗加强', due: '3 天后', type: 'VACCINE' },
    { title: 'Mimi 体重复测', due: '今天 20:00', type: 'HEALTH' },
    { title: 'Coco 绝育复诊', due: '下周一', type: 'VISIT' }
  ];

  readonly latestInsights: InsightCard[] = [
    {
      pet: 'Lucky',
      petId: 'pet-001',
      summary: '本周饮水量偏低，建议加强湿粮并记录尿量变化。'
    },
    {
      pet: 'Mimi',
      petId: 'pet-002',
      summary: '夜间活动减少，建议检查互动玩具并记录睡眠。'
    }
  ];

  navigateTo(link: string): void {
    this.router.navigateByUrl(link);
  }

  goToInsight(petId: string): void {
    this.router.navigate(['/pets', petId], { queryParams: { focus: 'insight' } });
  }
}
