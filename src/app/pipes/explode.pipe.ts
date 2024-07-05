import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'explode'})
export class explodePipe implements PipeTransform {
  transform(value: string): string {
    const splitBy = ','
    const splittedText = value.split( splitBy );
    return `${ splittedText[0] } ${ splitBy } ${ splittedText[1] }`;
  }
}