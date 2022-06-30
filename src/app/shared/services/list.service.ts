import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpService } from '@core/services/http.service';
import { LoaderService } from '@core/services/loader.service';
import { ResponseService } from '@core/services/response.service';
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
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  constructor(
    private readonly httpService: HttpService,
    private loaderService: LoaderService,
    private readonly snackBarService: ResponseService,
    private readonly matDialog: MatDialog
  ) {}

  delete = (uri: string, id: string): Observable<any> => {
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
        this.loaderService.isLoading.next(true);
        this.httpService.remove(uri, id).subscribe((res: any) => {
          this.snackBarService.fire(res);
          this.loaderService.isLoading.next(false);
          returnData.next(true);
        });
      } else {
        returnData.next(false);
      }
    });

    return returnData;
  };

  showAll = (uri: string, sort: MatSort, paginator: MatPaginator) => {
    sort.sortChange.subscribe(() => (paginator.pageIndex = 0));

    return merge(sort.sortChange, paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.loaderService.isLoading.next(true);
        const page = paginator.pageIndex + 1;
        const limit = paginator.pageSize;
        const sortBy = sort?.active || 'updatedAt';
        const order = sort?.direction.toUpperCase() || 'DESC';

        // return this.httpService.pagination(page, limit, sortBy, order, uri);
        return of([]);
      }),
      map((res: any) => {
        const { count, data } = res.page;
        this.loaderService.isLoading.next(false);
        return res.page;
      }),
      catchError(() => {
        this.loaderService.isLoading.next(false);
        return of([]);
      })
    );
  };
}
