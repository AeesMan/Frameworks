import { inject, Component } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userId = localStorage.getItem('userId');

  if (userId) {
    router.navigate(['/home']);
  } else {
    router.navigate(['/login']);
  }

  return false;
};

@Component({
  selector: 'app-dummy',
  standalone: true,
  template: '', // порожній шаблон
})
export class DummyComponent {}
