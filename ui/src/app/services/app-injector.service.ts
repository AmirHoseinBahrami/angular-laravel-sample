import { AppInjector } from './../models/app-injector.model';
import {Injectable, Injector} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AppInjectorService {
    constructor(private injector: Injector) {
        AppInjector.setInjector(this.injector);
    }

    init() {
        AppInjector.setInjector(this.injector);
    }
}
