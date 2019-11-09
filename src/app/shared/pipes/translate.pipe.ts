import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service.js';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  transform(key: string, args?: Object): any {
    return this.translateService.translate(key, args);
  }
}
