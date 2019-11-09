import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  showMATS: Array<string> = [];

  constructor() { }

  ngOnInit() {
    const film = FilmBuilderDirector.make();
    this.showMATS.push(film.getValue());
  }
}

class Film {
  id: number;
  title: string;
  poster: string;

  getValue(): string {
    return this.id + ' title: ' + this.title + ' posterURL: ' + this.poster;
  }
}

class Serial {
  id: number;
  title: string;
  poster: string;
  season: number;
  episodes: number;

  getValue(): string {
    return this.id + ' title: ' + this.title + ' posterURL: ' + this.poster + ' season: ' + this.season + ' episodes: ' + this.episodes;
  }
}

interface IMATSBuilder {
  setParameters(id: number, title: string, poster: string, season?: number, episodes?: number);
  getResults(): Film | Serial;
}

class FilmBuilder implements IMATSBuilder {
  private _film: Film;

  constructor() {
    this._film = new Film();
  }

  setParameters(id: number, title: string, poster: string, season?: number, episodes?: number) {
    this._film.id = id;
    this._film.title = title;
    this._film.poster = poster;
  }

  getResults() {
    return this._film;
  }
}

class FilmBuilderDirector {
  static make(): Film {
    const film = new FilmBuilder();
    film.setParameters(1, 'Film1', 'poster/film1');
    return film.getResults();
  }
}
