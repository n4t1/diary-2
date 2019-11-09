import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpTheMovieDBService } from '../../shared/services/http-the-movie-db.service';
import { MATS } from '../../shared/models/MATS';
import { MatSnackBar } from '@angular/material';
import { Season, Movie, Serie } from 'src/app/shared/models/MATSfromDB';
import { MATSService } from 'src/app/shared/services/MATS.service';
import { TypeEnum, StatusEnum } from 'src/app/shared/models/enums';
import { SharedData } from 'src/app/shared/data/shared-data';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {

  addForm: FormGroup;
  titleResults: Array<any>;
  seriesSeasons = [];
  seriesSeasonEpisodes = 0;
  seriesSeasonName = '';
  mainPoster: string;
  seasonPoster: string;

  private itsMovieStat: boolean;
  private addMovieOrSeriesId: number;

  typeEnum = TypeEnum;
  statusEnum = StatusEnum;

  constructor(
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private matssService: MATSService,
    private httpTheMovieDB: HttpTheMovieDBService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.addForm = new FormGroup({
      status: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      seasons: new FormControl(null, [Validators.required]),
      episodes: new FormControl(null, [Validators.required]),
      // score: new FormControl({value: null}),
    });

    this.getType();
  }

  get status() { return this.addForm.get('status'); }
  get type() { return this.addForm.get('type'); }
  get title() { return this.addForm.get('title'); }
  get seasons() { return this.addForm.get('seasons'); }
  get episodes() { return this.addForm.get('episodes'); }

  onSubmit() {
    const film: MATS = {
      status: this.status.value,
      type: this.type.value,
      title: this.title.value,
      user_episode: this.episodes.value,
      user_season: this.seasons.value ? this.seriesSeasonName : null,
      mats_id: this.addMovieOrSeriesId,
      poster: this.mainPoster,
      season_poster: this.seasonPoster ? this.seasonPoster : null,
      episodes: this.seriesSeasonEpisodes
    };
    this.dialogRef.close();
    const _that = this;
    this.matssService.updateMATSs(film);
    // this.db.addMATS(film).subscribe(function() {
      // console.log('addFilm(film).subscribe pomyslnie');
      _that.snackBar.open(
          'Add ' + film.type + ': ' + film.title,
          '',
          SharedData.snackBarDuration1
        );
      // this.complete();
    // },
    // function(error) {
    //   console.log('addFilm(film).subscribe error', error);
    // });
  }

  private getType() {
    this.type.valueChanges.subscribe(val => {
      this.itsMovieOrSeriesType(val);
    });
  }

  private itsMovieOrSeriesType(type: TypeEnum) {
    if (type === TypeEnum.MOVIE) {
      this.episodes.disable();
      this.episodes.setValue(1);
      this.seasons.disable();
      this.seasons.setValue(1);
      this.seriesSeasonEpisodes = 1;

      this.itsMovieStat = true;
    } else {
      this.episodes.enable();
      this.episodes.setValue(null);
      this.seasons.enable();
      this.seasons.setValue(null);

      this.itsMovieStat = false;
    }
    this.searchMovieAndSeriesByQuery();
  }

  private searchMovieDb(titleVal: string) {
    this.httpTheMovieDB.getMATSByQuery(titleVal, TypeEnum.MOVIE).subscribe(val => {
      this.titleResults = val.results;
      // console.log(this.titleResults);
    });
    // this.theMovieDB.searchMovieDb(titleVal);
    // console.log('Title results:');
    // console.log(this.titleResults);
  }

  private searchSeriesDb(titleVal: string) {
    this.httpTheMovieDB.getMATSByQuery(titleVal, TypeEnum.TV).subscribe(val => {
      this.titleResults = val.results;
      // console.log(this.titleResults);
    });
  }

  searchMovieAndSeriesByQuery() {
    const titleVal: string = this.title.value;
    this.titleResults = [];
    this.seriesSeasons = [];

    if (titleVal) {
      switch (this.itsMovieStat) {
        case true:
          this.searchMovieDb(titleVal);
          break;
        case false:
          this.searchSeriesDb(titleVal);
          break;
      }
    }
  }

  getPosterURL(posterPath: string) {
    return this.httpTheMovieDB.getPosterURL(posterPath);
  }

  getSeriesById() {
    if (!this.itsMovieStat) {
      this.httpTheMovieDB.getMATSById(this.addMovieOrSeriesId + '', TypeEnum.TV).subscribe(val => {
        this.seriesSeasons = val.seasons;
        // console.log('Seasons');
        console.log(this.seriesSeasons);
      });
    }
  }

  getMATS(mats: Movie | Serie) {
    // console.log(mats);

    this.addMovieOrSeriesId = mats.id;
    this.mainPoster = mats.poster_path;
    this.getSeriesById();
  }

  getSeason(season: Season) {
    // console.log(season);
    this.seriesSeasonEpisodes = season.episode_count;
    this.seriesSeasonName = season.name;
    this.seasonPoster = season.poster_path;
  }

  getTitle(event: {type: TypeEnum, id: string}) {
    console.log(event);
    this.itsMovieOrSeriesType(event.type);
  }
}
