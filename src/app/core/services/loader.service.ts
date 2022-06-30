import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {
    this.checkDataLoad();
  }

  noLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  newLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  videoUrl: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  homeProjects: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  homeTestimonials: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  homePlots: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  isDataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  listDataLoaded = new BehaviorSubject<boolean>(false);
  allFormDataLoad = new BehaviorSubject<boolean>(false);
  listDataObs: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  checkDataLoad = () => {
    combineLatest([this.isDataLoaded, this.listDataLoaded]).subscribe(
      (data: any) => {
        // console.log(data);
        this.allFormDataLoad = data[0] && data[1];
        // console.log(this.allFormDataLoad);
      }
    );
  };

  static globalSearch: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  static categories: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  static selectedComponent: string = 'product'; // product or shop
  static unselectedComponent: string = 'shop'; // shop or product
  static listData: any = {};
  static arrayOfEnums: any = null;
}
