import {Component, OnInit} from '@angular/core';
import {AbstractMesh, Mesh, MeshBuilder, Scene} from '@babylonjs/core';
import {NaiveComponent} from '../naive/naive.component';

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-optimized.component.html',
  styleUrls: ['./mesh-optimized.component.scss']
})
export class MeshOptimizedComponent extends NaiveComponent implements OnInit {

  ngOnInit() {
    const scene = this.naive.createScene(this.canvasRef);
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    this.addPlanets(scene);
    this.addAsteroids(scene);
    scene.freezeActiveMeshes(); // 5-10 fps
    scene.freezeMaterials(); // 1-5 fps
    scene.blockfreeActiveMeshesAndRenderingGroups = false;
  }

  addAsteroids(scene: Scene) {

    const baseSphere = MeshBuilder.CreateSphere('BaseSphere', {segments: 1, diameter: 1}, scene);
    baseSphere.convertToUnIndexedMesh(); // TEUER BEI VIELEN MESHES - 1-3fps
    baseSphere.convertToFlatShadedMesh(); // TEUER BEI VIELEN MESHES - 1-3fps
    baseSphere.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY;
    baseSphere.isVisible = false;
    baseSphere.freezeNormals();
    baseSphere.disableEdgesRendering();
    baseSphere.doNotSyncBoundingInfo = true; // 5-10 fps;

    const asteroids = [];
    for (let i = 0; i < 4000; i++) {
      const asteroid = baseSphere.clone('instance' + i);
      this.naive.addRandomMaterial(asteroid);
      this.naive.makeAsteroid(asteroid, i);
      asteroid.isVisible = true;
    }

    // Mesh.MergeMeshes(asteroids, true, true); // TEUER!
    for (let i = 0; i < asteroids.length; i += 500) { // DAS KLAPPT :)  5 - 10 fps
      Mesh.MergeMeshes(asteroids.slice(i, i + 500), true);
    }
  }
}
