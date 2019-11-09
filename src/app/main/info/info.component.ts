import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpTheMovieDBService } from 'src/app/shared/services/http-the-movie-db.service';
import { InfoParamEnum, TypeEnum } from 'src/app/shared/models/enums';
import { Season } from 'src/app/shared/models/MATSfromDB';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { SharedData } from 'src/app/shared/data/shared-data';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  param = {
    type: '',
    id: null
  };

  poster = {
    backdrop: '',
    main: '',
    seasons: []
  };
  type = '';

  rate = 0;

  info: any = {};

  constructor(
    private route: ActivatedRoute,
    private httpTheMovieDB: HttpTheMovieDBService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(val => {
      console.log(val);
      this.clearProperties();
      this.param.type = val[InfoParamEnum.TYPE];
      this.param.id = val[InfoParamEnum.ID];

      console.log('info init', this.param);

      const _that = this;
      this.getMATS().subscribe(function(mats) {
        console.log('getMATS by id', mats);
        _that.info = mats;
        _that.getPosterURL(
          _that.info.poster_path,
          _that.info.backdrop_path,
          _that.info.seasons
        );
        this.complete();
      });
    });
  }

  rateChange() {
    console.log('rateChange', this.rate);
    const type =
      this.param.type === TypeEnum.MOVIE ? TypeEnum.MOVIE : TypeEnum.TV;
    this.httpTheMovieDB.deleteRatingMATS(this.param.id, type).subscribe(val => {
      this.httpTheMovieDB
        .setRatingMATS(this.param.id, this.rate, type)
        .subscribe(val2 => {
          console.log('setRatingMATS', val2);
          this.snackBar.open('Succes rate', '', SharedData.snackBarDuration1);
        });
    });
  }

  rateHover() {}
  rateLeave() {}

  isMovie() {
    return this.type === TypeEnum.MOVIE;
  }

  private getMATS(): Observable<any> {
    if (this.param.type === TypeEnum.MOVIE) {
      this.type = TypeEnum.MOVIE;
      return this.httpTheMovieDB.getMATSById(this.param.id, TypeEnum.MOVIE);
    } else {
      this.type = TypeEnum.TV;
      return this.httpTheMovieDB.getMATSById(this.param.id, TypeEnum.TV);
    }
  }

  private getPosterURL(poster: string, backdrop: string, seasons?: Season[]) {
    this.poster.main = this.httpTheMovieDB.getPosterURL(poster);
    this.poster.backdrop = this.httpTheMovieDB.getPosterURL(backdrop);

    if (seasons) {
      seasons.forEach(val => {
        if (val.poster_path) {
          this.poster.seasons.push({
            season_poster: this.httpTheMovieDB.getPosterURL(val.poster_path),
            season_number: val.season_number
          });
        }
      });
    }
  }

  moreSeassonInfo(seasonNumber: number) {
    // this.router.navigate(['/info', this.param.type, seriesId]);
  }

  private clearProperties() {
    this.param = {
      type: '',
      id: null
    };
    this.poster = {
      backdrop: '',
      main: '',
      seasons: []
    };
    this.type = '';
    this.rate = 0;
    this.info = {};
  }
}
