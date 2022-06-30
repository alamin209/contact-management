import { Component } from '@angular/core';
import { ApiConfigService } from '@core/services/api-config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  companyInfo: any = this.apiConfigService.getCompanyInfo();
  src = 'assets/icons/png/logo.png';

  constructor(private readonly apiConfigService: ApiConfigService) {}
}
