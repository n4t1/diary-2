import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MATS } from '../models/MATS';
import { AngularFirestoreDbService } from './angular-firestore-db.service';

@Injectable({
  providedIn: 'root'
})
export class MATSService {
  private matsSub = new BehaviorSubject<MATS[]>([]);

  constructor(private db: AngularFirestoreDbService) {}

  updateMATSs(value: MATS) {
    const val = this.getMATSs();
    const findTheSameMATS: number = this.findIndex(val, value);
    if (findTheSameMATS < 0) {
      val.push(value);
      this.db.addMATS(value);
    } else {
      val.splice(findTheSameMATS, 1, value);
      this.db.updateMATS(value);
    }

    this.setMatsSub(val);

    // this.db.updateMATS(value);
  }

  deleteMATSs(value: MATS) {
    const val = this.getMATSs();
    const findMATS = this.findIndex(val, value);

    val.splice(findMATS, 1);

    this.setMatsSub(val);

    this.db.deleteMATS(value);
  }

  getMATSs(): MATS[] {
    return this.matsSub.getValue();
  }

  getMATSsSub(): Observable<MATS[]> {
    return this.matsSub.asObservable();
  }

  createMATSs() {
    const _that = this;
    this.db.getMATSs().subscribe(function(val) {
      _that.setMatsSub(val);
      this.complete();
    });
  }

  private setMatsSub(mats: MATS[]) {
    this.matsSub.next(mats);
  }

  private findIndex(searchArr: MATS[], find: MATS) {
    return searchArr.findIndex(el => el.id === find.id);
  }
}
