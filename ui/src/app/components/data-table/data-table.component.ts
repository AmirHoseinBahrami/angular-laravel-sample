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
import {IDataTableRequest} from "../../models/data-table/data-table-request";
import {SelectionModel} from "@angular/cdk/collections";
import {getPersianPaginatorIntl} from "./pesian-paginator-intl";
import { UIService } from '../../services/ui.service';


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

    dataTableReqest = {} as IDataTableRequest;
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

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        this.model.selectedRow = this.selection['_selected'];
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.ds.data.forEach(row => this.selection.select(row));
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.ds.data.length;
        return numSelected === numRows;
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
        console.log( this.displayedColumns);
        console.log( this.ds);


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
        // console.log(this.model.dataSource);
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
        this.model.dataTableComponent = this;
        this.ds = new MatTableDataSource(this.model.dataSource);
        if (this.model.gridApiUrl && this.model.dataHasPaginate) {
            this.sort.sortChange.subscribe(() => {
                this.paginator.pageIndex = 0;
            });
            merge(this.sort.sortChange, this.paginator.page)
                .pipe(
                    startWith({}),
                    switchMap(() => {
                        this.isLoadingResults = true;
                        return this.getData(0);
                    }),
                    map(data => {
                        this.isLoadingResults = false;
                        this.isRateLimitReached = true;
                        this.resultsLength = data['count'];
                        this.pageSize = data['data'].length;
                        return data;
                    }),
                    catchError((err) => {
                        this.catchErr = err;
                        this.snackBar.openSnackBar('خطا :' + err.message, 'تایید');
                        this.isLoadingResults = false;
                        this.isRateLimitReached = true;
                        return observableOf([]);
                    })
                ).subscribe(data => {
                    this.model.mappingData(data['data']);
                    this.model.dataSource = data['data'];
                    this.ds = new MatTableDataSource(this.model.dataSource);
                }
            );
        } else {
            this.ds.sort = this.sort;
            if (this.model.dataHasPaginate) {
                // this.ds.paginator = this.paginator;
              setTimeout(() => this.ds.paginator = this.paginator);

            }
        }
    }

    public getData(page: number) {
        const href = this.url;
        let requestUrl;
        if (this.model.dataHasPaginate) {
            if (this.sort.active) {
                requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;;
            } else {
                requestUrl = `${href}?page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;;
            }
        } else {
            if (this.sort.active) {
                requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&hasPaginate=false` + this.model.additionalGridWhere;;
            } else {
                requestUrl = `${href}?hasPaginate=false` + this.model.additionalGridWhere;
            }
        }
        return this._httpClient.get(requestUrl);
    }

    public refreshPage(page: number, onSuccess: (data) => void = null, onError: (data) => void = null) {
        const href = this.url;
        let requestUrl;
        if (page > -1) {
            if (this.sort.active) {
                requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;
            } else {
                requestUrl = `${href}?page=${page + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;
            }
        } else {
            if (this.sort.active) {
                requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&hasPaginate=false` + this.model.additionalGridWhere;
            } else {
                requestUrl = `${href}?hasPaginate=false` + this.model.additionalGridWhere;
            }
        }

        return this.crudService.get(requestUrl, data => {
            this.model.dataSource = this.model.mappingData(data['data']);
            this.model.dataSource.slice();
            this.ds = new MatTableDataSource(this.model.dataSource);
            this.resultsLength = data['count'];
            this.pageSize = data['data'].length;
            onSuccess(data);
        });
    }

    applyFilter(event: Event) {
        if (this.model.gridApiUrl) {
            if (event['keyCode'] == 13) {
                const filterValue = (event.target as HTMLInputElement).value;
                const href = this.url;
                let requestUrl;
                if (this.model.dataHasPaginate) {
                    if (this.sort.active) {
                        requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}`+ this.model.additionalGridWhere;
                    } else {
                        requestUrl = `${href}?page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;
                    }
                } else {
                    if (this.sort.active) {
                        requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&hasPaginate=false` + this.model.additionalGridWhere;
                    } else {
                        requestUrl = `${href}?hasPaginate=false` + this.model.additionalGridWhere;;
                    }
                }


                if (filterValue.length > 0) requestUrl += `&filterValue=${filterValue}`;

                this.crudService.get(requestUrl, data => {
                    this.model.dataSource = this.model.mappingData(data['data']);
                    this.ds = new MatTableDataSource(this.model.dataSource);
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.resultsLength = data['count']; //for paginate
                    this.pageSize = data['data'].length; //for paginate
                });
            }
        } else {
            const filterValue = (event.target as HTMLInputElement).value;
            this.ds.filter = filterValue.trim().toLowerCase();
        }
    }

    delete(model, index: number) {
        this.model.initDelete(model, (data: any) => {
            this.model.dataSource.splice(index, 1);
            this.ds = new MatTableDataSource(this.model.dataSource);
        });
    }

    edit(model: any) {
        this.onRowEdit.emit(model);
    }

    pageChange() {
        const href = this.url;
        let requestUrl;
        if (this.model.dataHasPaginate) {
            if (this.sort.active) {
                requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;;
            } else {
                requestUrl = `${href}?page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}` + this.model.additionalGridWhere;;
            }
        } else {
            if (this.sort.active) {
                requestUrl = `${href}?sort=${this.sort.active}&order=${this.sort.direction}&hasPaginate=false` + this.model.additionalGridWhere;;
            } else {
                requestUrl = `${href}?hasPaginate=false` + this.model.additionalGridWhere;
            }
        }


        this.crudService.get(requestUrl, data => {
            this.model.dataSource = data['data'];
            this.ds = new MatTableDataSource(this.model.dataSource);
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.resultsLength = data['count']; //for paginate
            this.pageSize = data['data'].length; //for paginate
        });
    }

    textBoxButtonModelSet(element, column, index) {
        if (!this.textBoxButtonModel[index]) {
            this.textBoxButtonModel[index] = this.model.gridTextDataSet(element, column);
        }
        return this.textBoxButtonModel[index];
    }

    textBoxButtonKeyUp($event, index) {
        this.textBoxButtonModel.fill($event.target.value, index, index + 1);
        console.log(this.textBoxButtonModel);
    }

    gridOnTextButtonClick(element: any, key: any, dataTableComponent: DataTableComponent, index) {
        console.log(this.textBoxButtonModel[index]);
        this.model.gridOnTextButtonClick(element, key, this, this.textBoxButtonModel[index]);
    }
}
