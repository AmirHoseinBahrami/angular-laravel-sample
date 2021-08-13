import { ExcellExportInterface } from './../interfaces/excell-export.interface';
import { AppInjector } from './app-injector.model';
import { DataTableComponent } from './../components/data-table/data-table.component';
import { IDataTableHeader } from './data-table/data-table-header';
import { UIService } from './../services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from './../services/snack-bar.service';
import { CrudService } from './../services/crud.service';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, FormGroupDirective} from '@angular/forms';
import {Route, Router} from '@angular/router';


export class BaseModel {
  //all models fix property
    id: number;
    updated_at: number;
    created_at: string;
    active: boolean;
    //
    apiUrl: string;
    gridApiUrl: string;
    additionalGridWhere: string;
    crudService: CrudService;
    uiService: UIService;
    dataSource: any[];
    columns: IDataTableHeader[];
    dataHasPaginate: boolean;
    editMode: boolean;
    snackBar: SnackBarService;
    router: Router;
    route: ActivatedRoute;
    dialog: MatDialog;
    dataTableHasSearch: boolean;
    dataTableComponent: DataTableComponent;
    setDataTableAllPage: boolean;
    excellExport: ExcellExportInterface;

    constructor() {
        const injector = AppInjector.getInjector();
        this.additionalGridWhere = '';
        this.editMode = false;
        this.crudService = injector.get(CrudService);
        this.uiService = injector.get(UIService);
        this.router = injector.get(Router);
        this.route = injector.get(ActivatedRoute);
        this.snackBar = injector.get(SnackBarService);
        this.dialog = injector.get(MatDialog);
        this.gridApiUrl = '/lesson';
        this.dataHasPaginate = false;//local pagination
        this.dataTableHasSearch = true;
        this.setDataTableAllPage = false;
        this.excellExport={
          fileName : 'export',
          sheet:'',
          Props:null
        }
    }

    init()
    {

    }

    add(form, onSuccess: (response) => void, onError = null) {

    }

    find(urlparam = null, onSuccess: (response) => void = null, onError: (data) => void = null) {

    }

    put(form, urlparam = null, onSuccess: (response) => void = null,
        onError: (data) => void = null) {

    }

    getAllData(onSuccess: (response) => void, onError: (data) => void = null, urlparam = null) {
        if (urlparam) {
            this.crudService.get(this.apiUrl + '/' + urlparam,
                (data: any) => {
                    onSuccess(data);
                }
            );
        } else {
            this.crudService.get(this.apiUrl + '/',
                (data: any) => {
                    onSuccess(data);
                }
            );
        }

    }

    setGridStyle() {
    }

    delete(urlparam = null, onSuccess: (response) => void = null, onError: (data) => void = null) {
    }

    setGridRowStyle(data) {
      return null;
    }

    public allowSelect() {
        return false;
    }

    public allowEditGrid() {
        return false;
    }

    public allowDeleteGrid() {
        return false;
    }

    public initDataTable() {
        this.dataSource = [];
        this.dataSource.push(1);
        this.dataSource.slice();
    }

}
