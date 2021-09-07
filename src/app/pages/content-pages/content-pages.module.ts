import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ContentPagesRoutingModule } from "./content-pages-routing.module";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DialogModule} from 'primeng/dialog';
import { VgCoreModule, } from '@videogular/ngx-videogular/core';
import {StepsModule} from 'primeng/steps';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';


/////// ****** Components

import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { BeneficioBaseComponent } from './beneficio-base/beneficio-base.component';
import { DatosFormularioComponent } from './datos-formulario/datos-formulario.component';
import { BeneficiosBaseComponent } from './beneficios-base/beneficios-base.component';
import { FormularioEligibilidadComponent } from './formulario-eligibilidad/formulario-eligibilidad.component';
import { PropuestaComponent } from './propuesta/propuesta.component';
import { HomeComponent } from './home/home.component';




@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule ,
        ReactiveFormsModule,
        NgbModule,
        NgxSpinnerModule,
        MatFormFieldModule,
        MatStepperModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        DialogModule,
        VgCoreModule,
        StepsModule,
        FlexLayoutModule,
        MatRadioModule,
        MatSnackBarModule

    ],
    declarations: [
        ErrorPageComponent,
        LoginPageComponent,
        BeneficioBaseComponent,
        BeneficiosBaseComponent,
        DatosFormularioComponent,
        FormularioEligibilidadComponent,
        PropuestaComponent,
        HomeComponent
    ],

})
export class ContentPagesModule { }
