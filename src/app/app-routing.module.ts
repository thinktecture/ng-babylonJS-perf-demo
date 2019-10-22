import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UnoptimizedComponent} from './scenes/1_unoptimized/unoptimized.component';
import {MeshOptimizedComponent} from './scenes/2_optimized/mesh-optimized.component';
import {MeshInstancesComponent} from './scenes/3_instance/mesh-instances.component';


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
