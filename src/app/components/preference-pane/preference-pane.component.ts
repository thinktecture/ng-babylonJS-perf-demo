import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PreferenceService} from '../../services/preference.service';
import {debounceTime, distinctUntilChanged, take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AsteroidConfiguration, MeshConfiguration} from '../../models';

@Component({
  selector: 'app-preference-pane',
  templateUrl: './preference-pane.component.html',
  styleUrls: ['./preference-pane.component.scss']
})
export class PreferencePaneComponent implements OnInit, OnDestroy {

  meshForm: FormGroup;
  asteroidForm: FormGroup;
  zoneControl: FormControl = new FormControl(true);
  materialControl: FormControl = new FormControl(true);

  private readonly destroy = new Subject<boolean>();

  constructor(private readonly fb: FormBuilder, private readonly preference: PreferenceService) {
  }

  ngOnInit() {
    this.meshForm = this.fb.group({
      freeze: null,
      merge: null,
      index: null,
      flat: null,
      normals: null,
      edge: null,
      boundings: null,
      batch: null,
    });

    this.asteroidForm = this.fb.group({
      amount: null,
      segments: null,
    });

    this.preference.meshConfig.pipe(take(1)).subscribe(x => this.meshForm.patchValue(x));
    this.preference.asteroidConfig.pipe(take(1)).subscribe(x => this.asteroidForm.patchValue(x));
    this.preference.useNgZone.pipe(take(1)).subscribe(x => this.zoneControl.patchValue(x));
    this.preference.materialConfig.pipe(take(1)).subscribe(x => this.materialControl.patchValue(x));

    this.meshForm.valueChanges.pipe(takeUntil(this.destroy), debounceTime(500), distinctUntilChanged())
      .subscribe((x: MeshConfiguration) => this.preference.meshConfig.next(x));
    this.asteroidForm.valueChanges.pipe(takeUntil(this.destroy), debounceTime(500), distinctUntilChanged())
      .subscribe((x: AsteroidConfiguration) => this.preference.asteroidConfig.next(x));
    this.zoneControl.valueChanges.pipe(takeUntil(this.destroy), debounceTime(500), distinctUntilChanged())
      .subscribe((x: boolean) => this.preference.useNgZone.next(x));
    this.materialControl.valueChanges.pipe(takeUntil(this.destroy), debounceTime(500), distinctUntilChanged())
      .subscribe((freeze: boolean) => this.preference.materialConfig.next({freeze}));
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }

    return value;
  }

}
