import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  message$ = new ReplaySubject<string>(1);
}
