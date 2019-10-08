import {Component, OnInit} from '@angular/core';
import {MeshOptimizedComponent} from '../mesh-optimized/mesh-optimized.component';
import {AbstractMesh, Axis, Matrix, MeshBuilder, Scene, Space, Vector3} from '@babylonjs/core';

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-instances.component.html',
  styleUrls: ['./mesh-instances.component.scss']
})
export class MeshInstancesComponent extends MeshOptimizedComponent implements OnInit {

  addAsteroids(scene: Scene) {
    const bases = [];
    // create 4 different meshes
    for (let i = 0; i < 6; i++) {
      const base = MeshBuilder.CreateSphere('BaseSphere', {segments: 1, diameter: 1}, scene);
      base.convertToUnIndexedMesh(); // TEUER BEI VIELEN MESHES - 1-3fps
      base.convertToFlatShadedMesh(); // TEUER BEI VIELEN MESHES - 1-3fps
      base.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY;
      this.naive.addRandomMaterial(base);
      base.freezeNormals();
      bases.push(base);
    }

    for (let i = 0; i < 4000; i++) {
      const asteroid = bases[i % 6].createInstance('instance' + i);
      this.naive.makeAsteroid(asteroid, i);
    }
  }
}
