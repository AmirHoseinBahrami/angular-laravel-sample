import { ResponseInterface } from './../interfaces/response.interface';
import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {UIService} from './ui.service';
import {SnackBarService} from './snack-bar.service';
import {MatDialog} from '@angular/material/dialog';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,

  })
};

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient,
              private uiService: UIService,
              private snackBar: SnackBarService,
              public dialog: MatDialog) {
  }

  get(url, onSuccess: (data) => void, onError: (data) => void = null) {
    this.uiService.showSpinner.next(true);
    return this.http.get(url, {headers: httpOptions.headers, responseType: 'json'}
      )
      .subscribe(
        (data:ResponseInterface) => {
          if(data.code == 200)
          {
            this.uiService.showSpinner.next(false);
            onSuccess(data);
          }
          else
          {
            throw Error(data.massage);
          }
        },
        error => {
          this.snackBar.openSnackBar('خطا : ' + error.error, 'تایید');
            this.uiService.showSpinner.next(false);
        }
      );
  }

  post(url, data, onSuccess: (response) => void,onError: (data) => void = null) {

  }


  put(url, data, onSuccess: (response) => void, onError: (data) => void = null) {

  }


  delete(url, confirm, onSuccess: (data) => void, onError: (data) => void = null) {

  }

}
