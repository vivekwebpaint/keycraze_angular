import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-term-of-use',
  templateUrl: './term-of-use.component.html',
  styleUrls: ['./term-of-use.component.css']
})
export class TermOfUseComponent {
  constructor(private title:Title){}
  ngOnInit() {
    this.title.setTitle('Conditions of Use : Key Craze, Wholesale Key Blanks and Accessories');
  }
}
