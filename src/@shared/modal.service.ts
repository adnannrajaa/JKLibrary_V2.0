import { ComponentFactoryResolver, ComponentRef, Injectable } from "@angular/core";
import { ModalState } from "./constants/constant";

@Injectable({
    providedIn: 'root'
})
export class ModalService {
  private rootViewContainer: any ;

    constructor(private factoryResolver: ComponentFactoryResolver) {
        this.factoryResolver = factoryResolver;
    }
    setRootViewContainerRef(viewContainerRef: any) {
        this.rootViewContainer = viewContainerRef;
    }
    addDynamicComponent(component: any): any {
        var status = ModalState.Open;
        const componentFactory = this.factoryResolver.resolveComponentFactory(component);
        let componentRef: ComponentRef<typeof component> = this.rootViewContainer.createComponent(componentFactory);
        return componentRef;
    }

    removeDynamicComponent(component: any) {
        component.destroy();
    }
}
