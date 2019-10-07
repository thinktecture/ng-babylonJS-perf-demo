import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NgZone} from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { NaiveComponent } from './scenes/naive/naive.component';
import { MeshOptimizedComponent } from './scenes/mesh-optimized/mesh-optimized.component';

@NgModule({
  declarations: [
    AppComponent,
    NaiveComponent,
    MeshOptimizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
