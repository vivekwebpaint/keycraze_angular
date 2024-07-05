import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
selector:'[expandMenu]'
})
export class ExpandMenu{
  @HostBinding('class.active') isOpen = false;
  @HostListener('click') toggleOpen($event: any){
    this.isOpen = !this.isOpen;
  }
}