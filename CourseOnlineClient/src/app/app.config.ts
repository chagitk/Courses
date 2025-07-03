import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes as appRoutes } from './routes/app.routes'; // שיניתי את השם ל-appRoutes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),
  ]
};