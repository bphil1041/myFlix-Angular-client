import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog-component/edit-user-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.Username) {
      this.getUserInfo(user.Username);
      this.fetchApiData.getFavoriteMovies(user.Username).subscribe((movies: any[]) => {
        this.favoriteMovies = movies;
      });
    }
  }

  getUserInfo(username: string): void {
    this.fetchApiData.getOneUser(username).subscribe((resp: any) => {
      this.user = resp;
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '250px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = result; // Update the user object with the new data
        localStorage.setItem('user', JSON.stringify(this.user)); // Update local storage with the new user data
        this.loadUserData(); // Reload user data to reflect changes
      }
    });
  }

  deleteUser(): void {
    const username = this.user.Username;
    this.fetchApiData.deleteUser(username).subscribe(() => {
      console.log('User deleted successfully');
      localStorage.clear();
      this.router.navigate(['welcome']);  // Redirect to the welcome page
    }, (error) => {
      console.error('Error deleting user:', error);
    });
  }

  removeFavorite(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      console.log('Movie removed from API. Refreshing favorite movies list...');
      this.getFavoriteMovies(this.user.Username);
    });
  }

  getFavoriteMovies(username: string): void {
    this.fetchApiData.getFavoriteMovies(username).subscribe((resp: any[]) => {
      this.favoriteMovies = resp;
    });
  }
}
