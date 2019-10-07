import {ElementRef, Injectable, NgZone} from '@angular/core';
import {BasicRenderServiceAbstract} from './basic-render-service.abstract';
import {Color3, MeshBuilder, PointLight, Space, StandardMaterial, Vector3} from '@babylonjs/core';


@Injectable({
  providedIn: 'root'
})
export class NaiveService extends BasicRenderServiceAbstract {

  constructor(readonly zone: NgZone) {
    super(zone);
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    super.createScene(canvas);

    this.light.dispose();
    this.light = new PointLight('sun', new Vector3(0, 5, 0), this.scene);

    const sun = MeshBuilder.CreateSphere('s1', {segments: 32, diameter: 2});
    sun.position.y = 5;

    const sphereMaterial = new StandardMaterial('sun_surface', this.scene);
    sphereMaterial.emissiveColor = new Color3(1, 1, 0);
    sun.material = sphereMaterial;

    const sphere = MeshBuilder.CreateSphere('s2', {segments: 32, diameter: 2});


    this.scene.registerAfterRender(() => {
      sphere.rotate(
        new Vector3(0, 1, 0),
        0.02,
        Space.LOCAL
      );
    });
  }
}
