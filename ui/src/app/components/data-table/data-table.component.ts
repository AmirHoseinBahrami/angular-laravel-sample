import {
    AfterViewInit, ChangeDetectorRef,
    Component, DoCheck,
    EventEmitter,
    Input, IterableDiffers,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SnackBarService} from "./../../services/snack-bar.service";
import {CrudService} from "../../services/crud.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {SelectionModel} from "@angular/cdk/collections";
import {getPersianPaginatorIntl} from "./pesian-paginator-intl";
import { UIService } from '../../services/ui.service';
import { IFilter } from 'src/app/interfaces/data-table/filter';
import { ISort } from 'src/app/interfaces/data-table/sort';
import { IDataTableHeader } from 'src/app/interfaces/data-table/data-table';


@Component({
    selector: 'data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnInit, AfterViewInit, OnChanges, DoCheck {
    @Input() model: any;
    @Input() hasFooter: boolean = false;
    @Input() cardBackgroundTransparent: boolean = false;
    @Input() wrapText: boolean = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Output() onRowEdit = new EventEmitter<void>();

    catchErr: string;
    resultsLength = 0;
    isLoadingResults = false;
    isRateLimitReached = false;
    pageSize: number;
    ds;
    displayedColumns = [];
    modifiedColumns = [];
    selectColumns = [];
    iterableDiffer;
    url;
    textBoxButtonModel: any[] = [];
    pageSizeOptions = [5, 10, 20];
    selection = new SelectionModel<any>(true, []);


    constructor(private _httpClient: HttpClient,
                private snackBar: SnackBarService,
                private crudService: CrudService,
                private router: Router,
                private uiService: UIService,
                private changeDetectorRefs: ChangeDetectorRef,
                private iterableDiffers: IterableDiffers) {
        this.iterableDiffer = iterableDiffers.find([]).create(null);

    }

    ngOnInit() {
        this.paginator._intl = getPersianPaginatorIntl();
        this.textBoxButtonModel = new Array(this.model.dataSource.length);
        if (this.model.gridApiUrl)
            this.url = this.model.apiUrl + this.model.gridApiUrl;
        else
            this.url = this.model.apiUrl;
        this.displayedColumns.push('id');
        this.displayedColumns = this.displayedColumns.concat(this.model.columns.map(x => x.field));
        this.ds = new MatTableDataSource(this.model.dataSource);
        if (this.model.allowDeleteGrid())
            this.modifiedColumns.push('delete');
        if (this.model.allowEditGrid())
            this.modifiedColumns.push('edit');
        if (this.model.allowSelect())
            this.selectColumns.push('select');

        this.displayedColumns = this.selectColumns.concat(this.displayedColumns.concat(this.modifiedColumns));
    }

    ngDoCheck() {
        let changes = this.iterableDiffer.diff(this.model.dataSource);
        if (changes) {
            this.ds = new MatTableDataSource(this.model.dataSource);
            this.changeDetectorRefs.detectChanges();

        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.model.dataSource.slice();
        this.changeDetectorRefs.detectChanges();
        this.ds = new MatTableDataSource(this.model.dataSource);
    }

    ngAfterViewInit() {
      this.ds = new MatTableDataSource(this.model.dataSource);
          this.sort.sortChange.subscribe(() => {
              this.paginator.pageIndex = 0;
          });
          merge(this.sort.sortChange, this.paginator.page)
              .pipe(
                  startWith({}),
                  switchMap(() => {
                    this.uiService.showSpinner.next(true);
                      return this.getData(true);
                  }),
                  map(data => {
                     this.uiService.showSpinner.next(false);
                      this.resultsLength = data['results'].count;
                      this.pageSize = this.paginator.pageSize;
                      return data;
                  }),
                  catchError((err) => {
                      this.catchErr = err;
                      this.snackBar.openSnackBar('خطا :' + err.message, 'تایید');
                      this.uiService.showSpinner.next(false);
                      return observableOf([]);
                  })
              ).subscribe(data => {
                  this.model.dataSource = data['results'].data.data;
                  this.ds = new MatTableDataSource(this.model.dataSource);
              }
          );
      }

    public getData(firstCall : boolean = false) {
      const href = this.url;
      let requestUrl;
      requestUrl = `${href}?page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}`;

      if (this.sort.active) {
        let sort: ISort[] = []
        sort.push(
          {
            sortField: this.sort.active,
            sortType: this.sort.direction
          });
        requestUrl += `&sort=${JSON.stringify(sort)}`;
      }
      return  this._httpClient.get(requestUrl);
  }

  getDataOpration()
  {
    const filterValue = (event.target as HTMLInputElement).value;
    const href = this.url;
    let requestUrl;
    requestUrl = `${href}?page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}`;
    if (this.sort.active) {
      let sort: ISort[] = []
      sort.push(
        {
          sortField: this.sort.active,
          sortType: this.sort.direction
        });
      requestUrl += `&sort=${JSON.stringify(sort)}`;
    }
    if (filterValue.length > 0)
    {
      let filter : IFilter;
      let filters : IFilter[] = [];
      this.model.columns.forEach(element => {
        if(element.searchable)
        {
          filter  = {
            filterField : element.field,
            filterValue : filterValue,
            filterOperand : 'like'
          }
          filters.push(filter);
        }
      });
      requestUrl += `&filter=${JSON.stringify(filters)}`;

    }
    return this.crudService.get(requestUrl, data => {
      this.model.dataSource = data.results.data.data;
      this.model.dataSource.slice();
      this.ds = new MatTableDataSource(this.model.dataSource);
      this.resultsLength = data.results.count;
      this.pageSize = this.paginator.pageSize;
    });
  }

  IsSortable(column : IDataTableHeader)
  {
    return !column.sortable;
  }

  applyFilter(event: Event) {
      this.getDataOpration();
  }

  delete(model, index: number) {

  }

  edit(model: any) {
      this.onRowEdit.emit(model);
  }

  pageChange() {
      this.getData();
  }
}
