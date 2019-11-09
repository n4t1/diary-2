import { Injectable } from '@angular/core';
import com from '../../../assets/communications.json';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }

  translate(key: string, args?: Object): string {
    let translate = this.getTranslateValue(com, key.split('.'));

    if (!translate) {
      return key;
    }

    if (args) {
      translate = this.setArgsValue(translate, args);
    }
    return translate;
  }

  private getTranslateValue(obj: Object, keys: Array<string>): string {
    if (keys.length === 1) {
      const translateValue = obj[keys[0]];
      return translateValue;
    }
    // save new object with first key in array
    obj = obj[keys[0]];
    // go to lower key
    keys.shift();

    return this.getTranslateValue(obj, keys);
  }

  private setArgsValue(translate: string, args: Object): string { // {value: 'world'} ala ma kota a {{value}} ma aids
    // args = { value: 'world' };
    // const regExp: RegExp = /{{[^{{}}]+}}/; // get this: ala ma kota a replacer ma aids
    return translate.replace(/\{\{([a-z0-9]+)\}\}/gi, (match, key) => {
      if (args[key]) {
        return args[key];
      }
      return match;
    });
  }
}
