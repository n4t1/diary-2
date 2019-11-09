import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abstract-factory',
  templateUrl: './abstract-factory.component.html',
  styleUrls: ['./abstract-factory.component.scss']
})
export class AbstractFactoryComponent implements OnInit {

  showMATS: Array<string> = [];

  constructor() { }

  ngOnInit() {
    let matsProducer: IMATSFactory;
    let mats: IMATS;

    matsProducer = MATSFactoryProducer.getMATSFactory('film');
    mats = matsProducer.createMATS();
    this.showMATS.push(mats.getValue());

    matsProducer = MATSFactoryProducer.getMATSFactory('serial');
    mats = matsProducer.createMATS();
    this.showMATS.push(mats.getValue());
  }

}

interface IMATS {
  id: number;
  title: string;
  poster: string;
  season?: number;
  episodes?: number;

  getValue(): string;
}

interface IMATSFactory {
  createMATS(): IMATS;
}

class SuperFilm implements IMATS {
  id = 1;
  title = 'SuperFilm';
  poster = 'poster/superfilm';

  getValue(): string {
    return this.id + ' title: ' + this.title + ' posterURL: ' + this.poster;
  }
}

class SuperSerial2 implements IMATS {
  id = 2;
  title = 'SuperSerial2';
  poster = 'poster/SuperSerial2';
  season = 2;
  episodes = 10;

  getValue(): string {
    return this.id + ' title: ' + this.title + ' posterURL: ' + this.poster + ' season: ' + this.season + ' episodes: ' + this.episodes;
  }
}

class SuperFilmFactory implements IMATSFactory {
  createMATS(): IMATS {
    return new SuperFilm();
  }
}

class SuperSerial2Factory implements IMATSFactory {
  createMATS(): IMATS {
    return new SuperSerial2();
  }
}

class MATSFactoryProducer {
  static getMATSFactory(make: string) {
    let mats: IMATSFactory;
    switch (make) {
      case 'film':
        mats = new SuperFilmFactory();
        break;
      case 'serial':
        mats = new SuperSerial2Factory();
        break;
    }
    return mats;
  }
}
