import {Component} from '@angular/core';
import {MeshOptimizedComponent} from '../mesh-optimized/mesh-optimized.component';
import {Mesh, Scene} from '@babylonjs/core';

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-instances.component.html'
})
export class MeshInstancesComponent extends MeshOptimizedComponent {
  addAsteroids(scene: Scene, amount: number) {
    const bases: Mesh[] = [];
    // create 4 different meshes
    for (let i = 0; i < 6; i++) {
      const base = this.getBaseSphere(`${i}`);
      bases.push(base);
    }

    for (let i = 0; i < amount; i++) {
      // create an mesh instance, this shares everything with the base mesh,
      // except its rotation, scale and position
      const asteroid = bases[i % 6].createInstance('instance' + i);
      this.asteroids.push(asteroid);
      this.solarSystem.makeAsteroid(asteroid, i);
    }
    this.asteroids.push(...bases);
  }
}

