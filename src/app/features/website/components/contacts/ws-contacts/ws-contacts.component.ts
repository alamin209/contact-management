import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { LoaderService } from '@core/services/loader.service';
import { ProcessingService } from '@shared/services/processing.service';

@Component({
  selector: 'app-ws-contacts',
  templateUrl: './ws-contacts.component.html',
  styleUrls: ['./ws-contacts.component.scss'],
})
export class WsContactsComponent implements OnInit, AfterViewInit {
  params: { key: ''; value: '' }[] = [];
  extraParam: string = '';
  routeData: any;
  path: string = '';
  dataSource: any[] = [];
  pagination = {
    rowsPerPage: 10,
    totalCount: 0,
  };
  detailsData: any;

  displayedColumns: string[] = ['title', 'action'];
  selectedRowIndex = 0;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    public lS: LoaderService,
    public pS: ProcessingService
  ) {}

  ngOnInit() {
    this.routeData = this.pS.getRoutedata(this.route);
    this.path = this.routeData.path;
    // console.log(this.path);
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  showAll = (extraParam: string = '') => {
    this.pS.getAllWebData(this.path, extraParam).subscribe((result: any) => {
      console.log(result);
      // this.pagination.totalCount = result?.count;
      this.dataSource = result;
      console.log(this.dataSource);
    });
  };

  add = () => {
    this.pS.addUrl(this.path);
  };

  edit = (id: string, formData: any = {}) => {
    this.pS.editUrlData(this.path, id, formData);
  };

  delete = (id: string) => {
    this.pS.delete(this.path, id).subscribe((res: boolean) => {
      if (res) {
        this.showAll();
      }
    });
  };

  submittedSearch = ($event: any) => {
    const { firstText, dropdownId } = $event;
    let obj1: any = { key: 'firstText', value: firstText };
    let obj2: any = { key: 'dropdownId', value: dropdownId };
    this.params = [...obj1, ...obj2];
    this.extraParam = this.pS.addExtraParams(this.params);
    this.showAll(this.extraParam);
  };

  showDetails = (row: any) => {
    this.detailsData = { ...row };
    this.detailsData.count = 1;
    this.detailsData.emails = [];

    const { id } = row;
    this.selectedRowIndex = id;

    const extraParam = `/${id}/email_addresses`;
    this.pS.getAllWebData(this.path, extraParam).subscribe((result: any) => {
      // console.log(result);
      this.detailsData.emails = result;
      console.log(this.detailsData);
    });
  };
}
