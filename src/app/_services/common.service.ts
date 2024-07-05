import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  getlink(name: string){
    return links.filter(e=>e.name===name).pop().path;
  }
}
