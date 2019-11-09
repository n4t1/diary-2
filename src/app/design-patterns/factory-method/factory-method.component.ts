import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-factory-method',
  templateUrl: './factory-method.component.html',
  styleUrls: ['./factory-method.component.scss']
})
export class FactoryMethodComponent implements OnInit {

  MATS: IMATS;
  showMATS: string[] = [];

  constructor() { }

  ngOnInit() {
    this.MATS = MATSFactory.createMATS(1, 'Film1', 'poster/film1');

    this.showMATS.push(this.MATS.getValue());

    this.MATS = MATSFactory.createMATS(1, 'Serial', 'poster/serial1', 1, 10);

    this.showMATS.push(this.MATS.getValue());
  }

}

interface IMATS {
  getValue(): string;
}

class Film implements IMATS {
  private id: number;
  private title: string;
  private poster: string;

  constructor(id: number, title: string, poster: string) {
    this.id = id;
    this.title = title;
    this.poster = poster;
  }

  getValue(): string {
    return this.id + ' title: ' + this.title + ' posterURL: ' + this.poster;
  }
}

class Serial implements IMATS {
  private id: number;
  private title: string;
  private poster: string;
  private season: number;
  private episodes: number;

  constructor(id: number, title: string, poster: string, season: number, episodes: number) {
    this.id = id;
    this.title = title;
    this.poster = poster;
    this.season = season;
    this.episodes = episodes;
  }

  getValue(): string {
    return this.id + ' title: ' + this.title + ' posterURL: ' + this.poster + ' season: ' + this.season + ' episodes: ' + this.episodes;
  }
}

class MATSFactory {
  static createMATS(id: number, title: string, poster: string, season?: number, episodes?: number) {
    return season ? new Serial(id, title, poster, season, episodes) : new Film(id, title, poster);
  }
}
