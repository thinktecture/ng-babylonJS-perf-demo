import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SolarSystem} from '../../services/solar-system.service';
import {AbstractMesh, ActionManager, ExecuteCodeAction, MeshBuilder, Scene} from '@babylonjs/core';
import {PreferenceService} from '../../services/preference.service';
import {combineLatest, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {AsteroidConfiguration, MeshConfiguration} from '../../models';
import {LoadingService} from '../../services/loading.service';
import {InteractionService} from '../../services/interaction.service';

const FPS = 60;

@Component({
  selector: 'app-unoptimized',
  templateUrl: './unoptimized.component.html',
})
export class UnoptimizedComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  // cleanup our subscriptions
  protected readonly destroy = new Subject<boolean>();
  // store configurations for easy access
  protected asteroidConfig: AsteroidConfiguration;
  protected meshConfig: MeshConfiguration;
  // store asteroids to clean up on changes
  protected readonly asteroids: AbstractMesh[] = [];

  constructor(
    protected readonly solarSystem: SolarSystem,
    protected readonly preferences: PreferenceService,
    protected readonly loading: LoadingService,
    protected readonly interaction: InteractionService,
  ) {
  }

  ngOnInit(): void {
    this.loading.message$.next('Initialising Scene ...');
    this.initScene();

    // subscribe to the preferences and handle them accordingly
    // we don't have a need to distinguish what event fires because the path afterwards is the same
    combineLatest(this.preferences.asteroidConfig, this.preferences.meshConfig).pipe(takeUntil(this.destroy), debounceTime(400))
      .subscribe(([asteroidConfig, meshConfig]) => {
        // update config
        this.asteroidConfig = asteroidConfig;
        this.meshConfig = meshConfig;
        // change / update asteroids
        this.manageAsteroids();
      });

    this.preferences.materialConfig.pipe(takeUntil(this.destroy)).subscribe(conf => conf.freeze
      ? this.solarSystem.scene.freezeMaterials()
      : this.solarSystem.scene.unfreezeMaterials());
  }

  initScene() {
    // get the scene object
    const scene = this.solarSystem.createScene(this.canvasRef);
    // by setting blockfreeActiveMeshesAndRenderingGroups we tell the engine to
    // insert all meshes without indexing and checking them
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    this.addPlanets(scene);
    // we have to set it back to its original state
    scene.blockfreeActiveMeshesAndRenderingGroups = false;

  }

  ngAfterViewInit(): void {
    // start the engine
    // be aware that we have to setup the scene before
    this.solarSystem.start(this.preferences.useNgZone.getValue());
  }

  ngOnDestroy(): void {
    // stop the engine and clean up
    this.solarSystem.stop();
    this.destroy.next(true);
  }

  manageAsteroids() {
    this.loading.message$.next('Managing Asteroids ...');
    // unfreeze, our changes shouold be mirrored to the engine.
    this.solarSystem.scene.unfreezeActiveMeshes();
    this.solarSystem.scene.unfreezeMaterials();
    // as above, by setting blockfreeActiveMeshesAndRenderingGroups we tell the engine to
    // insert all meshes without indexing and checking them
    this.solarSystem.scene.blockfreeActiveMeshesAndRenderingGroups = this.meshConfig.batch;
    // clean the "old" asteroids, it is easier for the demo to recreate them with the
    // desired configuration than to patch every single one
    this.clearAsteroids();
    this.loading.message$.next('Adding Asteroids ...');
    // due to the possible blocking calculation a timeout is needed to display the message
    setTimeout(() => {
      this.addAsteroids(this.solarSystem.scene, this.asteroidConfig.amount);

      // by freezing the meshes and materials we can skip a lot of change observations
      // basically we tell the engine those things won't change
      if (this.preferences.materialConfig.getValue().freeze) {
        this.loading.message$.next('Freezing Materials ...');
        this.solarSystem.scene.freezeMaterials();
      }
      if (this.meshConfig.freeze) {
        this.loading.message$.next('Freezing Meshes ...');
        this.solarSystem.scene.freezeActiveMeshes(); // 5-10 fps
      }

      this.solarSystem.scene.blockfreeActiveMeshesAndRenderingGroups = false;
      this.loading.message$.next(null);
    }, 30);

  }

  clearAsteroids() {
    this.loading.message$.next('Removing Asteroids ...');
    // instruct the engine to remove this object and remove our reference too
    this.asteroids.slice().forEach((asteroid) => {
      asteroid.dispose();
      this.asteroids.pop();
    });
  }

  addAsteroids(scene: Scene, amount: number) {
    for (let i = 0; i < amount; i++) {
      const s = MeshBuilder.CreateSphere(`sphere${i}`, {segments: this.asteroidConfig.segments, diameter: 1}, scene);
      this.solarSystem.addRandomMaterial(s);
      this.solarSystem.makeAsteroid(s, i);
      this.asteroids.push(s);
      s.isVisible = true;
    }
  }

  addPlanets(scene: Scene) {
    scene.beginAnimation(this.solarSystem.createPlanetInSystem('mercury', .3, 4, [.5, .5, .5]), 0, FPS, true, 0.25);
    scene.beginAnimation(this.solarSystem.createPlanetInSystem('venus', .4, 5, [.9, .9, 0]), 0, FPS, true, 0.2);
    scene.beginAnimation(this.solarSystem.createPlanetInSystem('earth', .6, 6.1, [0, 0, 1]), 0, FPS, true, 0.12);
    scene.beginAnimation(this.solarSystem.createPlanetInSystem('mars', .5, 7.3, [1, 0, 0]), 0, FPS, true, 0.1);

    const jupyter = this.solarSystem.createPlanetInSystem('jupyter', 1.3, 10.5, [.95, .95, .85]);
    jupyter.actionManager = new ActionManager(this.solarSystem.scene);
    jupyter.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger,
      () => this.interaction.onJupyterClick.next())
    );
    scene.beginAnimation(jupyter, 0, FPS, true, 0.05);
  }
}
