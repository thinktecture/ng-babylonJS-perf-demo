import {ElementRef, Injectable, NgZone} from '@angular/core';
import {BasicRenderServiceAbstract} from './basic-render-service.abstract';
import {
  Animation,
  Axis,
  Color3,
  InstancedMesh,
  Matrix,
  Mesh,
  MeshBuilder,
  PointLight,
  Scene,
  Space,
  StandardMaterial,
  Vector3
} from '@babylonjs/core';

const FPS = 60;

@Injectable({
  providedIn: 'root'
})
export class NaiveService extends BasicRenderServiceAbstract {

  sun: Mesh;

  readonly rotationAnim = new Animation('rotate', 'rotation.y', FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
  readonly wobbleAnim = new Animation('wobble', 'position.y', FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_RELATIVE);
  readonly rotationKeys = [
    {frame: 0, value: 0},
    {frame: FPS / 2, value: Math.PI},
    {frame: FPS, value: Math.PI * 2},
  ];
  readonly wobbleKeys = [
    {frame: 0, value: -1},
    {frame: FPS * .5, value: 1},
    {frame: FPS, value: -1},
  ];

  constructor(readonly zone: NgZone) {
    super(zone);
    this.rotationAnim.setKeys(this.rotationKeys);
    this.wobbleAnim.setKeys(this.wobbleKeys);
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): Scene {

    if (this.scene) {
      this.scene.dispose();
    }

    super.createScene(canvas);

    // this.light.dispose();
    this.light = new PointLight('sun', new Vector3(0, 0, 0), this.scene);
    this.sun = MeshBuilder.CreateSphere('s1', {segments: 32, diameter: 2});
    const sphereMaterial = new StandardMaterial('sun_surface', this.scene);
    sphereMaterial.emissiveColor = new Color3(1, 0.8, 0);
    this.sun.material = sphereMaterial;

    this.scene.registerAfterRender(() => {
      this.sun.rotate(
        new Vector3(0.3, 1, 0),
        0.0007,
        Space.LOCAL
      );
    });

    return this.scene;
  }

  createPlanetInSystem(name, diameter, distance, color: [number, number, number]) {
    const offY = -1 + Math.random();
    const mesh = MeshBuilder.CreateSphere(name, {diameter, segments: 16}, this.scene);
    mesh.parent = this.sun;
    mesh.setPivotMatrix(Matrix.Translation(distance, -offY, 0), false);
    mesh.rotation.y = Math.PI * Math.random();
    mesh.animations = [];
    mesh.animations.push(this.rotationAnim);
    mesh.animations.push(this.wobbleAnim);
    if (color) {
      const sphereMaterial = new StandardMaterial(name, this.scene);
      sphereMaterial.diffuseColor = new Color3(color[0], color[1], color[2]);
      mesh.material = sphereMaterial;
    }
    return mesh;
  }

  addRandomMaterial(mesh: Mesh) {
    const sphereMaterial = new StandardMaterial('ranMat' + Math.random(), this.scene);
    sphereMaterial.diffuseColor = new Color3(Math.random(), Math.random(), Math.random()).scale(.5);
    mesh.material = sphereMaterial;
  }

  makeAsteroid(mesh: Mesh | InstancedMesh, nth: number) {
    mesh.scaling = new Vector3(0.1, 0.1, 0.1);
    mesh.translate(Axis.Y, Math.random() * 1.3 - 1, Space.WORLD);
    mesh.translate(Axis.X, Math.random(), Space.WORLD);
    mesh.parent = this.sun;
    mesh.setPivotMatrix(Matrix.Translation(-90, 0, 0), false);
    mesh.rotate(Axis.Y, Math.PI / 2 * nth * Math.random());
  }
}
