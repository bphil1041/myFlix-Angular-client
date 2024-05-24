import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrls: ['./synopsis.component.css']
})
export class SynopsisComponent {
  movie: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movie: any },
    public dialogRef: MatDialogRef<SynopsisComponent>
  ) {
    this.movie = data.movie;
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
