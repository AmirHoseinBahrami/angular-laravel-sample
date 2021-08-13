import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UIService {
  public showSpinner = new Subject<boolean>();
  constructor() { }
}
