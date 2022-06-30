import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar.component';

@NgModule({
  declarations: [SnackbarComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatButtonModule,
    // RouterModule.forChild(routes),
  ],
  // exports: [SnackbarComponent, MatSnackBarModule],
})
export class SnackbarModule {}
