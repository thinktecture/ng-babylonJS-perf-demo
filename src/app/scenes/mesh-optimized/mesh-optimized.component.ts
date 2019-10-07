import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractMesh, Animation, Axis, Color3, Matrix, Mesh, MeshBuilder, Space, StandardMaterial, Vector3} from '@babylonjs/core';
import {NaiveService} from '../../services/naive.service';

const FPS = 60;

@Component({
  selector: 'app-mesh-optimized',
  templateUrl: './mesh-optimized.component.html',
  styleUrls: ['./mesh-optimized.component.scss']
})
export class MeshOptimizedComponent implements OnInit, AfterViewInit {

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private readonly naive: NaiveService) {
  }

  ngOnInit() {
    const scene = this.naive.createScene(this.canvasRef);
    const baseSphere = MeshBuilder.CreateSphere('BaseSphere', {segments: 16, diameter: 1}, scene);
    baseSphere.convertToUnIndexedMesh(); // TEUER BEI VIELEN MESHES
    baseSphere.isVisible = false;
    baseSphere.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY;

    scene.beginAnimation(this.naive.createPlanetInSystem('mercury', .3, 4, [.5, .5, .5]), 0, FPS, true, 0.25);
    scene.beginAnimation(this.naive.createPlanetInSystem('venus', .4, 5, [.9, .9, 0]), 0, FPS, true, 0.2);
    scene.beginAnimation(this.naive.createPlanetInSystem('earth', .6, 6.1, [0, 0, 1]), 0, FPS, true, 0.12);
    scene.beginAnimation(this.naive.createPlanetInSystem('mars', .5, 7.3, [1, 0, 0]), 0, FPS, true, 0.1);
    scene.beginAnimation(this.naive.createPlanetInSystem('jupyter', 1.3, 10.5, [.95, .95, .85]), 0, FPS, true, 0.05);

    // asteroids
    const asteroids = [];
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    for (let i = 0; i < 4000; i++) {
      const asteroid = baseSphere.clone('instance' + i);
      asteroid.scaling = new Vector3(0.1, 0.1, 0.1);
      asteroid.translate(Axis.Y, Math.random() * 1.3 - 1, Space.WORLD);
      asteroid.translate(Axis.X, Math.random(), Space.WORLD);
      asteroid.parent = this.naive.sun;
      asteroid.setPivotMatrix(Matrix.Translation(-90, 0, 0), false);
      asteroid.rotate(Axis.Y, Math.PI / 2 * i * Math.random());
      this.addRandomMaterial(asteroid);
      asteroid.isVisible = true;
    }

    // Mesh.MergeMeshes(asteroids, true, true); // TEUER!
    for (let i = 0; i < asteroids.length; i += 350) { // DAS KLAPPT :)
      Mesh.MergeMeshes(asteroids.slice(i, i + 350), true);
    }
    scene.blockfreeActiveMeshesAndRenderingGroups = false;
    scene.freezeActiveMeshes();
  }

  ngAfterViewInit(): void {
    this.naive.animate(true);
  }


  addRandomMaterial(mesh: Mesh) {
    const sphereMaterial = new StandardMaterial('ranMat' + Math.random(), this.naive.getScene());
    sphereMaterial.diffuseColor = new Color3(Math.random(), Math.random(), Math.random()).scale(0.5);
    mesh.material = sphereMaterial;
  }
}
