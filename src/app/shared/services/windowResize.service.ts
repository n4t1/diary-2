import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable()
export class WindowResizeService {
  smallWindowSub = new BehaviorSubject<boolean>(null);

  get innerWidth(): Observable<any> {
    return this.smallWindowSub.asObservable();
  }

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(max-width: 500px)']).subscribe(result => {
      if (result.matches) {
        this.smallWindowSub.next(true);
        // console.log('SMALLWindowSub');
      } else {
        this.smallWindowSub.next(false);
        // console.log('BIGWindowSub');

        // if necessary:
        // doSomethingElse();
      }
    });
  }
}
