import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from './common-service.service';
import { SharedComponentsModule } from './components/shared-components.module'
import { HighlightDirective } from './directives/highlight.directive';

import {
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    NumberSuffixPipe
} from './pipes';
import { ErrorService } from './error.service';
import { ModalService } from './modal.service';
import { ModelDirective } from './directives/model.directive';
import { FileHelper } from './file-helper-service.service';



const PIPES = [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    NumberSuffixPipe
];
const SERVICES = [
    CommonService,
    FileHelper,
    ModalService,
    ErrorService
];

@NgModule({

    imports: [CommonModule, SharedComponentsModule,
    ],
    declarations: [...PIPES, HighlightDirective, ModelDirective],
    exports: [CommonModule,
        ...PIPES,
        SharedComponentsModule,
        HighlightDirective,
    ],
    providers: [
        ...SERVICES,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                ...SERVICES,
            ],
        };
    }
}
