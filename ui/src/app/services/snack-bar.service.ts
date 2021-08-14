import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/** snack bar service */
@Injectable({
  providedIn: 'root'
})

export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string = 'تایید', duration: number = 10000 ) {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }
}


