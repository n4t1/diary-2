import { Component, OnInit, Input } from '@angular/core';
import { MATS } from 'src/app/shared/models/MATS';
import { HttpTheMovieDBService } from 'src/app/shared/services/http-the-movie-db.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/main/confirm-dialog/confirm-dialog.component';
import { AngularFirestoreDbService } from 'src/app/shared/services/angular-firestore-db.service';
import { StatusEnum } from 'src/app/shared/models/enums';
import {
  state,
  style,
  transition,
  animate,
  trigger
} from '@angular/animations';
import { MATSService } from 'src/app/shared/services/MATS.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('showPoster', [
      state('void', style({ display: 'none' })),
      transition(':enter', [
        style({ opacity: 0, display: 'none' }),
        animate('1s ease-in-out', style({ opacity: 1 })),
        style({ opacity: 1 })
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.1s', style({ opacity: 0, display: 'none' })),
        style({ display: 'none' })
      ])
    ])
  ]
})
export class CardComponent implements OnInit {
  @Input()
  set MATS(val: MATS) {
    this._MATS = val;
    this.getPosterURL(this.MATS.poster, this.MATS.season_poster);
    this.calcProgressValue();
  }
  get MATS() {
    return this._MATS;
  }
  private _MATS: MATS = {} as MATS;

  @Input()
  set smallWindow(val: boolean) {
    this._smallWindow = val;
    this.shortTitle();
  }
  get smallWindow() {
    return this._smallWindow;
  }
  private _smallWindow: boolean = null;

  mainPosterPath = '';
  seasonPosterPath = '';
  cardTitle = '';
  basicTitle = '';

  mouseEnter = false;

  progress = 0;
  episodeButton = {
    addDisabled: false,
    removeDisabled: false
  };

  constructor(
    private httpMovieDB: HttpTheMovieDBService,
    private dialog: MatDialog,
    private matssService: MATSService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkEpisodeValue(this.MATS);
  }

  deleteFilm(): void {
    const title = this.MATS.title + ' ' + this.MATS.user_season;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { title: title, id: this.MATS.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isOK === true) {
        // this.db.deleteMATS(result.id);
        this.matssService.deleteMATSs(this.MATS);
      }
    });
  }

  setEpisode(add: boolean = null) {
    const episode = this.MATS;

    episode.user_episode = add
      ? ++episode.user_episode
      : --episode.user_episode;

    episode.status = this.checkEpisodeValue(episode);
    this.calcProgressValue();
    // this.db.updateMATS(episode);
    this.matssService.updateMATSs(episode);
  }

  mouseEnterImg() {
    // console.log('over');
    this.mouseEnter = true;
  }

  mouseLeaveImg() {
    // console.log('leave');
    this.mouseEnter = false;
  }

  moreMATSInfo() {
    console.log(this.MATS);
    this.router.navigate(['/info', this.MATS.type, this.MATS.mats_id]);
  }

  private checkEpisodeValue(episode: MATS): StatusEnum {
    if (episode.user_episode === episode.episodes) {
      this.episodeButton = {
        addDisabled: true,
        removeDisabled: false
      };
      return StatusEnum.DONE;
    } else if (episode.user_episode === 0) {
      this.episodeButton = {
        addDisabled: false,
        removeDisabled: true
      };
      return StatusEnum.PLAN;
    } else {
      this.episodeButton = {
        addDisabled: false,
        removeDisabled: false
      };
      return StatusEnum.WATCH;
    }
  }

  private calcProgressValue() {
    this.progress = (this.MATS.user_episode * 100) / this.MATS.episodes;
  }

  private getPosterURL(mainPoster: string, seasonPoster?: string) {
    this.mainPosterPath = this.httpMovieDB.getPosterURL(mainPoster);
    if (seasonPoster) {
      this.seasonPosterPath = this.httpMovieDB.getPosterURL(seasonPoster);
    }
  }

  private shortTitle() {
    // only 18 signs !!!
    this.cardTitle = this.MATS.title;
    if (!this.smallWindow && this.cardTitle.length > 15) {
      this.basicTitle = this.cardTitle;
      this.cardTitle = this.cardTitle.slice(0, 13) + '...';
      return;
    }

    if (this.smallWindow && this.cardTitle.length > 14) {
      this.basicTitle = this.cardTitle;
      this.cardTitle = this.cardTitle.slice(0, 11) + '...';
    }
  }
}
