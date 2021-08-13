import { UIService } from './services/ui.service';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bpm-foods';
  showSpinner = false;
  spinnerSubscription: Subscription;

  constructor(
      private uiService: UIService,
      private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spinnerSubscription = this.uiService.showSpinner.subscribe(
        (data) => {
          this.showSpinner = data;
          this.cdRef.detectChanges();
        },
        () => {
          console.log('Error in spinner');
        }
    );
  }
}
