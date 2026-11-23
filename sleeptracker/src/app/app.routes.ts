
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/log-sleep',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: '',
        redirectTo: 'log-sleep',
        pathMatch: 'full',
      },
      {
        path: 'log-sleep',
        loadComponent: () =>
          import('./log-sleep/log-sleep.page').then(m => m.LogSleepPage),
      },
      {
        path: 'log-sleepiness',
        loadComponent: () =>
          import('./log-sleepiness/log-sleepiness.page').then(m => m.LogSleepinessPage),
      },
      {
        path: 'sleep-history',
        loadComponent: () =>
          import('./sleep-history/sleep-history.page').then(m => m.SleepHistoryPage),
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'log-wake',
    loadComponent: () =>
      import('./log-wake/log-wake.page').then(m => m.LogWakePage),
  },
];
