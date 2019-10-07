import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NaiveService} from '../../services/naive.service';
import {Animation, Axis, Color3, Matrix, Mesh, MeshBuilder, Space, StandardMaterial} from '@babylonjs/core';

const FPS = 20;

@Component({
  selector: 'app-naive',
  templateUrl: './naive.component.html',
  styleUrls: ['./naive.component.scss']
})
export class NaiveComponent implements OnInit, AfterViewInit {

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private readonly naive: NaiveService) {
  }

  ngOnInit() {
    const scene = this.naive.createScene(this.canvasRef);

    scene.beginAnimation(this.naive.createPlanetInSystem('mercury', .3, 4, [.5, .5, .5]), 0, FPS, true, 0.25);
    scene.beginAnimation(this.naive.createPlanetInSystem('venus', .4, 5, [.9, .9, 0]), 0, FPS, true, 0.2);
    scene.beginAnimation(this.naive.createPlanetInSystem('earth', .6, 6.1, [0, 0, 1]), 0, FPS, true, 0.12);
    scene.beginAnimation(this.naive.createPlanetInSystem('mars', .5, 7.3, [1, 0, 0]), 0, FPS, true, 0.1);
    scene.beginAnimation(this.naive.createPlanetInSystem('jupyter', 1.3, 10.5, [.95, .95, .85]), 0, FPS, true, 0.05);

    // asteroids
    for (let i = 0; i < 4000; i++) {
      const s = MeshBuilder.CreateSphere(`sphere${i}`, {segments: 1, diameter: .1}, scene);
      s.translate(Axis.Y, Math.random() * 1.3 - 1, Space.WORLD);
      s.translate(Axis.X, Math.random(), Space.WORLD);
      s.parent = this.naive.sun;
      this.addRandomMaterial(s);
      s.setPivotMatrix(Matrix.Translation(-9, 0, 0), false);
      s.rotate(Axis.Y, Math.PI / 2 * i * Math.random());
    }
  }

  ngAfterViewInit(): void {
    this.naive.animate(true);
  }

  colorTOVec = ([r, g, b]) => new Color3(r, g, b);

  addRandomMaterial(mesh: Mesh) {
    const sphereMaterial = new StandardMaterial('ranMat' + Math.random(), this.naive.getScene());
    sphereMaterial.diffuseColor = this.colorTOVec([Math.random(), Math.random(), Math.random()]).scale(0.5);
    mesh.material = sphereMaterial;
  }
}
