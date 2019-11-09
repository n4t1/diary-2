import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-singleton',
  templateUrl: './singleton.component.html',
  styleUrls: ['./singleton.component.scss']
})
export class SingletonComponent implements OnInit {

  showMessage: Array<string> = [];

  constructor() { }

  ngOnInit() {
    const singleton1 = Singleton.Instance;
    const singleton2 = Singleton.Instance;

    if (singleton1 === singleton2) {
      const message = 'dwa singletony są równe';
      this.showMessage.push(message);
    } else {
      const message = 'dwa singletony nie są równe';
      this.showMessage.push(message);
    }
  }
}

class Singleton {
  private static instance: Singleton;

  private constructor() {}

  static get Instance() {
    if (this.instance == undefined) {
      this.instance = new Singleton();
    }

    return this.instance;
  }
}
