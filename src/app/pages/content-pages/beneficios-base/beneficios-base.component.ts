import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepperIntl, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {ApiService} from '../../../shared/services/api.service'

export enum PageNames {
  Curp,
  Repatriacion,
  Funerario,
  Vida,
  Educacion,
  Envio
}

@Component({
  selector: 'app-beneficios-base',
  templateUrl: './beneficios-base.component.html',
  styleUrls: ['./beneficios-base.component.scss']
})
export class BeneficiosBaseComponent {

  s1Submitted = false;
  displayModalResponsive: boolean;
  PageNames = PageNames;
  itemsSteps: MenuItem[];
  index = 0;
  stepIndex = PageNames.Curp;
  familia: any[];
  familiaFunerario: any[];
  familiaEducacion: any[];
  familiaEnvio: any[];
  countHijo = 3;
  indexHijo = 6;
  firstFormGroup: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  checkedMenor: boolean = false;
  checkedMayor: boolean = false;


  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private _matStepperIntl: MatStepperIntl,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private api: ApiService,
  ) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));

      this.api
      .loginapp()
      .pipe(first())
      .subscribe(
        (data:any) => {
          console.log(data);
        },
        (error) => { }
      );

  }



  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      curp: ['',
        [
          Validators.required,
          Validators.pattern("^([A-Z&]|[a-z&]{1})([AEIOUX]|[aeiou]{1})([A-Z&]|[a-z&]{1})([A-Z&]|[a-z&]{1})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([HM]|[hm]{1})([AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne]{2})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([^A|a|E|e|I|i|O|o|U|u]{1})([0-9]{2})$"),
          Validators.minLength(18),
          Validators.maxLength(18),
        ],
      ],
      chk: ['', Validators.required]
    });

    this.itemsSteps = [
      { label: '' },
      { label: '' },
      { label: '' }
    ];

    this.familia = [
      {
        idMiembro: 1,
        img: '../../../../assets/img/icons/Padre-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Padre.png',
        imgApagado: '../../../../assets/img/icons/Padre-Apagado.png',
        beneficio: 1,
        index: 0
      },
      {
        idMiembro: 2,
        img: '../../../../assets/img/icons/Madre-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Madre.png',
        imgApagado: '../../../../assets/img/icons/Madre-Apagado.png',
        beneficio: 1,
        index: 1
      },
      {
        idMiembro: 3,
        img: '../../../../assets/img/icons/Titular.png',
        selected: 1,
        imgPrendido: '../../../../assets/img/icons/Titular.png',
        imgApagado: '../../../../assets/img/icons/Titular-Apagado.png',
        beneficio: 1,
        index: 2
      },
      {
        idMiembro: 4,
        img: '../../../../assets/img/icons/Pareja-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Pareja.png',
        imgApagado: '../../../../assets/img/icons/Pareja-Apagado.png',
        beneficio: 1,
        index: 3
      },
      {
        idMiembro: 5,
        img: '../../../../assets/img/icons/Hijo-1-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Hijo-1.png',
        imgApagado: '../../../../assets/img/icons/Hijo-1-Apagado.png',
        beneficio: 1,
        index: 4
      },
      {
        idMiembro: 5,
        img: '../../../../assets/img/icons/Hijo-2-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Hijo-2.png',
        imgApagado: '../../../../assets/img/icons/Hijo-2-Apagado.png',
        beneficio: 1,
        index: 5
      },
      {
        idMiembro: 5,
        img: '../../../../assets/img/icons/Hijo-3-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Hijo-3.png',
        imgApagado: '../../../../assets/img/icons/Hijo-3-Apagado.png',
        beneficio: 1,
        index: 6
      }
    ]

    this.familiaEnvio = [
      {
        idMiembro: 1,
        img: '../../../../assets/img/icons/Padre-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Padre.png',
        imgApagado: '../../../../assets/img/icons/Padre-Apagado.png',
        beneficio: 1,
        index: 0
      },
      {
        idMiembro: 2,
        img: '../../../../assets/img/icons/Madre-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Madre.png',
        imgApagado: '../../../../assets/img/icons/Madre-Apagado.png',
        beneficio: 1,
        index: 1
      },
      {
        idMiembro: 3,
        img: '../../../../assets/img/icons/Titular.png',
        selected: 1,
        imgPrendido: '../../../../assets/img/icons/Titular.png',
        imgApagado: '../../../../assets/img/icons/Titular-Apagado.png',
        beneficio: 1,
        index: 2
      },
      {
        idMiembro: 4,
        img: '../../../../assets/img/icons/Pareja-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Pareja.png',
        imgApagado: '../../../../assets/img/icons/Pareja-Apagado.png',
        beneficio: 1,
        index: 3
      },
      {
        idMiembro: 5,
        img: '../../../../assets/img/icons/Hijo-1-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Hijo-1.png',
        imgApagado: '../../../../assets/img/icons/Hijo-1-Apagado.png',
        beneficio: 1,
        index: 4
      },
      {
        idMiembro: 5,
        img: '../../../../assets/img/icons/Hijo-2-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Hijo-2.png',
        imgApagado: '../../../../assets/img/icons/Hijo-2-Apagado.png',
        beneficio: 1,
        index: 5
      },
      {
        idMiembro: 5,
        img: '../../../../assets/img/icons/Hijo-3-Apagado.png',
        selected: 0,
        imgPrendido: '../../../../assets/img/icons/Hijo-3.png',
        imgApagado: '../../../../assets/img/icons/Hijo-3-Apagado.png',
        beneficio: 1,
        index: 6
      }
    ]
  }

  get s1() {
    return this.firstFormGroup.controls;
  }

  getPropuesta(curp, token) {
    this.api.getPropuesta(curp, token).pipe(first()).subscribe((data:any) => {
          console.log(data);
        },
        (error) => { }
      );
  }

  showResponsiveDialog() {
    this.displayModalResponsive = true
  }

  changeStepCurp(stepper, beneficio) {
    this.s1Submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.getPropuesta(this.s1.curp.value, this.api.currentTokenValue);
    stepper.next();
    this.index++;


    // this.curpValida(this.s1.curp.value);
  }

  changeStep(stepper, beneficio) {
    switch (beneficio) {
      case 1: {
        this.familiaFunerario = this.familia;
        console.table(this.familia);
        break;
      }
      case 2: {
        this.familiaEducacion = this.familia;
        console.table(this.familiaFunerario);
        break;
      }
    }

    stepper.next();
    this.index++;
  }

  changeImg(i, beneficio) {
    console.log(beneficio);
    switch (beneficio) {
      case 1: {
        // Cambio la imagen
        this.familia[i].selected == 0 ? this.familia[i].img = this.familia[i].imgPrendido :
          this.familia[i].selected == 1 ? this.familia[i].img = this.familia[i].imgApagado : '';

        // Cambio la bandera de selección
        this.familia[i].selected == 0 ? this.familia[i].selected = 1 : this.familia[i].selected = 0;
        this.ref.detectChanges();
        break;
      }
      case 2: {
        // Cambio la imagen
        this.familiaFunerario[i].selected == 0 ? this.familiaFunerario[i].img = this.familiaFunerario[i].imgPrendido :
          this.familiaFunerario[i].selected == 1 ? this.familiaFunerario[i].img = this.familiaFunerario[i].imgApagado : '';

        // Cambio la bandera de selección
        this.familiaFunerario[i].selected == 0 ? this.familiaFunerario[i].selected = 1 : this.familiaFunerario[i].selected = 0;
        this.ref.detectChanges();
        break;
      }
    }


  }

  agregarHijos(beneficio) {
    this.countHijo++;
    this.indexHijo++;
    // this.familia.push({
    //   idMiembro : 5,
    //   img: '../../../../assets/img/icons/Hijo-'+this.countHijo+'-Apagado.png',
    //   selected: 1,
    //   imgPrendido: '../../../../assets/img/icons/Hijo-'+this.countHijo+'.png',
    //   imgApagado: '../../../../assets/img/icons/Hijo-'+this.countHijo+'-Apagado.png',
    //   beneficio: 1,
    //   index: this.indexHijo
    // });
    this.ref.detectChanges();
    console.table(this.familia);
  }

  plus() {
    this.countHijo++;
  }
  minus() {
    if (this.countHijo != 0) {
      this.countHijo--;
    }
  }

  inputCurp(chkMayor, chkMenor) {
    this.checkedMenor = false;
    this.checkedMayor = false;
    chkMayor.checked = false;
    chkMenor.checked = false;
  }

  validaCurp(edad, e: MatSlideToggleChange, chk) {
    this.s1Submitted = true;
    if (this.s1.curp.invalid) {
      e.source.checked = false;
      this.checkedMenor = false;
      return;
    }
    let fecha = this.s1.curp.value.slice(4, 10);
    let anio = this.s1.curp.value.slice(4, 6);
    let mes = this.s1.curp.value.slice(6, 8);
    let dia = this.s1.curp.value.slice(8, 10);

    var fechaCurp = new Date(anio, (mes - 1), dia);

    var fechaActual = new Date();

    let yearsDiff =  fechaActual.getFullYear() - fechaCurp.getFullYear();
    let monthDiif =  fechaActual.getMonth() - fechaCurp.getMonth();

    if (monthDiif < 0 || (monthDiif === 0 && fechaActual.getDate() < fechaCurp.getDate()))
    {
      yearsDiff--;
    }

    if (edad == 'Menor' && yearsDiff > 56) {
      e.source.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = false;
      chk.checked = false;
      this.openSnackBar();
    } else if(edad == 'Menor'){
      chk.checked = false;
      this.checkedMenor = true;
      this.checkedMayor = false;
    } else if(edad == 'Mayor' && yearsDiff < 56){
      e.source.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = false;
      chk.checked = false;
      this.openSnackBar();
    } else if(edad == 'Mayor'){
      chk.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = true;
    }

  }

  openSnackBar() {
    this._snackBar.open('¡Atención! La opción seleccionada no corresponde a tu edad.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
