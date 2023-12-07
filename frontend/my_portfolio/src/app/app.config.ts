// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes)]
// };

import { ApplicationConfig } from '@angular/core';
import { AppModule } from './app.module'; // Import your AppModule

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: AppModule,
      useValue: {},
    },
  ],
};
