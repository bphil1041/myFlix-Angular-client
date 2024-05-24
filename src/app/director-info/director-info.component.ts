import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss']
})
export class DirectorInfoComponent {
  director: any;

  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.director = data.director;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onBackgroundClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeModal();
    }
  }
}
