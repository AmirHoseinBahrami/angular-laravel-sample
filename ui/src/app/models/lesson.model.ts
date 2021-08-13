import { ResponseInterface } from './../interfaces/response.interface';
import { BaseModel } from './base.model';
import {Validators} from '@angular/forms';
import {AppConstantModel} from './app-constant.model';

export class LessonModel extends BaseModel {
    title: string;
    score: number;
    constructor() {
        super();
        this.apiUrl = AppConstantModel.ROOT_URL_V1 + 'lesson';
    }

    public init() {

        this.getAllData((data: ResponseInterface) => {
          this.columns = this.columnsHeader(data.results.columns);
          this.initDataTable();
          this.dataSource = data.results.data;
        });
    }


    public columnsHeader(columns) {
        if (!columns) {
            //client column setter
        }
        return columns;
    }
}
