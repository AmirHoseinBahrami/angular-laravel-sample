import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

// for control some ui components like spiiner or other ...
@Injectable({
  providedIn: 'root'
})
export class UIService {
  public showSpinner = new Subject<boolean>();
  constructor() { }
}
