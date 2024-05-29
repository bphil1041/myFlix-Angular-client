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
  allMovies: any[] = [];

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
      this.getMoviesAndFavorites(user.Username);
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
        this.user = result;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.loadUserData();
      }
    });
  }

  deleteUser(): void {
    const username = this.user.Username;
    this.fetchApiData.deleteUser(username).subscribe(() => {
      console.log('User deleted successfully');
      localStorage.clear();
      this.router.navigate(['welcome']);
    }, (error) => {
      console.error('Error deleting user:', error);
    });
  }

  removeFavorite(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      console.log('Movie removed from favorites');
      this.loadUserData();
    });
  }

  getMoviesAndFavorites(username: string): void {
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.allMovies = movies;
      this.fetchApiData.getFavoriteMovies(username).subscribe((movieIds: string[]) => {
        this.favoriteMovies = movieIds.map((movieId) => {
          const movie = this.allMovies.find((m: any) => m._id === movieId);
          return { _id: movieId, title: movie ? movie.title : '' };
        });
      }, (error) => {
        console.error('Error fetching favorite movies', error);
      });
    }, (error) => {
      console.error('Error fetching all movies', error);
    });
  }
}
