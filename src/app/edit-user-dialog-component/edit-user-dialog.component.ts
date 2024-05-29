import { Component, Inject, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
})
export class EditUserDialogComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fetchApiDataService: FetchApiDataService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserDialogComponent>
  ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      username: [{ value: this.data.user.Username, disabled: true }],
      newUsername: ['', Validators.required],
      email: [this.data.user.Email, [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.minLength(6)]],
    }, { validator: this.passwordMatchValidator });

    console.log('Initial User Data:', this.data.user);
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSave(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updateData = {
        Username: formValue.newUsername,
        Email: formValue.email,
        Password: formValue.newPassword || formValue.currentPassword,
        Birthdate: this.data.user.Birthdate
      };

      console.log('Update Data on Save:', updateData);

      this.fetchApiDataService.editUser(updateData).subscribe(
        (resp: any) => {
          console.log('API Response on Save:', resp);
          this.snackBar.open('Update Success', 'Close', {
            duration: 2000,
          });
          this.dialogRef.close(resp); // Close the dialog and pass the response back to the parent component
        },
        (error) => {
          console.error('API Error on Save:', error);
          this.snackBar.open('Please try again', 'No success', {
            duration: 2000,
          });
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without passing any data
  }
}
