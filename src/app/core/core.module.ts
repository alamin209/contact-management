import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ApiConfigService } from './services/api-config.service';
import { SnackbarModule } from './components/snackbar/snackbar.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, BrowserModule, SnackbarModule],
  providers: [ApiConfigService],
})
export class CoreModule {}
