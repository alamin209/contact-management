import { Component, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<SnackbarComponent>
  ) {}

  isValidArray(data: any) {
    if (Array.isArray(data) && data.length) {
      return true;
    }
    return false;
  }

  isValidString(data: any) {
    if (typeof data === 'string' && data) {
      return true;
    }
    return false;
  }
}
