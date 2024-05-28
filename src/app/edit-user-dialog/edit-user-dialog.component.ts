import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent implements OnInit {
  @Input() userData = {
    UserName: '',
    Password: '',
    Email: '',
    Birthdate: Date,
  };
  editForm!: FormGroup;

  constructor(
    private fetchApiDataService: FetchApiDataService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      username: [this.userData.UserName, Validators.required],
      email: [this.userData.Email, [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.minLength(6)]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null : { 'mismatch': true };
  }

  updateUser(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updateData = {
        UserName: formValue.username,
        Email: formValue.email,
        Password: formValue.newPassword || formValue.currentPassword,
        Birthdate: this.userData.Birthdate // Add Birthdate if needed
      };

      console.log('Update Data:', updateData);

      this.fetchApiDataService.editUser(updateData).subscribe(
        (resp: any) => {
          console.log('API Response:', resp);
          // Update the userData object with the response data
          this.userData = resp;
          // Update the local storage user data
          localStorage.setItem('user', JSON.stringify(this.userData));
          this.snackBar.open('Update', 'Success', {
            duration: 2000,
          });
        },
        (error) => {
          console.error('API Error:', error);
          this.snackBar.open('Please try again', 'No success', {
            duration: 2000,
          });
        }
      );
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updateData = {
        UserName: formValue.username,
        Email: formValue.email,
        Password: formValue.newPassword || formValue.currentPassword,
        Birthdate: this.userData.Birthdate // Add Birthdate if needed
      };

      console.log('Update Data on Save:', updateData);

      this.fetchApiDataService.editUser(updateData).subscribe(
        (resp: any) => {
          console.log('API Response on Save:', resp);
          this.userData = resp;
          this.snackBar.open('Update', 'Success', {
            duration: 2000,
          });
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
    // Reset the form to its initial state
    this.editForm.reset({
      username: this.userData.UserName,
      email: this.userData.Email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }
}
