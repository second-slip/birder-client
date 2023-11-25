import { enableProdMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RequestCache, RequestCacheWithMap } from './app/_sharedServices/request-cache.service';
import { HttpInterceptorProviders } from './app/_httpInterceptors';
import { AuthenticationService } from './app/_auth/authentication.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule, 
            //FormsModule, ReactiveFormsModule, BrowserModule, MatIconModule, MatStepperModule, GoogleMapsModule, NgbModule,
            JwtModule.forRoot({
            config: {
                tokenGetter: () => {
                    return localStorage.getItem("jwt");
                },
                allowedDomains: ['localhost:4200', 'birder20210119224819.azurewebsites.net', 'birderweb.com'],
                disallowedRoutes: ['//localhost:4200/Authentication/Login', '//birder20210119224819.azurewebsites.net/Authentication/Login', '//birderweb.com/Authentication/Login'],
            }
        })),
        AuthenticationService,
        HttpInterceptorProviders,
        { provide: RequestCache, useClass: RequestCacheWithMap },
        { provide: LOCALE_ID, useValue: 'en-GB' },
        { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
