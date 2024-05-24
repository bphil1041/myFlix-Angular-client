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
    dialogConfig.disableClose = false; // Ensure the modal can be closed by clicking outside
    this.dialog.open(DirectorInfoComponent, dialogConfig);
  }

  openGenreInfo(genre: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { genre };
    dialogConfig.disableClose = false; // Ensure the modal can be closed by clicking outside
    this.dialog.open(GenreInfoComponent, dialogConfig);
  }

  openSynopsis(movie: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { movie };  // Corrected to pass the movie object
    dialogConfig.disableClose = false;
    this.dialog.open(SynopsisComponent, dialogConfig);
  }
}
