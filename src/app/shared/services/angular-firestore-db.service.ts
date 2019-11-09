import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable, AsyncSubject, Subject, Subscription } from 'rxjs';
import { MATS } from '../models/MATS';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserDoc, UniqueNameDoc } from '../models/account';
import { User } from 'firebase';
import { Comment } from '../models/comment';

const enum collectionName {
  USERS = 'users/',
  UNIQUE_NAMES = 'unique_names/',
  COMMENTS = 'comments/',
  MATSS = '/matss/'
}

@Injectable({
  providedIn: 'root'
})
export class AngularFirestoreDbService {
  private filmsCollection: AngularFirestoreCollection<MATS>;
  private commentsCollection: AngularFirestoreCollection<Comment>;
  private filmDoc: AngularFirestoreDocument<MATS>;
  private commentDoc: AngularFirestoreDocument<Comment>;
  private usersCollection: AngularFirestoreCollection<UserDoc>;
  private uniqueNameCollection: AngularFirestoreCollection<UniqueNameDoc>;
  private userDocId: string;

  private usersCollectionSub = new AsyncSubject<void>();
  private uniqueNameCollectionSub = new AsyncSubject<void>();
  private filmsCollectionSub = new AsyncSubject<void>();
  private commentsCollectionSub = new AsyncSubject<void>();
  private sub: Subscription;

  // public userName = '';
  private userNameSub = new AsyncSubject<string>();


  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {}

  private startApp(userName: string) {
    this.userNameSub.next(userName);
    this.userNameSub.complete();
    this.getFilmsCollection();
    this.getCommentsCollection();
  }

  get userName(): Observable<string> {
    return this.userNameSub.asObservable();
  }

  createUserCollection(val: User, name: string) {
    this.getUsersCollection();
    const id = this.db.createId();
    const user: UserDoc = {
      id: id,
      user_id: val.uid,
      name: name
    };
    this.usersCollectionSub.subscribe(() => {
      this.usersCollection.doc<UserDoc>(id).set(user);
      this.createUniqueNameCollection(name);
      this.userDocId = id;
      this.startApp(name);
    });
  }

  getUsersCollection() {
    this.usersCollection = this.db.collection<UserDoc>(collectionName.USERS);
    const _that = this;
    this.auth.user.subscribe(function(user) {
      _that.usersCollection.valueChanges().subscribe(function(val) {
        // console.log('getUsersCollection', val);
        if (val.length) {
          const filterUser = val.filter(el => el.user_id === user.uid)[0];
          _that.userDocId = filterUser.id;
          _that.startApp(filterUser.name);
        }
        this.complete();
        _that.usersCollectionSub.next(null);
        _that.usersCollectionSub.complete();
      });
      this.complete();
    });
  }

  private getFilmsCollection() {
    this.filmsCollection = this.db.collection<MATS>(
      collectionName.USERS + this.userDocId + collectionName.MATSS
    );
    this.filmsCollectionSub.next(null);
    this.filmsCollectionSub.complete();
  }

  private getCommentsCollection() {
    this.commentsCollection = this.db.collection<Comment>(
      collectionName.COMMENTS
    );
    this.commentsCollectionSub.next(null);
    this.commentsCollectionSub.complete();
  }

  // dostęp bez autentykacji
  private createUniqueNameCollection(name: string) {
    this.getUniqueNamesCollection();
    const id = this.db.createId();
    const uniqueName: UniqueNameDoc = {
      id: id,
      name: name
    };
    this.uniqueNameCollectionSub.subscribe(() => {
      this.uniqueNameCollection.doc<UniqueNameDoc>(id).set(uniqueName);
    });
  }

  private getUniqueNamesCollection() {
    this.uniqueNameCollection = this.db.collection<UniqueNameDoc>(
      collectionName.UNIQUE_NAMES
    );
    this.uniqueNameCollectionSub.next(null);
    this.uniqueNameCollectionSub.complete();
  }

  getUniqueNames(): Observable<string[]> {
    const sub = new AsyncSubject<string[]>();
    const _that = this;
    this.getUniqueNamesCollection();
    this.uniqueNameCollectionSub.subscribe(function() {
      _that.uniqueNameCollection.valueChanges().subscribe(function(names) {
        sub.next(names.map(val => val.name));
        sub.complete();
        // this.complete();
      });
      this.complete();
    });

    return sub.asObservable();
  }
  // do tąd

  addMATS(film: MATS): Observable<void> {
    const sub = new AsyncSubject<void>();
    const _that = this;
    this.auth.user.subscribe(
      function(user) {
        const filmId = _that.db.createId();
        const filmObj: MATS = film;
        filmObj.id = filmId;
        _that.filmsCollectionSub.subscribe(() => {
          _that.filmsCollection.doc(filmId).set(filmObj);
          sub.next(null);
          sub.complete();
        });
        this.complete();
      },
      function(error) {
        sub.error(error);
        sub.complete();
      }
    );

    return sub.asObservable();
  }

  getMATSs(): Observable<MATS[]> {
    const sub = new Subject<MATS[]>();
    const _that = this;
    let filmCollectionSub$;
    const userSub$ = this.auth.user.subscribe(
      function(user) {
        // console.log('Service: user', userSub$.closed);
        _that.filmsCollectionSub.subscribe(() => {
          filmCollectionSub$ = _that.filmsCollection.valueChanges().subscribe(
            function(films) {
              // console.log('Service: filmCollection', filmCollectionSub$.closed);
              sub.next(films);
              this.complete();
            },
            function(error) {
              sub.error(error);
            }
          );
          _that.sub = filmCollectionSub$;
          this.complete();
        });
        this.complete();
      },
      function(error) {
        sub.error(error);
      }
    );
    // console.log('filmCollectionSub$', userSub$);
    // console.log('userSub$', userSub$);

    return sub.asObservable();
  }

  unsubscribeMATSsCollection() {
    this.sub.unsubscribe();
  }

  updateMATS(mats: MATS): Observable<void> {
    const sub = new AsyncSubject<void>();
    this.filmsCollectionSub.subscribe(() => {
      this.filmDoc = this.db.doc<MATS>(
        collectionName.USERS + this.userDocId + collectionName.MATSS + mats.id
      );

      this.filmDoc
        .update(mats)
        .then(function(result) {
          sub.next(null);
          sub.complete();
        })
        .catch(function(error) {
          sub.next(error);
          sub.complete();
        });
    });
    return sub.asObservable();
  }

  deleteMATS(mats: MATS) {
    this.filmsCollectionSub.subscribe(() => {
      this.filmDoc = this.db.doc<MATS>(
        collectionName.USERS + this.userDocId + collectionName.MATSS + mats.id
      );
      this.filmDoc.delete();
    });
  }

  addComment(comment: Comment): Observable<void> {
    this.getCommentsCollection();
    const sub = new AsyncSubject<void>();
    const _that = this;
    this.auth.user.subscribe(
      function(user) {
        const commentId = _that.db.createId();
        const commentObj: Comment = {
          id: commentId,
          user_name: comment.user_name,
          user_id: comment.user_id,
          message: comment.message,
          mats_id: comment.mats_id,
          mats_type: comment.mats_type,
          date: comment.date
        };
        _that.commentsCollectionSub.subscribe(() => {
          _that.commentsCollection.doc(commentId).set(commentObj);
          sub.next(null);
          sub.complete();
        });
        this.complete();
      },
      function(error) {
        sub.error(error);
        sub.complete();
      }
    );

    return sub.asObservable();
  }

  getComments(): Observable<Comment[]> {
    this.getCommentsCollection();
    const sub = new Subject<Comment[]>();
    const _that = this;
    let commentCollectionSub$;
    const userSub$ = this.auth.user.subscribe(
      function(user) {
        // console.log('Service: user', userSub$.closed);
        _that.commentsCollectionSub.subscribe(() => {
          commentCollectionSub$ = _that.commentsCollection.valueChanges().subscribe(
            function(comments) {
              // console.log('Service: filmCollection', filmCollectionSub$.closed);
              sub.next(comments);
              this.complete();
            },
            function(error) {
              sub.error(error);
            }
          );
          _that.sub = commentCollectionSub$;
          this.complete();
        });
        this.complete();
      },
      function(error) {
        sub.error(error);
      }
    );
    // console.log('filmCollectionSub$', userSub$);
    // console.log('userSub$', userSub$);

    return sub.asObservable();
  }

  // no use method
  // updateComment(comment: Comment): Observable<void> {
  //   const sub = new AsyncSubject<void>();
  //   this.commentsCollectionSub.subscribe(() => {
  //     this.commentDoc = this.db.doc<Comment>(
  //       collectionName.COMMENTS + comment.id
  //     );

  //     this.commentDoc
  //       .update(comment)
  //       .then(function(result) {
  //         sub.next(null);
  //         sub.complete();
  //       })
  //       .catch(function(error) {
  //         sub.next(error);
  //         sub.complete();
  //       });
  //   });
  //   return sub.asObservable();
  // }

  // no use method
  // deleteComment(comment: Comment) {
  //   this.commentsCollectionSub.subscribe(() => {
  //     this.commentDoc = this.db.doc<Comment>(
  //       collectionName.COMMENTS + comment.id
  //     );
  //     this.commentDoc.delete();
  //   });
  // }
}
