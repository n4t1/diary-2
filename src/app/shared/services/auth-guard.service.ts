import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route
} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { HttpTheMovieDBService } from './http-the-movie-db.service';
import { AngularFirestoreDbService } from './angular-firestore-db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private dbService: AngularFirestoreDbService,
    private httpTheMovieDB: HttpTheMovieDBService
  ) {
    console.log('hello AuthGuardService');
    // console.log(this.islogin);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Check if user exist, next navigate to main
    const _that = this;
    return this.fireAuth.user.pipe(
      map(function(user) {
        if (user) {
          // console.log('authGuard can');
          _that.dbService.getUsersCollection();
          return true;
        }
        // console.log('authGuard no');
        _that.router.navigate(['login']);
        return false;
      }),
      first()
    );
  }
  // canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   return this.canActivate(childRoute, state);
  // }

  // canLoad(route: Route): boolean {
  //   if (this.auth.user) {
  //     return true;
  //   }
  //   this.router.navigate(['login']);
  //   return false;
  // }
}
