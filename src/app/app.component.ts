import {Component, OnDestroy, OnInit} from '@angular/core';
import {InteractionService} from './services/interaction.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  jClicked = 0;
  showPrefPane = false;
  subscription: Subscription;

  constructor(readonly interaction: InteractionService) {
  }

  ngOnInit() {
    this.subscription = this.interaction.onJupyterClick.subscribe(() => this.jClicked++);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
