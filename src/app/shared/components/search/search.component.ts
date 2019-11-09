import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { HttpTheMovieDBService } from '../../services/http-the-movie-db.service';
import { TypeEnum } from '../../models/enums';
import { debounceTime, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string;
  @Output() value = new EventEmitter<any>();

  titleResults: Array<any>;
  title = '';
  spinner = false;

  @ViewChild('input') input: ElementRef;

  constructor(
    private httpTheMovieDB: HttpTheMovieDBService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = this.translate.translate('TOOLBAR.SEARCH');
    }
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(500))
      .subscribe(() => {
          this.spinner = true;
          this.searchMovieAndSeriesByQuery();
      });
  }

  searchMovieAndSeriesByQuery() {
    const titleVal: string = this.title;
    this.titleResults = [];

    if (titleVal.length > 2) {
      this.httpTheMovieDB
        .getMATSByQuery(titleVal, TypeEnum.MULTI)
        .pipe(
          map(val =>
            val.results.filter(
              el =>
                el.media_type === TypeEnum.TV ||
                el.media_type === TypeEnum.MOVIE
            )
          )
        )
        .subscribe(val => {
          this.titleResults = [
            {
              group: TypeEnum.TV,
              value: val.filter(el => el.media_type === TypeEnum.TV)
            }
          ];
          this.titleResults.push({
            group: TypeEnum.MOVIE,
            value: val.filter(el => el.media_type === TypeEnum.MOVIE)
          });
          this.spinner = false;
        });
    }
  }

  getPosterURL(posterPath: string) {
    return this.httpTheMovieDB.getPosterURL(posterPath);
  }

  moreMATSInfo(mats: any) {
    this.title = '';
    this.router.navigate(['/info', mats.media_type, mats.id]);
    // this.value.next({type: mats.media_type, id: mats.id});
  }
}
