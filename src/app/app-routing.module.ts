import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NaiveComponent} from './scenes/naive/naive.component';
import {MeshOptimizedComponent} from './scenes/mesh-optimized/mesh-optimized.component';


export const routes: Routes = [
  {path: 'naive', component: NaiveComponent},
  {path: 'meshOpti', component: MeshOptimizedComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
