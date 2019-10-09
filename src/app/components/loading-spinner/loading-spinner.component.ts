import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../services/loading.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  animations: [ // the fade-in/fade-out animation.
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(250)
      ]),
      transition(':leave',
        animate(250, style({opacity: 0})))
    ])]
})

export class LoadingSpinnerComponent implements OnInit {

  constructor(readonly loading: LoadingService) {
  }

  ngOnInit() {
  }

}
