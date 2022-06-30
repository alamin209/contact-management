import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from '@core/services/loader.service';
import { ResponseService } from '@core/services/response.service';
import { TokenStorageService } from '@core/services/token-storage.service';

@Component({
  selector: 'app-top-search',
  templateUrl: './top-search.component.html',
  styleUrls: ['./top-search.component.scss'],
})
export class TopSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  categoryData: any[] = [];
  shopsByLocation: any;

  selectedComponent: string = LoaderService.selectedComponent;
  unselectedComponent: string = LoaderService.unselectedComponent;
  isSelected: boolean = false;
  isProduct: boolean = false;

  searchKey = '';
  locationKey = '';
  searchPlaceholder = ' Search Shops';
  currentRoute: any;

  /***************** location ****************/
  currentLocation = '';
  @ViewChild('locationSearch')
  public locationSearchElementRef!: ElementRef;

  searchLocation = {
    x: 0,
    y: 0,
  };

  cityAddress!: string | undefined;
  cityName!: string;
  zoom = 8;
  geoCoder: any;

  keySearchSubscription: Subscription = new Subscription();
  locationSearchStatusSubscription: Subscription = new Subscription();
  getShopsByLocationSearchSubscription: Subscription = new Subscription();
  shopListByLocation: any[] = [];
  label: string = '';
  filterEntity: string = '';
  showMap: boolean = false;

  filterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest',
  };

  constructor(
    public readonly router: Router,
    public readonly token: TokenStorageService,
    private readonly responseService: ResponseService,
    private readonly loaderService: LoaderService,
    private readonly cdrf: ChangeDetectorRef
  ) {}

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('categories') set categories(input: any[]) {
    this.categoryData = input;
  }

  ngOnInit(): void {
    this.keySearchSubscription = this.loaderService.keySearch.subscribe(
      (res) => {
        this.searchPlaceholder = ' ' + res;
      }
    );
    this.locationSearchStatusSubscription =
      this.loaderService.locationSearchStatus.subscribe((res) => {
        this.showMap = res;
      });
    this.getShopsByLocationSearchSubscription =
      this.loaderService.getShopsByLocationSearch.subscribe((res) => {
        this.shopListByLocation = res;
      });
    this.currentRoute = this.router.url;

    // console.log(this.currentRoute);

    this.isSelected =
      this.currentRoute == '/' ||
      this.currentRoute == `/${this.selectedComponent}`;

    this.isProduct =
      this.currentRoute == '/product' ||
      (this.selectedComponent == 'product' && this.currentRoute == '/');

    if (this.isProduct) {
      this.filterEntity = 'product';
    } else {
      this.filterEntity = 'shop';
    }
  }

  ngAfterViewInit(): void {
    this.cdrf.detectChanges();
  }

  gotoCategoryProfile = (category: any) => {
    this.router.navigate(['/product/category/' + category.id]);
  };

  location = (value: string) => {
    if (!value) {
      this.loaderService.locationSearch.next({ x: 0, y: 0 });
    }
  };

  filterChange = (source: any, selection: string) => {
    if (selection === 'price') {
      this.filterOption.price = source.value;
    }
    if (selection === 'rating') {
      this.filterOption.rating = source.value;
    }
    if (selection === 'algorithm') {
      this.filterOption.algorithm = source.value;
    }
    if (this.filterOption.search && this.filterOption.search.length > 2) {
      // this.loaderService.filterSearch.next(this.filterOption);
    }
  };

  filterEntityChange = ($event: any) => {
    // console.log(this.filterEntity);
    // console.log($event);
    // console.log($event.value);

    this.filterEntity = $event.value;

    if (this.filterEntity == this.selectedComponent) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/' + this.filterEntity]);
    }

    // if (this.filterEntity === 'product') {
    //   if (this.selectedComponent == 'product') {
    //     this.router.navigate(['/']);
    //   } else {
    //     this.router.navigate(['/' + this.filterEntity]);
    //   }
    // }

    // if (this.filterEntity === 'shop') {
    //   if (this.selectedComponent == 'shop') {
    //     this.router.navigate(['/']);
    //   } else {
    //     this.router.navigate(['/' + this.filterEntity]);
    //   }
    // }

    this.loaderService.isSearchable.next(true);
  };

  search = () => {
    this.filterOption.search = this.searchKey;
    console.log(this.filterOption);
    // this.loaderService.filterSearch.next(this.filterOption);
  };

  goToProfile = () => {
    if (this.token.isLoggedIn()) {
      this.router.navigate(['/dashboard/user/profile']);
    } else {
      // this.router.navigate(['/auth', 'login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
    }
  };

  searchShopsOrProducts() {
    this.showMap = false;
    this.loaderService.locationSearchStatus.next(this.showMap);
  }

  ngOnDestroy(): void {
    if (this.locationSearchStatusSubscription) {
      this.locationSearchStatusSubscription.unsubscribe();
    }
    if (this.keySearchSubscription) {
      this.keySearchSubscription.unsubscribe();
    }
    if (this.getShopsByLocationSearchSubscription) {
      this.getShopsByLocationSearchSubscription.unsubscribe();
    }
  }

  async logOut(): Promise<void> {
    this.token.signOut();
    // this.goLoginPage();
    this.responseService.message('Logged out', false);
  }
}
