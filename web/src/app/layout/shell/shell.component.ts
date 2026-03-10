import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  badge?: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly sub: Subscription;

  readonly isHandset = signal(false);
  readonly drawerOpened = signal(true);

  readonly navItems: NavItem[] = [
    { label: '仪表盘', icon: 'dashboard', link: '/' },
    { label: '宠物列表', icon: 'pets', link: '/pets' },
    { label: '提醒中心', icon: 'notifications', link: '/reminders', badge: '3' },
    { label: '设置', icon: 'settings', link: '/settings' }
  ];

  constructor() {
    this.sub = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isHandset.set(result.matches);
        this.drawerOpened.set(!result.matches);
      });
  }

  toggleMenu(): void {
    if (this.isHandset()) {
      this.drawerOpened.update(open => !open);
    }
  }

  closeMenuOnHandset(): void {
    if (this.isHandset()) {
      this.drawerOpened.set(false);
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
