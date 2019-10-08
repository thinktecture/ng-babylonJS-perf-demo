import {Component, OnInit} from '@angular/core';
import {MeshOptimizedComponent} from '../mesh-optimized/mesh-optimized.component';
import {AbstractMesh, MeshBuilder, Scene} from '@babylonjs/core';

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-instances.component.html',
  styleUrls: ['./mesh-instances.component.scss']
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
      this.naive.makeAsteroid(asteroid, i);
    }
  }
}
