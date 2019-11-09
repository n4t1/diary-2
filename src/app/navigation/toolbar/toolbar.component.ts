import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '@firebase/auth-types';
import { MatSnackBar } from '@angular/material';
import { SharedData } from 'src/app/shared/data/shared-data';
import { HttpTheMovieDBService } from 'src/app/shared/services/http-the-movie-db.service';
import { AngularFirestoreDbService } from 'src/app/shared/services/angular-firestore-db.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  // @Input() sidenav: SidenavComponent;
  islogin = false;
  userName = null;

  private snackBarDuration1 = { duration: 1000 };

  constructor(
    private auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private router: Router,
    private httpTheMovieDB: HttpTheMovieDBService,
    private dbService: AngularFirestoreDbService
  ) {}

  ngOnInit() {
    this.checkUserExist();
  }

  // sidenavOpen() {
  //   this.sidenav.sidenavOpen();
  // }

  logout() {
    this.auth.auth.signOut().then(() => {
      this.snackBar.open('Success logged out', '', SharedData.snackBarDuration1);
      this.router.navigate(['login']);
    });
    this.httpTheMovieDB.deleteSession();
  }

  navigateToMain() {
    this.router.navigate(['main']);
  }

  private checkUserExist() {
    this.auth.user.subscribe((result: User | null) => {
      console.log('ToolbarComponent checkUserExist', result);
      if (result) {
        this.islogin = true;
        this.dbService.userName.subscribe(val => {
          this.userName = val;
        });
        this.httpTheMovieDB.setGuestSession();
      } else {
        this.islogin = false;
        this.userName = null;
      }
    });
  }
}
