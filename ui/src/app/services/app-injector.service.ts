import { AppInjector } from './../models/app-injector.model';
import {Injectable, Injector} from '@angular/core';

//Service for inject service to base model
@Injectable({providedIn: 'root'})
export class AppInjectorService {
    constructor(private injector: Injector) {
        AppInjector.setInjector(this.injector);
    }

    init() {
        AppInjector.setInjector(this.injector);
    }
}
