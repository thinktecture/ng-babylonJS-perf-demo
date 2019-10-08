import {Injectable} from '@angular/core';
import {AsteroidConfiguration, MaterialConfiguration, MeshConfiguration} from '../models';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  readonly meshConfig = new BehaviorSubject<MeshConfiguration>({
    freeze: true,
    merge: true,
    index: true,
    flat: true,
    normals: true,
    edge: true,
    boundings: true,
    batch: true,
  });
  readonly asteroidConfig = new BehaviorSubject<AsteroidConfiguration>({amount: 4000, segments: 2});
  readonly useNgZone = new BehaviorSubject<boolean>(true);
  readonly materialConfig = new BehaviorSubject<MaterialConfiguration>({freeze: true});
}
