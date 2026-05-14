import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {provideIcons } from '@ng-icons/core';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import{
      heroHome,
      heroBookOpen,
      heroUsers,
      heroCalendarDays,
      heroAcademicCap,
      heroUserCircle,
      heroClipboardDocumentList,
      heroClock,
      heroArrowRight,
      heroArrowsUpDown,
      heroDocumentText,
      heroUser,
      heroPlus,
      heroXMark,
      heroTrash,
      heroEye,
      heroPencilSquare,
      heroCalendar,
      heroStar,
      heroUserMinus,
      heroUserPlus,
      heroChevronDown,
      heroCheck,
    } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
    provideIcons({
      heroHome,
      heroBookOpen,
      heroUsers,
      heroCalendarDays,
      heroAcademicCap,
      heroUserCircle,
      heroClipboardDocumentList,
      heroClock,
      heroArrowRight,
      heroArrowsUpDown,
      heroDocumentText,
      heroUser,
      heroPlus,
      heroXMark,
      heroTrash,
      heroEye,
      heroPencilSquare,
      heroCalendar,
      heroStar,
      heroUserMinus,
      heroUserPlus,
      heroChevronDown,
      heroCheck,
    }),
  ],
};
