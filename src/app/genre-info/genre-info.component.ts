import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.css']
})
export class GenreInfoComponent {
  genre: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { genre: any },
    public dialogRef: MatDialogRef<GenreInfoComponent>
  ) {
    this.genre = data.genre;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onBackgroundClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }
}
