import { LessonModel } from './../models/lesson.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  model = new LessonModel();
    constructor() {
    }
    ngOnInit(): void {
        this.model.init();
    }

}
