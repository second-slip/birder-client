import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';

import { AuthenticationService } from './_auth/authentication.service';
import { AboutComponent } from './_home/about/about.component';
import { ContactComponent } from './_home/contact/contact.component';
import { ContactFormComponent } from './_home/contact-form/contact-form.component';
import { DeveloperComponent } from './_home/developer/developer.component';
import { FeaturesComponent } from './_home/features/features.component';
import { FutureComponent } from './_home/future/future.component';
import { HomeComponent } from './_home/home/home.component';
import { TechnologyComponent } from './_home/technology/technology.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { LayoutNoSidebarComponent } from './_layout/layout-no-sidebar/layout-no-sidebar.component';
import { LayoutSidebarComponent } from './_layout/layout-sidebar/layout-sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from './_auth/token.service';
import { LoginComponent } from './_auth/login/login.component';
import { AuthenticationGuardService } from './_auth/authentication-guard.service';
import { LogoutComponent } from './_auth/logout/logout.component';
import { HttpInterceptorProviders } from './_httpInterceptors';
import { ObservationFeedComponent } from './_observationFeed/observation-feed/observation-feed.component';
import { TemporarySideBarComponent } from './temporary-side-bar/temporary-side-bar.component';
import { SideMenuComponent } from './_layout/side-menu/side-menu.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { ObservationFeedItemComponent } from './_observationFeed/observation-feed-item/observation-feed-item.component';
import { ObservationCountComponent } from './_analysis/observation-count/observation-count.component';
import { ObservationTopFiveComponent } from './_analysis/observation-top-five/observation-top-five.component';
import { TweetDayComponent } from './_tweet/tweet-day/tweet-day.component';
import { TweetDayArchiveComponent } from './_tweet/tweet-day-archive/tweet-day-archive.component';
import { NetworkSummaryComponent } from './_network/network-summary/network-summary.component';
import { NetworkComponent } from './_network/network/network.component';
import { NetworkSidebarComponent } from './_network/network-sidebar/network-sidebar.component';
import { FollowersComponent } from './_network/followers/followers.component';
import { NetworkUserComponent } from './_network/network-user/network-user.component';
import { FollowingComponent } from './_network/following/following.component';
import { NetworkSuggestionComponent } from './_network/network-suggestion/network-suggestion.component';
import { NetworkFindComponent } from './_network/network-find/network-find.component';
import { LifeListComponent } from './_list/life-list/life-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    ContactFormComponent,
    DeveloperComponent,
    FeaturesComponent,
    FutureComponent,
    HomeComponent,
    TechnologyComponent,
    FooterComponent,
    NavMenuComponent,

    //
    LayoutSidebarComponent,
    LayoutNoSidebarComponent,
    LoginComponent,
    LogoutComponent,
    ObservationFeedComponent,
    TemporarySideBarComponent,
    SideMenuComponent,
    InfiniteScrollComponent,
    ObservationFeedItemComponent,
    ObservationCountComponent,
    ObservationTopFiveComponent,
    TweetDayComponent,
    TweetDayArchiveComponent,
    NetworkSummaryComponent,
    NetworkComponent,
    NetworkSidebarComponent,
    FollowersComponent,
    NetworkUserComponent,
    FollowingComponent,
    NetworkSuggestionComponent,
    NetworkFindComponent,
    LifeListComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    // MatButtonModule,
    MatDatepickerModule,
    // NgxMatDatetimePickerModule,
    // NgxMatMomentModule,
    // MatStepperModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatTabsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    // MatDialogModule,
    // MatButtonToggleModule,
    NgbModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("jwt");
        },
        allowedDomains: ['localhost:55722', 'birder20210119224819.azurewebsites.net', 'birderweb.com'],
        disallowedRoutes: ['//localhost:55722/Authentication/Login', '//birder20210119224819.azurewebsites.net/Authentication/Login', '//birderweb.com/Authentication/Login'],
      }
    }),
  ],
  providers: [
    AuthenticationService, TokenService, AuthenticationGuardService, HttpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
