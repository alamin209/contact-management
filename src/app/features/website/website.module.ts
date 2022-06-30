import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteLayoutComponent } from './website-layout/website-layout.component';
import { MatCardModule } from '@angular/material/card';
import { HeaderModule } from '@shared/components/header/header.module';
import { FooterModule } from '@shared/components/footer/footer.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [WebsiteLayoutComponent],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    MatCardModule,
    HeaderModule,
    FooterModule,
    SharedModule,
  ],
})
export class WebsiteModule {}
