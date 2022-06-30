import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConfigService } from '@core/services/api-config.service';
import { ResponseService } from '@core/services/response.service';
import { TokenStorageService } from '@core/services/token-storage.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  companyInfo: any = this.apiConfigService.getCompanyInfo();
  src = environment.logo;

  constructor(
    public readonly router: Router,
    public readonly token: TokenStorageService,
    private readonly responseService: ResponseService,
    private readonly apiConfigService: ApiConfigService
  ) {}

  logOut(): void {
    this.token.signOut();
    // this.goLoginPage();
    this.responseService.message('Logged out', false);
  }
}
