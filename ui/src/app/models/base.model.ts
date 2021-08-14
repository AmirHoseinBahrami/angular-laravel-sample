import { ExcellExportInterface } from './../interfaces/excell-export.interface';
import { AppInjector } from './app-injector.model';
import { IDataTableHeader } from '../interfaces/data-table/data-table';
import { UIService } from './../services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from './../services/snack-bar.service';
import { CrudService } from './../services/crud.service';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, FormGroupDirective} from '@angular/forms';
import {Route, Router} from '@angular/router';

/* All models inherit from this model */

export class BaseModel {
  //all models fix property
    id: number;
    updated_at: number;
    created_at: string;
    active: boolean;
    //
    apiUrl: string; // set api url for each model
    crudService: CrudService;
    uiService: UIService;
    dataSource: any[];
    columns: IDataTableHeader[];
    dataHasPaginate: boolean;
    editMode: boolean;
    snackBar: SnackBarService;
    dataTableHasSearch: boolean;
    setDataTableAllPage: boolean;
    excellExport: ExcellExportInterface;

    constructor() {
        const injector = AppInjector.getInjector();
        this.editMode = false;
        this.crudService = injector.get(CrudService);
        this.uiService = injector.get(UIService);
        this.snackBar = injector.get(SnackBarService);
        this.dataHasPaginate = true;
        this.dataTableHasSearch = true;
        this.setDataTableAllPage = false;
        this.excellExport={
          fileName : 'export',
          sheet:'',
          Props:null
        }
    }

    /**Begin CRUD */
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

    delete(urlparam = null, onSuccess: (response) => void = null, onError: (data) => void = null) {
    }

    /**End CRUD */

    // call this method in data table for set custome style sheet for each model
    setGridStyle() {
    }

    // call this method in data table for set custome style sheet for each row in each model
    setGridRowStyle(data) {
      return null;
    }

    // call this method in data table for e4nable seletable data table
    public allowSelect() {
        return false;
    }

    // call this method in data table show ing ad use from edit button
    public allowEditGrid() {
        return false;
    }

    // call this method in data table show ing ad use from delete button
    public allowDeleteGrid() {
        return false;
    }

    // initialize data table for showing data
    public initDataTable() {
        this.dataSource = [];
        this.dataSource.push(1);
        this.dataSource.slice();
    }

}
