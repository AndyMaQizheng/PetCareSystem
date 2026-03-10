import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    MatButtonModule,
    ToastModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './pet-create.component.html',
  styleUrl: './pet-create.component.scss'
})
export class PetCreateComponent {
  private readonly fb = new FormBuilder();
  private readonly messageService = inject(MessageService);

  readonly step = signal(1);
  readonly speciesOptions = [
    { value: 'DOG', label: '狗' },
    { value: 'CAT', label: '猫' },
    { value: 'RABBIT', label: '兔子' },
    { value: 'BIRD', label: '鸟类' },
    { value: 'OTHER', label: '其他' }
  ];

  readonly form = this.fb.group({
    name: ['', Validators.required],
    species: ['DOG', Validators.required],
    breed: [''],
    birthday: [''],
    notes: ['']
  });

  readonly scheduleForm = this.fb.group({
    vaccineName: ['', Validators.required],
    dueDate: ['', Validators.required]
  });

  private showToast(severity: 'success' | 'info' | 'warn' | 'error', detail: string): void {
    this.messageService.add({ severity, summary: '提示', detail, life: 3000 });
  }

  goToNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToast('warn', '请先完善基础信息');
      return;
    }
    this.step.set(2);
    this.showToast('success', '基础信息已保存，继续配置疫苗计划');
  }

  saveDraft(): void {
    this.showToast('success', '草稿已保存');
  }

  completeWizard(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.showToast('error', '请补充疫苗计划');
      return;
    }
    this.showToast('success', '宠物档案已提交（等待后端联通）');
  }
}
