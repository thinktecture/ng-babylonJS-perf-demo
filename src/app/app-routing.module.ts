import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UnoptimizedComponent} from './scenes/unoptimized/unoptimized.component';
import {MeshOptimizedComponent} from './scenes/mesh-optimized/mesh-optimized.component';
import {MeshInstancesComponent} from './scenes/material-optimized/mesh-instances.component';


export const routes: Routes = [
  {path: 'naive', component: UnoptimizedComponent},
  {path: 'meshOpti', component: MeshOptimizedComponent},
  {path: 'instanceOpti', component: MeshInstancesComponent}
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
