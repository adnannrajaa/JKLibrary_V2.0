import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appModel]'
})
export class ModelDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}
