import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HttpService } from '@core/services/http.service';
import { LoaderService } from '@core/services/loader.service';
import { ResponseService } from '@core/services/response.service';

import { RoleName } from '@core/enum/role-name.enum';
// import { PlotType } from '@shared/enum/plot-type.enum';
// import { OfferType } from '@shared/enum/offer-type.enum';
// import { MediaType } from '@shared/enum/media-type.enum';
// import { TvcSources } from '@shared/enum/tvc-source.enum';
// import { PaymentType } from '@shared/enum/payment-type.enum';
// import { AvailabilityStatus } from '@shared/enum/availability.enum';

import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

import {
  Observable,
  BehaviorSubject,
  merge,
  startWith,
  switchMap,
  map,
  catchError,
  of,
  tap,
  concatMap,
  takeUntil,
  Subject,
} from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
// import { MediaModalComponent } from '@shared/components/media-modal/media-modal.component';
// import { ListUrl } from '@shared/enum/list-url.enum';

@Injectable({
  providedIn: 'root',
})
export class ProcessingService {
  matDialog!: MatDialog;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;
  routeData: { id: string | null; path: string; title: string } = {} as {
    id: string | null;
    path: string;
    title: string;
  };
  formData: BehaviorSubject<any> = new BehaviorSubject({});
  // arrayOfEnums: EnumTypes;
  maxHeight = '90vh';
  width = '60vw';

  name = 'Angular 6';
  htmlContent = '';
  videoUrl: any = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    outline: true,
    /*toolbarHiddenButtons: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
      ['heading', 'fontName', 'fontSize', 'color'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
      ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
      ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
      ['link', 'unlink', 'image', 'video']
    ]*/
  };

  listData: any = {};
  arrayOfEnums: any = {};
  listArray: string[] = [
    // ListUrl.AMENITIES,
    // ListUrl.ARTICLE_CATEGORY,
    // ListUrl.AUTHOR,
    // ListUrl.BLOCK,
    // ListUrl.PLOT,
    // ListUrl.PLOT_TYPES,
    // ListUrl.PROJECT,
  ];

  dataSet = new BehaviorSubject({});

  constructor(
    private router: Router,

    private hS: HttpService,
    private lS: LoaderService,
    private rS: ResponseService
  ) {
    if (!LoaderService.arrayOfEnums) {
      // console.log('makeEnumArray');
      this.makeEnumArray();
    }
  }

  addUrl = (path: string) => {
    this.router.navigateByUrl(`dashboard/${path}/list/add`);
  };

  editUrl = (path: string, id: string) => {
    this.router.navigate([`dashboard/${path}/list/edit/`, id]);
  };

  editUrlData = (path: string, id: string, formData: any = {}) => {
    this.formData.next(JSON.stringify(formData));
    this.router.navigate([`dashboard/${path}/list/edit/`, id]);
  };

  detailWebata = (path: string, id: string, formData: any = {}) => {
    this.formData.next(JSON.stringify(formData));
    this.router.navigate([`${path}/single/`, id]);
  };

  detailFeatureData = (path: string, id: string, formData: any = {}) => {
    this.formData.next(JSON.stringify(formData));
    this.router.navigate([`${path}/single/`, id]);
  };

  delete = (path: string, id: string): Observable<any> => {
    let returnData = new BehaviorSubject(false);

    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to delete?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes: any) => {
      this.dialogRef = null;
      if (yes) {
        this.lS.isLoading.next(true);
        this.hS.remove(path, id).subscribe((res: any) => {
          this.rS.fire(res);
          this.lS.isLoading.next(false);
          returnData.next(true);
        });
      } else {
        returnData.next(false);
      }
    });

    return returnData;
  };

  goTo = (
    path: string,
    module: string = 'dashboard',
    extraPart: string = 'list'
  ) => {
    this.router.navigateByUrl(`${module}/${path}/${extraPart}`);
  };

  getRoutedata = (route: ActivatedRoute) => {
    const id = route.snapshot.paramMap.get('id');
    const routeData = route.snapshot.data;

    const {
      path,
      title,
      addTitle,
      editTitle,
      listTitle,
      deleteTitle,
      detailsTitle,
    } = routeData;

    return {
      id: id,
      path: path,
      title: title,
      addTitle: addTitle,
      editTitle: editTitle,
      listTitle: listTitle,
      deleteTitle: deleteTitle,
      detailsTitle: detailsTitle,
    };
  };

  addExtraParams = (params: { key: ''; value: '' }[]) => {
    var extraParamText = '';
    params.forEach((element: any) => {
      if (element.value) extraParamText += `&${element.key}=${element.value}`;
    });
    return extraParamText;
  };

  getAllWebData = (
    path: string,
    extraParam: string = '',
    page: number = 1,
    limit: number = 9,
    sortBy: string = 'createAt',
    orderBy: string = 'DESC'
  ) => {
    this.lS.isLoading.next(true);

    return this.hS.pagination(path, extraParam).pipe(
      startWith({}),
      tap(() => {
        this.lS.isLoading.next(false);
      }),
      catchError(() => {
        this.lS.isLoading.next(false);
        return of([]);
      })
    );
  };

  showAll = (
    sort: MatSort,
    paginator: MatPaginator,
    path: string,
    extraParam: string = ''
  ) => {
    // console.log(sort);
    // console.log(paginator);

    sort.sortChange.subscribe(() => (paginator.pageIndex = 0));

    return merge(sort.sortChange, paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.lS.isLoading.next(true);
        const page = paginator.pageIndex + 1;
        const limit = paginator.pageSize;
        const sortBy = sort?.active || 'createAt';
        const order = sort?.direction.toUpperCase() || 'DESC';

        // return this.hS.pagination(page, limit, sortBy, order, path, extraParam);
        return of([]);
      }),
      tap(() => {
        this.lS.isLoading.next(false);
      }),
      catchError(() => {
        this.lS.isLoading.next(false);
        return of([]);
      })
    );
  };

  showAllWithoutSort = (
    paginator: MatPaginator,
    path: string,
    extraParam: string = '',
    sortBy: string = 'createAt',
    order: string = 'DESC'
  ) => {
    return merge(paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.lS.isLoading.next(true);
        const page = paginator.pageIndex + 1;
        const limit = paginator.pageSize;

        // return this.hS.pagination(page, limit, sortBy, order, path, extraParam);
        return of([]);
      }),
      tap(() => {
        this.lS.isLoading.next(false);
      }),
      catchError(() => {
        this.lS.isLoading.next(false);
        return of([]);
      })
    );
  };

  enumToArray = (
    enumValues: any,
    startIndex: number = 1,
    isString: boolean = false
  ) => {
    // console.log(enumValues);

    var keys = Object.keys(enumValues);
    var keyArray: any[] = [];
    // console.log(keys);

    if (!isString) {
      keyArray = keys.slice(keys.length / 2);
      // console.log(keyArray);
    } else {
      keyArray = keys;
    }

    let returnArray: any[] = [];

    returnArray = keyArray.map((element: any, index) => {
      let ele: any = {};
      if (isString) {
        ele['id'] = element;
        ele['title'] = element.replaceAll('_', ' ');
      } else {
        ele['id'] = index + startIndex;
        ele['title'] = element;
      }

      return ele;
    });

    // console.log(returnArray);
    return returnArray;
  };

  makeEnumArray = () => {
    LoaderService.arrayOfEnums = {
      RoleName: this.enumToArray(RoleName, 1, true),
      //   PaymentType: this.enumToArray(PaymentType, 1, true),
      //   AvailabilityStatus: this.enumToArray(AvailabilityStatus, 1, true),
      //   OfferType: this.enumToArray(OfferType, 1, true),
      //   MediaType: this.enumToArray(MediaType, 1, true),
      //   PlotType: this.enumToArray(PlotType, 1, true),
      //   TvcSources: this.enumToArray(TvcSources, 1, true),
    };
  };

  isObjectEmpty = (object: any) => {
    if (Object.keys(object).length === 0) {
      return true;
    }
    // console.log(Object.keys(object).length);
    // console.log(Object.keys(object));

    for (var key in object) {
      if (object.hasOwnProperty(key)) return false;
    }
    return true;
  };

  getData = (path: string, dataId: string): Observable<any> => {
    let _onDestroy = new Subject<void>();
    let formData = this.formData.pipe(
      takeUntil(_onDestroy),
      concatMap((data: any) => {
        this.lS.isDataLoaded.next(false);
        if (this.isObjectEmpty(data)) {
          return this.hS.getById(path, dataId);
        } else {
          return of(data);
        }
      }),
      map((res: any) => {
        // console.log(res);
        let fromValues: any;
        try {
          fromValues = JSON.parse(res);
        } catch (e) {
          fromValues = res;
        }
        _onDestroy.next();
        return fromValues;
      }),
      tap(() => this.lS.isDataLoaded.next(true))
    );

    return formData;
  };

  multiSelectFormData = (multiSelectData: any[]) => {
    let selectedId: any[] = [];
    if (multiSelectData.length) {
      multiSelectData.forEach((element: any) => {
        selectedId.push(element.id);
      });
    }
    return selectedId;
  };

  multiSelectSubmitData = (
    multiSelectData: any[],
    columnName: string = 'id',
    isMedia: boolean = false
  ) => {
    let formattedData: any[] = [];
    if (multiSelectData.length) {
      multiSelectData.forEach((element: any) => {
        formattedData.push({
          [columnName]: isMedia ? element[columnName] : element,
        });
      });
    }
    return formattedData;
  };

  // list methods start
  getListData = (listArray: any[] = this.listArray) => {
    if (listArray.length > 0) {
      this.lS.listDataLoaded.next(false);
      Promise.all([this.getList(listArray)]).then(() => {
        this.lS.listDataLoaded.next(true);
      });
    } else {
      this.lS.listDataLoaded.next(true);
    }
    return of([]);
  };

  getList = (listArray: any[]) => {
    listArray.forEach((element) => {
      // let list = { ...LoaderService.listData };
      // console.log(list);
      // console.log(element);

      if (!LoaderService.listData || !(element in LoaderService.listData)) {
        this.hS.getList(element).subscribe((res: any) => {
          LoaderService.listData[element] = res;
        });
      }
    });
  };
  // list methods end

  // form submit methods start
  saveData(path: string, submitData: any) {
    this.hS.create(path, submitData).subscribe((response: any) => {
      this.actionSuccess(response, path);
    });
  }

  updateData(path: string, submitData: any, id: string) {
    this.hS.update(path, id, submitData).subscribe((response: any) => {
      this.actionSuccess(response, path);
    });
  }

  actionSuccess = (response: any, path: string) => {
    if (this.rS.fire(response)) {
      this.goTo(path);
    }
  };
  // form submit methods end

  // media methods

  initializeMedia = (obj: MediaFormatter): MediaFormatter => {
    for (const item in obj.mediaObjects) {
      obj.mediaFiles[item] = [];
    }
    return obj;
  };

  // same key in post, get, pagination
  setMedia = (obj: MediaFormatter): MediaFormatter => {
    for (const item in obj.mediaFiles) {
      if ((obj.mediaObjects[item] as MediaObject).allowMultiSelect) {
        obj.mediaFiles[item] = obj.data[item];
        if (obj.data[item].length) {
          obj.formValues[item] = this.multiSelectFormData(obj.formValues[item]);
        }
      } else {
        obj.mediaFiles[item] = [obj.data[item]];
      }
    }
    return obj;
  };

  // different key in post, get, pagination
  setCustomMedia = (obj: MediaFormatter): MediaFormatter => {
    // console.log(obj);
    for (const item in obj.mediaFiles) {
      if ((obj.mediaObjects[item] as MediaObject).allowMultiSelect) {
        obj.mediaFiles[item] = obj.data[obj.multiMediaKey];
        if (obj.data[obj.multiMediaKey].length) {
          obj.formValues[item] = this.multiSelectFormData(
            obj.data[obj.multiMediaKey]
          );
        }
      } else {
        obj.mediaFiles[item] = obj.data[obj.singleMediaKey];
        if (obj.data[obj.singleMediaKey].length) {
          obj.formValues[item] = obj.data[obj.singleMediaKey][0]['id'];
        }
      }
    }
    return obj;
  };

  getUrl = (url: string): string => {
    if (url) return this.hS.getFileUrl(url);
    return '';
  };

  getFileType = (data: any) => {
    let fileType = '';
    if (data?.mimeType?.indexOf('image') > -1) {
      fileType = 'image';
    } else if (data?.mimeType?.indexOf('video') > -1) {
      fileType = 'video';
    }
    return fileType;
  };

  youtubeParser = (url: any) => {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  };
}

export interface EnumTypes {
  RoleName: any[];
  PaymentType: any[];
  AvailabilityStatus: any[];
  OfferType: any[];
  MediaType: any[];
  PlotType: any[];
  TvcSources: any[];
}

export interface MediaObject {
  parameter: string;
  mediaType: string;
  allowMultiSelect: boolean;
}

export interface MediaFormatter {
  mediaFiles: any;
  mediaObjects: any;
  singleMediaKey: any;
  multiMediaKey: any;
  data: any;
  formValues: any;
  mainForm: any;
  submitData: any;
}
