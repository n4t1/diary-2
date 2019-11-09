import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/shared/services/comment.service';
import { Comment } from 'src/app/shared/models/comment';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDbService } from 'src/app/shared/services/angular-firestore-db.service';
import { TypeEnum } from 'src/app/shared/models/enums';

interface IMATSInfo {
  type: TypeEnum;
  id: number;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  private _matsInfo: IMATSInfo;
  @Input()
  get matsInfo(): IMATSInfo {
    return this._matsInfo;
  }
  set matsInfo(info: IMATSInfo) {
    this._matsInfo = info;
    if (this.usersComments.length > 0) {
      this.filterComments(this.usersComments);
    }
  }

  usersComments: Comment[] = [];
  showComments: Comment[] = [];
  newComment = '';

  constructor(
    private commentService: CommentService,
    private fireAuth: AngularFireAuth,
    private dbService: AngularFirestoreDbService
  ) {}

  ngOnInit() {
    this.commentService.createComments();
    this.commentService.getCommentsSub().subscribe(comments => {
      this.usersComments = comments;
      this.filterComments(this.usersComments);
    });
  }

  checkNewCommentLength() {
    return this.newComment.length > 0;
  }

  addComment() {
    const _that = this;
    if (this.checkNewCommentLength()) {
      this.fireAuth.user.subscribe(function(user) {
        _that.dbService.userName.subscribe(function(name) {
          const addNew: Comment = {
            message: _that.newComment,
            mats_id: _that.matsInfo.id,
            mats_type: _that.matsInfo.type,
            user_id: user.uid,
            user_name: name,
            date: new Date(Date.now()).toString()
          };
          _that.commentService.updateComments(addNew);
          _that.clearComment();
        });
        this.complete();
      });
    }
  }

  private filterComments(commnets: Comment[]) {
    this.showComments = commnets.filter(
      val =>
        val.mats_id === this.matsInfo.id &&
        val.mats_type === this.matsInfo.type
    );
  }

  private clearComment() {
    this.newComment = '';
  }
}
