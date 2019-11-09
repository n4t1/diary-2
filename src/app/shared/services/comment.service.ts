import { Injectable } from '@angular/core';
import { AngularFirestoreDbService } from './angular-firestore-db.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentSub = new BehaviorSubject<Comment[]>([]);

  constructor(private db: AngularFirestoreDbService) {}

  updateComments(value: Comment) {
    const val = this.getComments();
    const findTheSamegetComment: number = this.findIndex(val, value);
    if (findTheSamegetComment < 0) {
      val.push(value);
      this.db.addComment(value);
    } else {
      val.splice(findTheSamegetComment, 1, value);
      // this.db.updateComment(value);
    }

    this.setCommentSub(val);

    // this.db.updateComment(value);
  }

  deleteComments(value: Comment) {
    const val = this.getComments();
    const findComment = this.findIndex(val, value);

    val.splice(findComment, 1);

    this.setCommentSub(val);

    // this.db.deleteComment(value);
  }

  getComments(): Comment[] {
    return this.commentSub.getValue();
  }

  getCommentsSub(): Observable<Comment[]> {
    return this.commentSub.asObservable();
  }

  createComments() {
    const _that = this;
    this.db.getComments().subscribe(function(val) {
      _that.setCommentSub(val);
      this.complete();
    });
  }

  private setCommentSub(comment: Comment[]) {
    this.commentSub.next(comment);
  }

  private findIndex(searchArr: Comment[], find: Comment) {
    return searchArr.findIndex(el => el.id === find.id);
  }

}
