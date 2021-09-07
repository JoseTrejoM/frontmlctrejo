import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PageRoutingModule } from "./page-routing.module";

import { PageComponent } from "./page.component";
import { DemoComponent } from './demo/demo.component';


@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule
  ],
  exports: [],
  declarations: [
    PageComponent,
    DemoComponent
  ],
  providers: [],
})
export class PageModule { }
