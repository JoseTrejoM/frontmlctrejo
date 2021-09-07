import { DemoComponent } from './demo/demo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page.component';


const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    data: {
      title: 'Page'
    },
    children: [
      {
        path: 'demo',
        component: DemoComponent,
        data: {
          title: 'Beneficios Base'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule { }
