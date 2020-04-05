import { Pipe, PipeTransform } from '@angular/core';
import { Value } from '../models/bimsync.model';

@Pipe({name: 'round'})
export class Round implements PipeTransform {
  transform(value: any): string {

    if (isNaN(Number(value)))
    {
        return value;
    }
    else
    {
        const valueAsNum: number = +value;
        return String(Math.round(valueAsNum * 100) / 100);
    }
  }
}