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

  readonly rotationAnim = new Animation('rotate', 'rotation.y', FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
  readonly wobbleAnim = new Animation('wobble', 'position.y', FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_RELATIVE);
  readonly rotationKeys = [
    {frame: 0, value: 0},
    {frame: FPS / 2, value: Math.PI},
    {frame: FPS, value: Math.PI * 2},
  ];
  readonly wobbleKeys = [
    {frame: 0, value: -1},
    {frame: FPS / 4, value: 0},
    {frame: FPS * 2 / 4, value: 1},
    {frame: FPS * 3 / 4, value: 0},
    {frame: FPS, value: -1},
  ];

  constructor(private readonly naive: NaiveService) {
  }

  ngOnInit() {
    this.rotationAnim.setKeys(this.rotationKeys);
    this.wobbleAnim.setKeys(this.wobbleKeys);
    const scene = this.naive.createScene(this.canvasRef);

    scene.beginAnimation(this.createPlanetInSystem('mercury', .3, 4), 0, FPS, true, 0.25);
    scene.beginAnimation(this.createPlanetInSystem('venus', .4, 5, [.9, .9, 0]), 0, FPS, true, 0.2);
    scene.beginAnimation(this.createPlanetInSystem('earth', .6, 6.1, [0, 0, 1]), 0, FPS, true, 0.12);
    scene.beginAnimation(this.createPlanetInSystem('mars', .5, 7.3, [1, 0, 0]), 0, FPS, true, 0.1);
    scene.beginAnimation(this.createPlanetInSystem('jupyter', 1.3, 10.5, [.95, .95, .85]), 0, FPS, true, 0.05);

    // asteroids
    scene.blockfreeActiveMeshesAndRenderingGroups = false;
    for (let i = 0; i < 1000; i++) {
      const s = MeshBuilder.CreateSphere(`sphere${i}`, {segments: 1, diameter: .1}, scene);
      s.translate(Axis.Y, Math.random() * 1.3 - 1, Space.WORLD);
      s.translate(Axis.X, Math.random(), Space.WORLD);
      s.parent = this.naive.sun;
      this.addRandomMaterial(s);
      s.setPivotMatrix(Matrix.Translation(-9, 0, 0), false);
      s.rotate(Axis.Y, Math.PI / 2 * i * Math.random());
      s.beginAnimation(this.rotationAnim.name, true);
    }
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    scene.freezeActiveMeshes();
  }

  createPlanetInSystem(name, diameter, distance, color?: [number, number, number]) {


    const offY = -1 + Math.random();
    const mesh = MeshBuilder.CreateSphere(name, {diameter, segments: 16}, this.naive.getScene());
    mesh.parent = this.naive.sun;
    mesh.setPivotMatrix(Matrix.Translation(distance, -offY, 0), false);
    mesh.rotation.y = Math.PI * Math.random();
    mesh.animations = [];
    mesh.animations.push(this.rotationAnim);
    mesh.animations.push(this.wobbleAnim);
    if (color) {
      const sphereMaterial = new StandardMaterial(name, this.naive.getScene());
      sphereMaterial.diffuseColor = this.colorTOVec(color);
      mesh.material = sphereMaterial;
    }
    return mesh;
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
