import {Component} from '@angular/core';
import {MeshOptimizedComponent} from '../mesh-optimized/mesh-optimized.component';
import {Scene} from '@babylonjs/core';

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-instances.component.html'
})
export class MeshInstancesComponent extends MeshOptimizedComponent {

  addAsteroids(scene: Scene, amount: number) {
    const bases = [];
    // create 4 different meshes
    for (let i = 0; i < 6; i++) {
      const base = this.getBaseSphere();
      bases.push(base);
    }

    for (let i = 0; i < amount; i++) {
      const asteroid = bases[i % 6].createInstance('instance' + i);
      this.asteroids.push(asteroid);
      this.solarSystem.makeAsteroid(asteroid, i);
    }
  }
}
