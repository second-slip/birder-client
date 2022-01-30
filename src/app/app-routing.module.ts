// import { BirdsIndexComponent } from './_birds/birds-index/birds-index.component';
// import { ObservationDetailComponent } from './_observations/observation-detail/observation-detail.component';
// import { RegisterComponent } from './_account/register/register.component';
// import { ConfirmEmailComponent } from './_account/confirm-email/confirm-email.component';
// import { ObservationEditComponent } from './_observations/observation-edit/observation-edit.component';
// import { ObservationDeleteComponent } from './_observations/observation-delete/observation-delete.component';
// import { UserProfileComponent } from './_users/user-profile/user-profile.component';
// import { LayoutAccountManagerComponent } from './_layout/layout-account-manager/layout-account-manager.component';
// import { AccountManagerProfileComponent } from './_accountManager/account-manager-profile/account-manager-profile.component';
// import { AccountManagerLocationComponent } from './_accountManager/account-manager-location/account-manager-location.component';
// import { AccountManagerPasswordComponent } from './_accountManager/account-manager-password/account-manager-password.component';
// import { ConfirmedEmailComponent } from './_account/confirmed-email/confirmed-email.component';
// import { ResetPasswordComponent } from './_account/reset-password/reset-password.component';
// import { ForgotPasswordComponent } from './_account/forgot-password/forgot-password.component';
// import { ForgotPasswordConfirmationComponent } from './_account/forgot-password-confirmation/forgot-password-confirmation.component';
// import { ResetPasswordConfirmationComponent } from './_account/reset-password-confirmation/reset-password-confirmation.component';
// import { AccountManagerAvatarComponent } from './_accountManager/account-manager-avatar/account-manager-avatar.component';
// import { ObservationManagePhotosComponent } from './_photos/observation-manage-photos/observation-manage-photos.component';
// import { WhatsNewComponent } from './whats-new/whats-new.component';
// import { TweetArchiveComponent } from './_tweet/tweet-archive/tweet-archive.component';
// import { BirdDetailComponent } from './_birds/bird-detail/bird-detail.component';


import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationGuardService } from "./_auth/authentication-guard.service";
import { LoginComponent } from "./_auth/login/login.component";
import { LogoutComponent } from "./_auth/logout/logout.component";
import { AboutComponent } from "./_home/about/about.component";
import { ContactComponent } from "./_home/contact/contact.component";
import { DeveloperComponent } from "./_home/developer/developer.component";
import { FutureComponent } from "./_home/future/future.component";
import { HomeComponent } from "./_home/home/home.component";
import { TechnologyComponent } from "./_home/technology/technology.component";
import { LayoutNoSidebarComponent } from "./_layout/layout-no-sidebar/layout-no-sidebar.component";
import { LayoutSidebarComponent } from "./_layout/layout-sidebar/layout-sidebar.component";
import { LifeListComponent } from "./_list/life-list/life-list.component";
import { FollowersComponent } from "./_network/followers/followers.component";
import { FollowingComponent } from "./_network/following/following.component";
import { NetworkComponent } from "./_network/network/network.component";
import { ObservationCreateComponent } from "./_observation/observation-create/observation-create.component";
import { ObservationFeedComponent } from "./_observationFeed/observation-feed/observation-feed.component";
import { UserProfileComponent } from "./_profile/user-profile/user-profile.component";


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '',
    component: LayoutNoSidebarComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'technology', component: TechnologyComponent },
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent },
      // { path: 'register', component: RegisterComponent },
      // { path: 'confirm-email', component: ConfirmEmailComponent },
      // { path: 'confirmed-email', component: ConfirmedEmailComponent },
      // { path: 'forgot-password', component: ForgotPasswordComponent },
      // { path: 'forgot-password-confirmation', component: ForgotPasswordConfirmationComponent },
      // { path: 'reset-password/:code', component: ResetPasswordComponent },
      // { path: 'reset-password-confirmation', component: ResetPasswordConfirmationComponent },
      // { path: 'whats-new', component: WhatsNewComponent },
      // { path: 'tweets-archive', component: TweetArchiveComponent },
      { path: 'developer', component: DeveloperComponent },
      { path: 'future', component: FutureComponent }
    ]
  },
  // ToDo: try moving this to the top so components load first with the sidebar if appropriate
  {
    path: '',
    component: LayoutSidebarComponent,
    canActivate: [AuthenticationGuardService],
    children: [
      {
        path: '',
        canActivateChild: [AuthenticationGuardService],
        children: [
          { path: '', component: HomeComponent, pathMatch: 'full' },
          { path: 'observation-feed', component: ObservationFeedComponent },
          //         { path: 'observation-detail/:id', component: ObservationDetailComponent },
          //         { path: 'observation-delete/:id', component: ObservationDeleteComponent },
          { path: 'observation-create', component: ObservationCreateComponent, },
          //         { path: 'observation-edit/:id', component: ObservationEditComponent },
          //         { path: 'observation-manage-photos/:id', component: ObservationManagePhotosComponent },
          //         { path: 'birds-index', component: BirdsIndexComponent },
          //         { path: 'bird-detail/:id', component: BirdDetailComponent },
          { path: 'life-list/:username', component: LifeListComponent },
          { path: 'user-profile/:username', component: UserProfileComponent },
          { path: 'followers/:username', component: FollowersComponent },
          { path: 'following/:username', component: FollowingComponent },
          { path: 'network', component: NetworkComponent },
          { path: 'logout', component: LogoutComponent },
        ]
      },
    ]
  },
  // {
  //   path: '',
  //   component: LayoutAccountManagerComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       canActivateChild: [AuthGuard],
  //       children: [
  //         // { path: '', component: HomeComponent, pathMatch: 'full' },
  //         { path: 'account-manager-profile', component: AccountManagerProfileComponent },
  //         { path: 'account-manager-avatar', component: AccountManagerAvatarComponent },
  //         { path: 'account-manager-location', component: AccountManagerLocationComponent },
  //         { path: 'account-manager-password', component: AccountManagerPasswordComponent },
  //       ]
  //     },
  //   ]
  // },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
