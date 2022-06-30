import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app-material.module';
import { RouterModule } from '@angular/router';

// import { ShopContentComponent } from './components/features/site/shop-content/shop-content.component';
// import { PartnersComponent } from './components/features/site/partners/partners.component';
// import { FooterComponent } from './components/features/site/footer/footer.component';
// import { SnackbarErrorComponent } from './components/features/site/snackbar-error/snackbar-error.component';
// import { HeaderComponent } from './components/features/site/header/header.component';
// import { BusinessBoostComponent } from './components/features/site/business-boost/business-boost.component';
// import { FeedHeaderComponent } from './components/features/site/feed-header/feed-header.component';
// import { CartComponent } from './components/features/site/cart/cart.component';
// import { NotificationComponent } from './components/features/site/notification/notification.component';
// import { GooglePlayPromotionComponent } from './components/features/site/google-play-promotion/google-play-promotion.component';
// import { BusinessDecorationComponent } from './components/features/site/business-decoration/business-decoration.component';

// import { ImageComponent } from './components/features/dashboard/image/image.component';
// import { AgmGoogleMapComponent } from './components/features/dashboard/agm-google-map/agm-google-map.component';
// import { MinCartComponent } from './components/features/site/min-cart/min-cart.component';
// import { ProductContentComponent } from './components/features/site/product-content/product-content.component';
// import { ShopProfileTopComponent } from './components/features/site/shop-profile-top/shop-profile-top.component';
// import { ShopProfileHeaderComponent } from './components/features/site/shop-profile-header/shop-profile-header.component';
// import { ReviewComponent } from './components/features/site/review/review.component';
// import { ShippingDialogComponent } from './components/features/site/shipping-dialog/shipping-dialog.component';
// import { SalesSearchComponent } from './components/features/dashboard/sales-search/sales-search.component';
// import { ApprovedDetailsComponent } from './components/features/dashboard/approved-details/approved-details.component';
// import { TransporterAssignComponent } from './components/features/dashboard/transporter-assign/transporter-assign.component';
// import { BreadcrumbComponent } from './components/features/site/breadcrumb/breadcrumb.component';
// import { SiteSidenavComponent } from './components/features/site/site-sidenav/site-sidenav.component';

import { SystemService } from './services/system.service';
import { SalesSearchService } from './services/sales-search.service';
import { TokenStorageService } from '../core/services/token-storage.service';
// import { TopSearchComponent } from './components/top-search/top-search.component';
import { HttpClientModule } from '@angular/common/http';
import { ResponseService } from '@core/services/response.service';
import { ApiConfigService } from '@core/services/api-config.service';
import { LoaderService } from '@core/services/loader.service';
import { ListService } from './services/list.service';

import { PermissionGuard } from '@core/guards/permission.guard';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HttpService } from '@core/services/http.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { authInterceptorProvider } from '@core/interceptors/auth.interceptor';
import { ProcessingService } from './services/processing.service';

const components = [
  // TopSearchComponent,
  // SnackbarErrorComponent,
  // ShopContentComponent,
  // BusinessBoostComponent,
  // FeedHeaderComponent,
  // CartComponent,
  // NotificationComponent,
  // ApprovedDetailsComponent,
  // FooterComponent,
  // HeaderComponent,
  // PartnersComponent,
  // GooglePlayPromotionComponent,
  // BusinessDecorationComponent,
  ConfirmDialogComponent,
  // ImageComponent,
  // AgmGoogleMapComponent,
  // MinCartComponent,
  // ProductContentComponent,
  // ShopProfileTopComponent,
  // ShopProfileHeaderComponent,
  // ReviewComponent,
  // ShippingDialogComponent,
  // TransporterAssignComponent,
  // SalesSearchComponent,
  // BreadcrumbComponent,
  // SiteSidenavComponent,
  // FacebookChatComponent,
];

const services = [
  HttpService,
  SystemService,
  SalesSearchService,
  TokenStorageService,
  ResponseService,
  ApiConfigService,
  LoaderService,
  ListService,
  ProcessingService,
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    AppMaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    AppMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...components,
  ],
  providers: [
    ...services,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    PermissionGuard,
    authInterceptorProvider,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
})
export class SharedModule {}
