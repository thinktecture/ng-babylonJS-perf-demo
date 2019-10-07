import {ElementRef, Injectable, NgZone} from '@angular/core';
import {BasicRenderServiceAbstract} from './basic-render-service.abstract';
import {Color3, Mesh, MeshBuilder, PointLight, Scene, Space, StandardMaterial, Vector3} from '@babylonjs/core';


@Injectable({
  providedIn: 'root'
})
export class NaiveService extends BasicRenderServiceAbstract {

  sun: Mesh;

  constructor(readonly zone: NgZone) {
    super(zone);
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): Scene {
    super.createScene(canvas);

    this.light.dispose();
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

  getScene(): Scene {
    return this.scene;
  }
}
