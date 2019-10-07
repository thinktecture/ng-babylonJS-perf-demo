import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NaiveService} from '../../services/naive.service';

@Component({
  selector: 'app-naive',
  templateUrl: './naive.component.html',
  styleUrls: ['./naive.component.scss']
})
export class NaiveComponent implements OnInit {

  @ViewChild('rCanvas', {static: true})
  canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private readonly naive: NaiveService) {
  }

  ngOnInit() {
    this.naive.createScene(this.canvasRef);
    this.naive.animate();
  }

}
