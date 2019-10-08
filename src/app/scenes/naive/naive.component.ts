import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {NaiveService} from '../../services/naive.service';
import {MeshBuilder, Scene} from '@babylonjs/core';

const FPS = 60;

@Component({
  selector: 'app-naive',
  templateUrl: './naive.component.html',
  styleUrls: ['./naive.component.scss']
})
export class NaiveComponent implements AfterViewInit, OnDestroy {

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(protected readonly naive: NaiveService) {
  }

  initScene() {
    const scene = this.naive.createScene(this.canvasRef);
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    this.addPlanets(scene);
    this.addAsteroids(scene);
    scene.blockfreeActiveMeshesAndRenderingGroups = false;

  }

  ngAfterViewInit(): void {
    this.initScene();
    this.naive.start(true);
  }

  ngOnDestroy(): void {
    this.naive.stop();
  }

  addAsteroids(scene: Scene) {
    for (let i = 0; i < 4000; i++) {
      const s = MeshBuilder.CreateSphere(`sphere${i}`, {segments: 1, diameter: 1}, scene);
      this.naive.addRandomMaterial(s);
      this.naive.makeAsteroid(s, i);
      s.isVisible = true;
    }
  }

  addPlanets(scene: Scene) {
    scene.beginAnimation(this.naive.createPlanetInSystem('mercury', .3, 4, [.5, .5, .5]), 0, FPS, true, 0.25);
    scene.beginAnimation(this.naive.createPlanetInSystem('venus', .4, 5, [.9, .9, 0]), 0, FPS, true, 0.2);
    scene.beginAnimation(this.naive.createPlanetInSystem('earth', .6, 6.1, [0, 0, 1]), 0, FPS, true, 0.12);
    scene.beginAnimation(this.naive.createPlanetInSystem('mars', .5, 7.3, [1, 0, 0]), 0, FPS, true, 0.1);
    scene.beginAnimation(this.naive.createPlanetInSystem('jupyter', 1.3, 10.5, [.95, .95, .85]), 0, FPS, true, 0.05);
  }
}
