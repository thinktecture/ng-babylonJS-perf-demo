import {Component} from '@angular/core';
import {AbstractMesh, Mesh, MeshBuilder, Scene} from '@babylonjs/core';
import {NaiveComponent} from '../naive/naive.component';

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-optimized.component.html',
  styleUrls: ['./mesh-optimized.component.scss']
})
export class MeshOptimizedComponent extends NaiveComponent {

  initScene() {
    const scene = this.naive.createScene(this.canvasRef);
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    this.addPlanets(scene);
    scene.blockfreeActiveMeshesAndRenderingGroups = false;
  }

  getBaseSphere(suffix = ''): Mesh {
    const baseSphere = MeshBuilder.CreateSphere('BaseSphere' + suffix, {
      segments: this.asteroidConfig.segments,
      diameter: 1
    }, this.naive.scene);
    if (this.meshConfig.index) {
      baseSphere.convertToUnIndexedMesh();
    } // TEUER BEI VIELEN MESHES - 1-3fps
    if (this.meshConfig.flat) {
      baseSphere.convertToFlatShadedMesh();
    } // TEUER BEI VIELEN MESHES - 1-3fps
    baseSphere.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY;
    baseSphere.isVisible = false;
    if (this.meshConfig.normals) {
      baseSphere.freezeNormals();
    }
    if (this.meshConfig.edge) {
      baseSphere.disableEdgesRendering();
    }
    if (this.meshConfig.boundings) {
      baseSphere.doNotSyncBoundingInfo = true;
    } // 5-10 fps;
    this.naive.addRandomMaterial(baseSphere);
    return baseSphere;
  }

  addAsteroids(scene: Scene, amount: number) {
    const baseSphere = this.getBaseSphere();

    for (let i = 0; i < amount; i++) {
      const asteroid = baseSphere.clone('instance' + i);
      this.asteroids.push(asteroid);
      this.naive.makeAsteroid(asteroid, i);
      asteroid.isVisible = true;
    }

    if (!this.meshConfig.merge) {
      return;
    }
    // TODO better slicing
    // Mesh.MergeMeshes(asteroids, true, true); // TEUER!
    const groupSize = 300;
    for (let i = 0; i < this.asteroids.length; i += groupSize) { // DAS KLAPPT :)  5 - 10 fps
      const upper = i + groupSize > this.asteroids.length ? this.asteroids.length : i + groupSize;
      const mergedMesh  = Mesh.MergeMeshes(this.asteroids.slice(i, upper) as Mesh[], true);
      mergedMesh.parent = this.naive.sun;
      this.naive.addRandomMaterial(mergedMesh);

    }
  }
}
