import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ApiConfigService } from '@core/services/api-config.service';
import { ResponseService } from '@core/services/response.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { FooterComponent } from './footer.component';
import { LogoModule } from '../logo/logo.module';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    LogoModule,
  ],
  exports: [FooterComponent],
  providers: [TokenStorageService, ResponseService, ApiConfigService],
})
export class FooterModule {}
