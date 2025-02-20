import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAlphabetOnly]'
})

export class AlphabetOnlyDirective {
  key:any;
  @Input() appAlphabetOnly: boolean | undefined;
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    if (this.appAlphabetOnly == true) {
      if ((this.key >= 15 && this.key <= 64 && (this.key != 32) && (this.key != 37) && (this.key != 39)) || (this.key >= 123 && event.key != "'") || (this.key == 222 && event.key == '"') || (this.key >= 96 && this.key <= 105)) {
        event.preventDefault();
      }
    }
      else{
        if ((this.key >= 15 && this.key <= 64  && (this.key != 37) && (this.key !=39) && (this.key !=32)) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
          event.preventDefault();
        }
      }
  }

  @HostListener('paste', ['$event'])
  onPaste($event: any): any {
    let pasteData = $event.clipboardData.getData('text/plain');
    let RegExp = /^[a-zA-Z](?:[ '.\-a-zA-Z]*[a-zA-Z])?$/
    if (this.appAlphabetOnly == true) {
      if (!RegExp.test(pasteData)) {
        $event.preventDefault();
      }
      else {
        return true;
      }
    }
  }
}
