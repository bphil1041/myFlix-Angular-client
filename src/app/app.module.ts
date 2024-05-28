import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms'; // Add this line

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { DirectorInfoComponent } from './director-info/director-info.component';
import { SynopsisComponent } from './synopsis/synopsis.component';
import { GenreInfoComponent } from './genre-info/genre-info.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProfileComponent } from './profile/profile.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component'; // Ensure to add this line

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'login', component: UserLoginFormComponent },
  { path: 'register', component: UserRegistrationFormComponent },
  { path: 'profile', component: ProfileComponent }, // Add this route for the profile page
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // Updated pathMatch to 'full'
];

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserLoginFormComponent,
    MovieCardComponent,
    WelcomePageComponent,
    DirectorInfoComponent,
    GenreInfoComponent,
    SynopsisComponent,
    NavBarComponent,
    ProfileComponent,
    EditUserDialogComponent // Ensure this line is correct
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatToolbarModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
    ReactiveFormsModule // Ensure this line is added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
