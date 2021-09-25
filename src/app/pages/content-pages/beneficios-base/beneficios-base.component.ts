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

import { ApiService } from '../../../shared/services/api.service'
import { ImgSrcDirective } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  arrPropuesta = [];
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
  beneficiarios = [];
  beneficios = [];
  arrBeneficios = [];
  arrSeleccionados = [15];
  envioDineroSelected = false;
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
  completarContratacion = false;


  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private _matStepperIntl: MatStepperIntl,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private api: ApiService,
    public router: Router,
    public jwtHelper: JwtHelperService
  ) {
    this.beneficiarios.push(15);
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
    this.api.loginapp().pipe(first()).subscribe((data: any) => { });
    if (localStorage.getItem('completarContratacion')) {
      this.completarContratacion = true;
      this.index = 1;
    }

  }

  ngOnInit() {

    // let decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
    // if (decodedToken.exp < new Date().getTime() / 1000) {
    //   console.log("EXPIRED");
    // } else {
    //   console.log("ACTIVE");
    // }



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

    this.arrPropuesta = [
      {
        "propuestaid": 3,
        "curp": "BEGO731126HDFLMS02",
        "estatuspropuesta": "Cuestionario",
        "clestatuspropuestaid": 1,
        "flag": 1,
        "beneficios": [
          {
            "beneficioid": 1,
            "titulobeneficio": "Repatriación a México",
            "subtitulobeneficio": "(Por fallecimiento en EU)",
            "descripcionbeneficio": "¿Quién de tu familia podría requerir este beneficio?\r\nSeleciona a las personas que quieres incluir en el plan. Puedes incluir personas que viven en México.",

            "servicios": []
          },
          {
            "beneficioid": 2,
            "titulobeneficio": "Servicio Funerario",
            "subtitulobeneficio": "(Residentes  de México)",
            "descripcionbeneficio": "¿Quién de tu familia podría requerir este beneficio?\r\nSeleciona a las personas que quieres incluir en el plan. Puedes incluir personas que viven en México.",

            "servicios": []
          },
          {
            "beneficioid": 4,
            "titulobeneficio": "Educación financiera",
            "subtitulobeneficio": "(Administración del dinero)",
            "descripcionbeneficio": "Este beneficio está incluido para todos los miembros.",

            "servicios": []
          },
          {
            "beneficioid": 5,
            "titulobeneficio": "Envío de dinero",
            "subtitulobeneficio": "(Cuenta digital en México)",
            "descripcionbeneficio": "¿Quién de tu familia recibe el dinero que envías de EUA?\r\nSeleciona a una persona para otorgarle este beneficio. Debe vivir en México.",

            "servicios": []
          },
          {
            "beneficioid": 3,
            "titulobeneficio": "Seguro de vida",
            "subtitulobeneficio": "(MX $50,000)",
            "descripcionbeneficio": "Incluido para el titula.\r\nEste beneficio está sujeto a elegibilidad.",
            "fechaalta": "2021-08-31T22:43:47.000+00:00",
            "fechamodificacion": "2021-08-31T22:43:47.000+00:00",

            "servicios": []
          }
        ],
        "cuestionario": [
          {
            "propuestaid": 3,
            "beneficiarioid": 4,
            "serviciobeneficiarioid": 6,
            "preguntaid": 1,
            "descripcionpregunta": "<p class\"\"> 1. ¿Estás embarazada?</p>",
            "respuestaid": 3,
            "respuesta": "si"
          },
          {
            "propuestaid": 3,
            "beneficiarioid": 4,
            "serviciobeneficiarioid": 6,
            "preguntaid": 2,
            "descripcionpregunta": "<p class=\"\">\n2. ¿Estás enfermo(a), estás buscando o recibiendo algún tratamiento médico, terapia o medicación? </p>",
            "respuestaid": 4,
            "respuesta": "no"
          }
        ]
      }
    ]

    this.arrBeneficios = this.arrPropuesta[0].beneficios.sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0))
    // console.log(this.arrBeneficios);

  }

  get s1() {
    return this.firstFormGroup.controls;
  }

  getPropuesta(curp, token, stepper) {
    this.api.getPropuesta(curp, token).pipe(first()).subscribe((data: any) => {
      this.arrPropuesta = data
      console.log(data);

      if (data.propuestaid == 0) {
        this.arrPropuesta['beneficios'].forEach((element, index) => {
          if (element.beneficioid != 3) {
            element['beneficiosbeneficiarios'] = [];
            element['beneficiosbeneficiarios'].push(
              {
                "imagenactivo": "Padre",
                "imageninactivo": "Padre-Apagado",
                "imagendefault": "Padre-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Padre",
                "tipobeneficiarioid": "17",
              },
              {
                "imagenactivo": "Madre",
                "imageninactivo": "Madre-Apagado",
                "imagendefault": "Madre-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Madre",
                "tipobeneficiarioid": "18",
              },
              {
                "imagenactivo": "Titular",
                "imageninactivo": "Titular-Apagado",
                "imagendefault": element.beneficioid == 5 ? "Titular-Apagado" : "Titular",
                "esseleccionado": false,
                "tipobeneficiario": "Titular",
                "tipobeneficiarioid": "15"
              },
              {
                "imagenactivo": "Pareja",
                "imageninactivo": "Pareja-Apagado",
                "imagendefault": "Pareja-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Pareja",
                "tipobeneficiarioid": "16",
              },
              {
                "imagenactivo": "Hijo",
                "imageninactivo": "Hijo-Apagado",
                "imagendefault": "Hijo-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
              {
                "imagenactivo": "Hijo-2",
                "imageninactivo": "Hijo-Apagado-2",
                "imagendefault": "Hijo-Apagado-2",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
              {
                "imagenactivo": "Hijo-3",
                "imageninactivo": "Hijo-Apagado-3",
                "imagendefault": "Hijo-Apagado-3",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
            );
          } else if (element.beneficioid == 3) {
            element['beneficiosbeneficiarios'] = [];
            this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios'].push(
              {
                "imagenactivo": "Titular",
                "imageninactivo": "Titular-Apagado",
                "imagendefault": "Titular",
                "esseleccionado": false,
                "tipobeneficiario": "Titular",
                "tipobeneficiarioid": "15",
              }
            );
          } else if (element.beneficioid == 5) {
            element['beneficiosbeneficiarios'] = [];
            this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios'].push(
              {
                "imagenactivo": "Titular",
                "imageninactivo": "Titular-Apagado",
                "imagendefault": "Titular-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Titular",
                "tipobeneficiarioid": "15",
              }
            );
          }

          // Ordenar la propuesta inicial
          this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios']
            .sort((a, b) => (a.tipobeneficiarioid > b.tipobeneficiarioid) ? 1 : ((b.tipobeneficiarioid > a.tipobeneficiarioid) ? -1 : 0));

        });

      } else {
        this.arrPropuesta['beneficios'].forEach((element, index) => {
          if (element.beneficioid == 1) {
            element.beneficiosbeneficiarios.forEach(bb => {
              if (bb.tipobeneficiarioid == 15) {
                localStorage.setItem('servicioBeneficiarioId', bb.serviciobeneficiarioid);
              }
            });
          }

          if (element.beneficiosbeneficiarios.length == 4 && element.beneficioid != 3) {
            this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios'].push(
              {
                "imagenactivo": "Hijo",
                "imageninactivo": "Hijo-Apagado",
                "imagendefault": "Hijo-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
              {
                "imagenactivo": "Hijo-2",
                "imageninactivo": "Hijo-Apagado-2",
                "imagendefault": "Hijo-Apagado-2",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
              {
                "imagenactivo": "Hijo-3",
                "imageninactivo": "Hijo-Apagado-3",
                "imagendefault": "Hijo-Apagado-3",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
            );
          } else if (element.beneficiosbeneficiarios.length == 5 && element.beneficioid != 3) {
            this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios'].push({
              "imagenactivo": "Hijo-2",
              "imageninactivo": "Hijo-Apagado-2",
              "imagendefault": "Hijo-Apagado-2",
              "esseleccionado": false,
              "tipobeneficiario": "Hijo",
              "tipobeneficiarioid": "19",
            },
              {
                "imagenactivo": "Hijo-3",
                "imageninactivo": "Hijo-Apagado-3",
                "imagendefault": "Hijo-Apagado-3",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
              },
            );
          } else if (element.beneficiosbeneficiarios.length == 6 && element.beneficioid != 3) {
            this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios'].push({
              "imagenactivo": "Hijo-3",
              "imageninactivo": "Hijo-Apagado-3",
              "imagendefault": "Hijo-Apagado-3",
              "esseleccionado": false,
              "tipobeneficiario": "Hijo",
              "tipobeneficiarioid": "19",
            });
          }

          // Ordenar la propuesta inicial
          this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios']
            .sort((a, b) => (a.tipobeneficiarioid > b.tipobeneficiarioid) ? 1 : ((b.tipobeneficiarioid > a.tipobeneficiarioid) ? -1 : 0));

          // Autoselección del Titular en todos los beneficios
          if (element.beneficioid == 5) {
            element['beneficiosbeneficiarios'].forEach(bb => {
              if (bb.tipobeneficiarioid == 15) {
                bb.esseleccionado = true;
                bb.imagendefault = bb.imagenactivo
              } else {
                bb.esseleccionado = false;
                bb.imagendefault = bb.imageninactivo
              }

            });
          }

        });

      }
      // Guardo en storage los parámetros
      localStorage.setItem("flag", this.arrPropuesta['flag']);
      localStorage.setItem("propuestaId", this.arrPropuesta['propuestaid']);
      localStorage.setItem("curp", this.arrPropuesta['curp']);
      localStorage.setItem("cuestionario", JSON.stringify(this.arrPropuesta['cuestionario']));

      // Ordenar los beneficios
      this.arrBeneficios = this.arrPropuesta['beneficios'].sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0));
      this.arrBeneficios = this.arrPropuesta['beneficios'];
      console.log(this.arrBeneficios);


      // Si cntinúa su proceso activo
      if (data.flag == 1) {
        this.beneficiariosSeleccionados();
        if (data.estatuspropuesta == 'Cuestionario') {
          this.router.navigate(["./pages/formulario-eligibilidad"]);
        } else if (data.estatuspropuesta == 'Propuesta Aceptada') {
          this.router.navigate(["./pages/propuesta"]);
        }

      }

      // Avanzar step
      stepper.next();
      this.index++;
      this.ref.detectChanges();
    },
      (error) => { }
    );
  }

  beneficiariosSeleccionados() {
    let arrB = []
    this.arrBeneficios.forEach(element => {
      arrB = []
      element['beneficiosbeneficiarios'].forEach(bb => {
        if (bb.esseleccionado) {
          arrB.push(
            bb.tipobeneficiarioid
          );
          this.beneficiarios.push(
            parseInt(bb.tipobeneficiarioid)
            );
        }
      });
      this.beneficios.push({
        "beneficioId": element.beneficioid,
        "beneficiarios": arrB

      });
    });


      this.beneficiarios = Array.from(new Set(this.beneficiarios));
      localStorage.setItem("beneficiarios", JSON.stringify(this.beneficiarios));
      localStorage.setItem("beneficios", JSON.stringify(this.beneficios));
  }

  showResponsiveDialog() {
    this.displayModalResponsive = true
  }

  changeStepInicial(stepper) {
    stepper.next();
    this.index++;
  }

  changeStepCurp(stepper, beneficio) {
    this.s1Submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    console.log(new Date().getTime() / 1000);

    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.getPropuesta(this.s1.curp.value, this.api.currentTokenValue, stepper);
    });
  }

  backStep(stepper) {
    stepper.previous();
    this.index--;
  }

  changeStep(stepper, beneficio) {
    let arrB = [];

    // console.log(this.arrBeneficios);

    let arr = this.arrBeneficios.filter(function (e) {
      return e.beneficioid == beneficio;
    });
    arr[0].beneficiosbeneficiarios.forEach(element => {

      if (beneficio == 5) {
        if (element.esseleccionado) {
          arrB.push(
            element.tipobeneficiarioid
          )
        }
      } else if (element.esseleccionado || element.tipobeneficiarioid == 15) {
        arrB.push(
          element.tipobeneficiarioid
        )
      }

      if (element.esseleccionado) {
        this.beneficiarios.push(parseInt(element.tipobeneficiarioid))
      }
      // element.esseleccionado ? this.beneficiarios.push(parseInt(element.tipobeneficiarioid)) : '';
    });

    this.beneficios.push({
      "beneficioId": beneficio,
      "beneficiarios": arrB

    });

    if (this.index == this.arrBeneficios.length + 1) {
      this.beneficiarios = Array.from(new Set(this.beneficiarios));
      localStorage.setItem("beneficiarios", JSON.stringify(this.beneficiarios));
      localStorage.setItem("beneficios", JSON.stringify(this.beneficios));
      this.router.navigate(["./pages/formulario-eligibilidad"]);
    }
    // console.log(this.beneficios);
    stepper.next();
    this.index++;
  }

  changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo) {

    this.arrSeleccionados.push(parseInt(tipobeneficiarioid));


    let seleccionado = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i].esseleccionado;
    let arr = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i];

    // // Cambio la imagen
    !seleccionado ? arr.imagendefault = arr.imagenactivo : arr.imagendefault = arr.imageninactivo;

    // // Cambio la bandera de selección
    !arr.esseleccionado ? arr.esseleccionado = true : arr.esseleccionado = false;


    if (beneficio == 5) {
      // Bebeficio Envío de dinero
      if (tipobeneficiarioid == 19) {
        this.openSnackBarHijo();
      }
      this.envioDineroSelected = true;
      this.arrBeneficios.forEach(element => {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (bb.imagenactivo != imagenactivo) {
            bb.esseleccionado = false;
            bb.imagendefault = bb.imageninactivo;
          }
        });

      });
      this.ref.detectChanges();
    } else {

      this.arrBeneficios.forEach(element => {
        if (element.beneficioid > beneficio && element.beneficioid != 3 && element.beneficioid != 5) {
          element['beneficiosbeneficiarios'].forEach(bb => {
            if (bb.imagenactivo == imagenactivo && bb.tipobeneficiarioid != 15) {
              bb.esseleccionado = arr.esseleccionado;
              bb.esseleccionado ? bb.imagendefault = bb.imagenactivo : bb.imagendefault = bb.imageninactivo;
            }
          });
        }
      });
      this.ref.detectChanges();

    }
  }

  checkSeleccionados(tipobeneficiarioid) {
    console.log(tipobeneficiarioid);
    if (this.arrSeleccionados.indexOf(tipobeneficiarioid) == -1) {
      return false;
    } else {
      return true;
    }
  }

  agregarHijos(beneficio) {
    this.countHijo++;
    this.indexHijo++;

    this.arrBeneficios.forEach(element => {
      if ((element.beneficioid == beneficio) && element.beneficioid != 3 && element.beneficioid != 5) {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (bb.tipobeneficiarioid == 19) {
            bb.esseleccionado = true;
            bb.imagendefault = bb.imagenactivo;
          }
        });
        element['beneficiosbeneficiarios'].push(
          {
            "imagenactivo": "Hijo-1",
            "imageninactivo": "Hijo-Apagado-1",
            "imagendefault": "Hijo-1",
            "esseleccionado": true,
            "tipobeneficiario": "Hijo",
            "tipobeneficiarioid": "19",
            "agregado": true
          });
      } else if (element.beneficioid > beneficio && element.beneficioid != 3 && element.beneficioid != 5) {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (bb.tipobeneficiarioid == 19) {
            bb.esseleccionado = true;
            bb.imagendefault = bb.imagenactivo;
          }
        });
        element['beneficiosbeneficiarios'].push(
          {
            "imagenactivo": "Hijo-1",
            "imageninactivo": "Hijo-Apagado-1",
            "imagendefault": "Hijo-1",
            "esseleccionado": true,
            "tipobeneficiario": "Hijo",
            "tipobeneficiarioid": "19",
            "agregado": true
          });
      }
      this.ref.detectChanges();
    });


  }

  plus(beneficio) {
    this.agregarHijos(beneficio);
  }
  minus(beneficio) {
    if (this.countHijo != 0) {
      this.countHijo--;
      this.arrBeneficios.forEach(element => {
        if ((element.beneficioid == beneficio) && element.beneficioid != 3 && element.beneficioid != 5) {
          element['beneficiosbeneficiarios'].forEach((bb, i) => {
            if (bb.tipobeneficiarioid == 19 && bb.agregado) {
              element['beneficiosbeneficiarios'].splice(i, 1);
            }
          });
        } else if ((element.beneficioid > beneficio) && element.beneficioid != 3 && element.beneficioid != 5) {
          element['beneficiosbeneficiarios'].forEach((bb, i) => {
            if (bb.tipobeneficiarioid == 19 && bb.agregado) {
              element['beneficiosbeneficiarios'].splice(i, 1);
            }
          });
        }
      });
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

    let yearsDiff = fechaActual.getFullYear() - fechaCurp.getFullYear();
    let monthDiif = fechaActual.getMonth() - fechaCurp.getMonth();

    if (monthDiif < 0 || (monthDiif === 0 && fechaActual.getDate() < fechaCurp.getDate())) {
      yearsDiff--;
    }

    if (edad == 'Menor' && yearsDiff > 56) {
      e.source.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = false;
      chk.checked = false;
      this.openSnackBar();
    } else if (edad == 'Menor') {
      chk.checked = false;
      this.checkedMenor = true;
      this.checkedMayor = false;
    } else if (edad == 'Mayor' && yearsDiff < 56) {
      e.source.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = false;
      chk.checked = false;
      this.openSnackBar();
    } else if (edad == 'Mayor') {
      chk.checked = false;
      this.checkedMenor = false;
      this.checkedMayor = true;
    }

  }

  tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    console.log(expiry);
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  openSnackBar() {
    this._snackBar.open('¡Atención! La opción seleccionada no corresponde a tu edad.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  openSnackBarHijo() {
    this._snackBar.open('¡Atención! El beneficiario debe ser mayor de 18 años.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
