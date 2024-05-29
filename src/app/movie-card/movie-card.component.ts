import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  userId: string = '';

  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openDirectorInfo(director: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { director };
    dialogConfig.disableClose = false;
    this.dialog.open(DirectorInfoComponent, dialogConfig);
  }

  openGenreInfo(genre: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { genre };
    dialogConfig.disableClose = false;
    this.dialog.open(GenreInfoComponent, dialogConfig);
  }

  openSynopsis(movie: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { movie };
    dialogConfig.disableClose = false;
    this.dialog.open(SynopsisComponent, dialogConfig);
  }

  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((response) => {
      console.log('Movie added to favorites', response);

      // Fetch all movies to find the movie title
      this.fetchApiData.getAllMovies().subscribe((movies) => {
        const movie = movies.find((m: any) => m._id === movieId);
        if (movie) {
          console.log('Movie title:', movie.title);

          // Update the movies array after successfully adding a favorite movie
          const updatedMovies = this.movies.map((m: any) => {
            if (m._id === movieId) {
              return { ...m, favoriteMovie: true, title: movie.title };
            } else {
              return m;
            }
          });
          this.movies = updatedMovies;
        }
      }, (error) => {
        console.error('Error fetching all movies', error);
      });

    }, (error) => {
      console.error('Error adding movie to favorites', error);
    });
  }


}
