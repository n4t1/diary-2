import { Component, OnInit, OnDestroy } from '@angular/core';
import { MATS } from 'src/app/shared/models/MATS';
import { AngularFirestoreDbService } from 'src/app/shared/services/angular-firestore-db.service';
import { Subscription } from 'rxjs';
import { StatusEnum } from 'src/app/shared/models/enums';
import { MATSService } from 'src/app/shared/services/MATS.service';

interface IMATS {
  all: Array<MATS>;
  watch: Array<MATS>;
  plan: Array<MATS>;
  done: Array<MATS>;
}

@Component({
  selector: 'app-status-tabs',
  templateUrl: './status-tabs.component.html',
  styleUrls: ['./status-tabs.component.scss']
})
export class StatusTabsComponent implements OnInit, OnDestroy {
  MATS: IMATS = {
    all: [],
    watch: [],
    plan: [],
    done: []
  };

  private sub$: Subscription;

  constructor(
    private db: AngularFirestoreDbService,
    private matssService: MATSService
  ) {}

  ngOnInit() {
    this.getMATSs();
  }

  ngOnDestroy(): void {
    this.db.unsubscribeMATSsCollection();
    this.sub$.unsubscribe();
  }

  private getMATSs() {
    this.matssService.createMATSs();
    this.sub$ = this.matssService.getMATSsSub().subscribe(val => {
      this.MATS.all = val;
      this.MATS.watch = val.filter(e => e.status === StatusEnum.WATCH);
      this.MATS.plan = val.filter(e => e.status === StatusEnum.PLAN);
      this.MATS.done = val.filter(e => e.status === StatusEnum.DONE);
    });
  }
}
