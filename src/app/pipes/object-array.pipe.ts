import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Pipe({
  name: 'objectToArray',
})
export class ObjectToArrayPipe implements PipeTransform {
  // The object parameter represents the values of the properties or index.
  transform = (objects: any = []) => {
    return Object.values(objects);
  }
}