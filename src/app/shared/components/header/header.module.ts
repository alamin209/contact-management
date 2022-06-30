import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ApiConfigService } from '@core/services/api-config.service';
import { ResponseService } from '@core/services/response.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { LogoModule } from '../logo/logo.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, RouterModule, LogoModule],
  exports: [HeaderComponent],
  providers:[TokenStorageService, ResponseService, ApiConfigService]
})
export class HeaderModule {}
