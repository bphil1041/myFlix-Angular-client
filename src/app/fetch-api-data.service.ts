import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';



const apiUrl = 'https://myflixbp-ee7590ef397f.herokuapp.com/';

/**
 * Service to interact with the API for user and movie-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
   * @param http - HttpClient instance for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user.
   * @param userDetails - The details of the user to register.
   * @returns An Observable of the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param userDetails - The details of the user to log in.
   * @returns An Observable of the API response.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gets all movies.
   * @returns An Observable of the API response containing all movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets details of a specific movie.
   * @param title - The title of the movie.
   * @returns An Observable of the API response containing movie details.
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets details of a specific director.
   * @param directorName - The name of the director.
   * @returns An Observable of the API response containing director details.
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets details of a specific genre.
   * @param genreName - The name of the genre.
   * @returns An Observable of the API response containing genre details.
   */
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Gets details of a specific user.
   * @param username - The username of the user.
   * @returns An Observable of the API response containing user details.
   */

  getOneUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  /**
   * Gets the favorite movies of a user.
   * @param username - The username of the user.
   * @returns An Observable of the API response containing the favorite movies.
   */
  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * Updates a user's details.
   * @param updatedUser - The updated user details.
   * @returns An Observable of the API response containing the updated user data.
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Log the initial user data and the updated data
    console.log('Initial User:', user);
    console.log('Updated User Before Hashing:', updatedUser);

    // Hash the password if it is being updated
    if (updatedUser.Password) {
      const salt = bcrypt.genSaltSync(10);
      updatedUser.Password = bcrypt.hashSync(updatedUser.Password, salt);
    }

    // Log the updated user data after hashing
    console.log('Updated User After Hashing:', updatedUser);

    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map((response: any) => {
        console.log('API Response:', response); // Log the API response
        return updatedUser; // Return the updated user data
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user.
   * @param username - The username of the user to delete.
   * @returns An Observable of the API response.
   */
  deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: 'text' // Ensure the response type is 'text' since the server sends back a plain text message
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }


  /**
   * Adds a movie to the user's list of favorite movies.
   * @param movieId - The ID of the movie to add.
   * @returns An Observable of the API response.
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Initialize the FavoriteMovies array if it's undefined or null
    if (!user.FavoriteMovies) {
      user.FavoriteMovies = [];
    }

    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http.post(apiUrl + `users/${user.Username}/movies/${movieId}`, {}, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError),
    );
  }


  /**
   * Deletes a movie from the user's list of favorite movies.
   * @param movieId - The ID of the movie to delete.
   * @returns An Observable of the API response.
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const index = user.FavoriteMovies.indexOf(movieId);
    if (index >= 0) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));

    return this.http.delete(apiUrl + `users/${user.Username}/movies/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Checks if a movie is in the user's list of favorite movies.
   * @param movieId - The ID of the movie to check.
   * @returns True if the movie is a favorite, false otherwise.
   */
  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      return user.FavoriteMovies.includes(movieId);
    }

    return false;
  }

  /**
   * Extracts response data.
   * @param res - The response to extract data from.
   * @returns The extracted data.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles HTTP errors.
   * @param error - The error response.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${JSON.stringify(error.error)}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }


}