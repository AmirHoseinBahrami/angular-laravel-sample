import { SpinnerOverlayComponent } from './components/spinner-overlay/spinner-overlay.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppInjectorService } from './services/app-injector.service';
import { DataTableComponent } from './components/data-table/data-table.component';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LessonComponent } from './lesson/lesson.component';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatTableExporterModule} from 'mat-table-exporter';
import {HttpClientModule} from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AppComponent,
    LessonComponent,
    DataTableComponent,
    SpinnerOverlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTableExporterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AppInjectorService,
        {
            provide: APP_INITIALIZER,
            useFactory: (service: AppInjectorService) => function () {
                return service.init();
            },
            deps: [AppInjectorService],
            multi: true
        },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
