import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

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
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
        this.editUser(result);
      }
    });
  }

  editUser(updatedUser: any): void {
    this.fetchApiData.editUser(updatedUser).subscribe(() => {
      console.log('User updated successfully');
      this.getUserInfo(updatedUser.Username);
    });
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(() => {
      console.log('User deleted successfully');
      // Perform any additional actions after deletion, such as redirecting to a different page
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
