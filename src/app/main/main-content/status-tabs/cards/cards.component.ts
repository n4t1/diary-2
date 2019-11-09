import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MATS } from 'src/app/shared/models/MATS';
import { WindowResizeService } from 'src/app/shared/services/windowResize.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {
  @Input()
  set MATSs(val: Array<MATS>) {
    this._MATSs = val;
    this.spinner = false;
  }
  get MATSs() {
    return this._MATSs;
  }

  spinner = true;
  smallWindow: boolean = null;

  private _MATSs: Array<MATS>;
  private sub: Subscription;

  constructor(private windowResize: WindowResizeService) {}

  ngOnInit() {
    this.spinner = !this.MATSs.length;
    this.sub = this.windowResize.innerWidth.subscribe(window => {
      this.smallWindow = window;
      // if (this.cardTitle.length > 14) {
      // this.cardTitle = this.cardTitle.slice(0, 11) + '...';
      // }
      // console.log('CHANGE');

      // this.cardTitle = this.MATS.title;
      // this.basicTitle = '';
    });
  }

  ngOnDestroy() {}
}
