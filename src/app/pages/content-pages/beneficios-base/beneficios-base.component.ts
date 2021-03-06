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
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

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
  templateUrl:'./beneficios-base.component.html',
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
  edad = 0;
  precioMensual = 0;
  arrPlan = [];
  countRepatriacion = 1;
  serviciobeneficiarioid: any;
  tipoplanId = 0;
  descripcionPlan = '';
  precioAnual = 0;
  continuarContratacion = 0;

  stepperOrientation: Observable<StepperOrientation>;
  sexo: any;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private _matStepperIntl: MatStepperIntl,
    private ref: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private api: ApiService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService
  ) {
    this.beneficiarios.push(15);
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));
    this.api.loginapp().pipe(first()).subscribe((data: any) => { });
    if (localStorage.getItem('completarContratacion')) {
      this.completarContratacion = true;
      this.index = 1;
    }

    localStorage.removeItem('beneficiarios');
    localStorage.removeItem('beneficios');

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
            "titulobeneficio": "Repatriaci??n a M??xico",
            "subtitulobeneficio": "(Por fallecimiento en EU)",
            "descripcionbeneficio": "??Qui??n de tu familia  podr??a requerir este beneficio?\r\nSeleciona a las personas que quieres incluir en el plan. Puedes incluir personas que viven en M??xico.",

            "servicios": []
          },
          {
            "beneficioid": 2,
            "titulobeneficio": "Servicio Funerario",
            "subtitulobeneficio": "(Residentes de M??xico)",
            "descripcionbeneficio": "??Qui??n de tu familia podr??a requerir este beneficio?\r\nSeleciona a las personas que quieres incluir en el plan. Puedes incluir personas que viven en M??xico.",

            "servicios": []
          },
          {
            "beneficioid": 4,
            "titulobeneficio": "Educaci??n financiera",
            "subtitulobeneficio": "(Administraci??n del dinero)",
            "descripcionbeneficio": "Este beneficio est?? incluido para todos los miembros.",

            "servicios": []
          },
          {
            "beneficioid": 5,
            "titulobeneficio": "Env??o de dinero",
            "subtitulobeneficio": "(Cuenta digital en M??xico)",
            "descripcionbeneficio": "??Qui??n de tu familia recibe el dinero que env??as de EUA?\r\nSeleciona a una persona para otorgarle este beneficio. Debe vivir en M??xico.",

            "servicios": []
          },
          {
            "beneficioid": 3,
            "titulobeneficio": "Seguro de vida",
            "subtitulobeneficio": "(MX $50,000)",
            "descripcionbeneficio": "Incluido para el titula.\r\nEste beneficio est?? sujeto a elegibilidad.",
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
            "descripcionpregunta": "<p class\"\"> 1. ??Est??s embarazada?</p>",
            "respuestaid": 3,
            "respuesta": "si"
          },
          {
            "propuestaid": 3,
            "beneficiarioid": 4,
            "serviciobeneficiarioid": 6,
            "preguntaid": 2,
            "descripcionpregunta": "<p class=\"\">\n2. ??Est??s enfermo(a), est??s buscando o recibiendo alg??n tratamiento m??dico, terapia o medicaci??n? </p>",
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
    this.spinner.show();
    this.api.getPropuesta(curp, token).pipe(first()).subscribe((data: any) => {
      this.arrPropuesta = data
      console.log(data);

      if (data.propuestaid == 0) {
        if (this.continuarContratacion == 1) {
          this.spinner.hide();
          Swal.fire({
            icon: "error",
            title: "Lo sentimos",
            text: "No existe un proceso de contrataci??n previo para esta CURP.",
            willClose: () => {
              this.router.navigate(["./pages/home"]);
            }
          });
        }
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
                "activo": false
              },
              {
                "imagenactivo": "Madre",
                "imageninactivo": "Madre-Apagado",
                "imagendefault": "Madre-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Madre",
                "tipobeneficiarioid": "18",
                "activo": false
              },
              {
                "imagenactivo": "Titular",
                "imageninactivo": "Titular-Apagado",
                "imagendefault": element.beneficioid == 5 ? "Titular-Apagado" : "Titular",
                "esseleccionado": true,
                "tipobeneficiario": "Titular",
                "tipobeneficiarioid": "15",
                "activo": false
              },
              {
                "imagenactivo": "Pareja",
                "imageninactivo": "Pareja-Apagado",
                "imagendefault": "Pareja-Apagado",
                "esseleccionado": false,
                "tipobeneficiario": "Pareja",
                "tipobeneficiarioid": "16",
                "activo": false
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
                "activo": false
              },
              {
                "imagenactivo": "Hijo-3",
                "imageninactivo": "Hijo-Apagado-3",
                "imagendefault": "Hijo-Apagado-3",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
                "activo": false
              },
            );
          } else if (element.beneficioid == 3) {
            element['beneficiosbeneficiarios'] = [];
            this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios'].push(
              {
                "imagenactivo": "Titular",
                "imageninactivo": "Titular-Apagado",
                "imagendefault": "Titular",
                "esseleccionado": true,
                "tipobeneficiario": "Titular",
                "tipobeneficiarioid": "15",
                "activo": false
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
                "activo": false
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
              bb.activo = false;
              if (bb.tipobeneficiarioid == 15) {
                localStorage.setItem('servicioBeneficiarioId', bb.serviciobeneficiarioid);
                this.serviciobeneficiarioid = bb.serviciobeneficiarioid
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
                "activo": false
              },
              {
                "imagenactivo": "Hijo-2",
                "imageninactivo": "Hijo-Apagado-2",
                "imagendefault": "Hijo-Apagado-2",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
                "activo": false
              },
              {
                "imagenactivo": "Hijo-3",
                "imageninactivo": "Hijo-Apagado-3",
                "imagendefault": "Hijo-Apagado-3",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
                "activo": false
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
              "activo": false
            },
              {
                "imagenactivo": "Hijo-3",
                "imageninactivo": "Hijo-Apagado-3",
                "imagendefault": "Hijo-Apagado-3",
                "esseleccionado": false,
                "tipobeneficiario": "Hijo",
                "tipobeneficiarioid": "19",
                "activo": false
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
              "activo": false
            });
          }

          // Ordenar la propuesta inicial
          this.arrPropuesta['beneficios'][index]['beneficiosbeneficiarios']
            .sort((a, b) => (a.tipobeneficiarioid > b.tipobeneficiarioid) ? 1 : ((b.tipobeneficiarioid > a.tipobeneficiarioid) ? -1 : 0));

          // Autoselecci??n del Titular en todos los beneficios
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

          if (element.beneficioid == 3) {
            if (this.edad >= 50) {
              element['beneficiosbeneficiarios'].forEach(bb => {
                bb.esseleccionado = false;
                bb.imagendefault = bb.imageninactivo
              });
            }
          }

        });

      }
      // Guardo en storage los par??metros
      localStorage.setItem("flag", this.arrPropuesta['flag']);
      localStorage.setItem("propuestaId", this.arrPropuesta['propuestaid']);
      localStorage.setItem("curp", this.arrPropuesta['curp']);
      localStorage.setItem("cuestionario", JSON.stringify(this.arrPropuesta['cuestionario']));

      // Ordenar los beneficios
      this.arrBeneficios = this.arrPropuesta['beneficios'].sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0));
      this.arrBeneficios = this.arrPropuesta['beneficios'];
      console.log(this.arrBeneficios);
      this.getPlan(this.api.currentTokenValue);

      // Si cntin??a su proceso activo
      if (data.flag == 1) {
        this.beneficiariosSeleccionados();

        if (data.estatuspropuesta == 'Cuestionario' && this.edad < 50) {
          this.router.navigate(["./pages/formulario-eligibilidad"]);
        } else if (data.estatuspropuesta == 'Propuesta Aceptada' && this.edad < 50) {
          this.router.navigate(["./pages/propuesta"]);
        } else if (this.edad >= 50) {
          this.router.navigate(["./pages/propuesta"]);
        }

      }

      // Avanzar step
      stepper.next();
      this.index++;
      this.ref.detectChanges();
      this.spinner.hide();

    },
      (error) => { }
    );
  }

  getPlan(token) {
    this.api.getPlan(token).pipe(first()).subscribe((data: any) => {
      console.log(data);
      console.log(this.edad);
      let arrTemp = [];
      let edadPlan = 0;

      this.edad > 60 ? edadPlan = 60 : edadPlan = this.edad;

      this.arrPlan = data.filter(
        e => edadPlan >= e.edadminima && edadPlan <= e.edadmaxima);
      console.log("Plan:", this.arrPlan);

      this.precioMensual = this.arrPlan[0].precioMensual;
      this.tipoplanId = this.arrPlan[0].tipoplanId;

      if (this.arrPropuesta['plan']['tipoPlanId']) {
        this.precioMensual = this.arrPropuesta['plan']['costo']
        this.tipoplanId = this.arrPropuesta['plan']['tipoPlanId'];
      } else {
        this.precioMensual = this.arrPlan[0].precioMensual;
        this.tipoplanId = this.arrPlan[0].tipoplanId;

      }

    });
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
    console.log('Modal');
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
    this.continuarContratacion = 0;
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.getPropuesta(this.s1.curp.value, this.api.currentTokenValue, stepper);
      // this.getPlan(this.api.currentTokenValue);
    });
  }

  changeStepCurpContinuar (stepper, beneficio) {
    this.s1Submitted = true;
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.continuarContratacion = 1;
    this.api.loginapp().pipe(first()).subscribe((data: any) => {
      this.getPropuesta(this.s1.curp.value, this.api.currentTokenValue, stepper);
      // this.getPlan(this.api.currentTokenValue);
    });
  }

  backStep(stepper) {

    if (this.edad >= 50 && this.index == 5) {
      stepper.previous();
      stepper.previous();
      this.index--;
      this.index--;
    } else {
      stepper.previous();
      this.index--;
    }

  }

  changeStep(stepper, beneficio) {
    let arrB = [];
    let arrSend = [];
    let arrSendPropuesta = [];
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
    });

    console.log(arr);

    if (arr.length > 0) {
      this.beneficios = this.beneficios.filter(function (e) {
        return e.beneficioId != beneficio;
      });
      console.log(this.beneficios);
    }

    this.beneficios.push({
      "beneficioId": beneficio,
      "beneficiarios": arrB

    });

    console.log(this.beneficios);

    if (this.index == this.arrBeneficios.length + 1) {
      this.spinner.show();
      this.beneficiarios = Array.from(new Set(this.beneficiarios));
      localStorage.setItem("beneficiarios", JSON.stringify(this.beneficiarios));
      localStorage.setItem("beneficios", JSON.stringify(this.beneficios));
      localStorage.setItem('tipoplanId', this.tipoplanId.toString());
      localStorage.setItem('precioAnual', this.precioAnual.toString());
      localStorage.setItem('precioMensual', this.precioMensual.toString());
      localStorage.setItem('descripcionPlan', this.descripcionPlan);

      if (this.edad >= 50) {
        // Guardo beneficios pmayor de 60 y direcciono a la propuesta

        if (parseInt(localStorage.getItem('propuestaId')) == 0) {
          arrSend.push({
            "curp": localStorage.getItem('curp'),
            "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
            "beneficios": JSON.parse(localStorage.getItem('beneficios')),
          })
        } else {
          arrSend.push({
            "propuestaId": localStorage.getItem('propuestaId'),
            "servicioBeneficiarioId": this.serviciobeneficiarioid,
            "curp": localStorage.getItem('curp'),
            "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
            "beneficios": JSON.parse(localStorage.getItem('beneficios')),
          })
        }

        this.api.loginapp().pipe(first()).subscribe((data: any) => {
          this.api.postCuestionario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
            console.log(data);

            if (data.propuesta) {

              localStorage.setItem('tipoplanId', this.tipoplanId.toString());
              localStorage.setItem('precioAnual', this.precioAnual.toString());
              localStorage.setItem('precioMensual', this.precioMensual.toString());
              localStorage.setItem('propuestaId', data.propuesta['propuestaId']);
              localStorage.setItem('descripcionPlan', this.descripcionPlan);

              arrSendPropuesta.push({
                "propuestaId": data.propuesta['propuestaId'],
                "frecuenciaPagoId": 65,
                "tipoPlanId": this.tipoplanId,
                "formaPagoId": 20
              });

              this.api.postAceptarPropuesta(JSON.stringify(arrSendPropuesta[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
                console.log(data);
                if (data.servicioContratadoId) {
                  this.spinner.hide();
                  this.router.navigate(["./pages/propuesta"]);
                }
              });

            }
          },
            (error) => { }
          );
        });

      } else {
        // console.log(this.tipoplanId);
        this.spinner.hide();
        this.router.navigate(["./pages/formulario-eligibilidad"]);
      }
    }
    // console.log(this.beneficios);
    if (this.edad >= 50 && this.index == 3) {
      stepper.next();
      stepper.next();
      this.index++;
      this.index++;
    } else {
      stepper.next();
      this.index++;
    }
  }

  changeImg(indexBeneficios, i, beneficio, tipobeneficiarioid, imagenactivo) {
    let plan = [];
    this.arrSeleccionados.push(parseInt(tipobeneficiarioid));


    let seleccionado = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i].esseleccionado;
    let arr = this.arrBeneficios[indexBeneficios]['beneficiosbeneficiarios'][i];

    // // Cambio la imagen
    !seleccionado ? arr.imagendefault = arr.imagenactivo : arr.imagendefault = arr.imageninactivo;

    // // Cambio la bandera de selecci??n
    !arr.esseleccionado ? arr.esseleccionado = true : arr.esseleccionado = false;


    // Preselecciono env??o de dinero
    this.arrBeneficios[4]['beneficiosbeneficiarios'][i].esseleccionado = true;

    if (arr.esseleccionado) {
      // Repatriaci??n
      if (beneficio == 1) {
        this.countRepatriacion++;
        if (this.edad <= 56) {
          // Menores de 56
          // "Plan de Acceso para Titular menor de 56 a??os" Id: 1
          //"Plan de Acceso para Titular menor de 56 a??os (pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 3
          //"Plan de Acceso para Titular menor de 56 a??os (con padres, pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 5
          // Obtengo beneficio 1
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);
          // Busco si la pareja o hijos est??n seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres est??n seleccionados
          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 3);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else {
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 1);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          }
        } else {
          // Mayor de 56
          // "Plan de Acceso para Titular mayor de 56 a??os" Id: 2
          // "Plan de Acceso para Titular mayor de 56 a??os (con pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 4
          // Obtengo beneficio 1
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);
          // Busco si la pareja o hijos est??n seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres est??n seleccionados

          if (arrParejaHijo.length > 0) {
            // Pareja e hijos seleccionados sin padres
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 4);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else {
            // S??lo titular
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 2);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          }
        }
        // Servicios funerarios
      } else if (beneficio == 2) {
        if (this.countRepatriacion == 1) {
          // S??lo titular en repatriaci??n
          if (this.edad <= 56) {
            // Menor de 56
            // "Plan de Acceso para Titular menor de 56 a??os (con padres, pareja y/o hijos en M??xico) s??lo el titular requiere Repatriaci??n" Id: 8
            // "Plan de Acceso para Titular  menor de 56 a??os (con pareja y/o hijos en M??xico) s??lo titular requiere Repatriaci??n" Id: 6
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 6);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 8);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 8);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 1);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          } else {
            // Mayor de 56
            // "Plan de Acceso para Titular mayor de 56 a??os" Id: 2
            // "Plan de Acceso para Titular mayor de 56 a??os (con pareja y/o hijos en M??xico) s??lo titular requiere Repatriaci??n" Id: 7
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0) {
              // Pareja e hijos seleccionados sin padres
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 7);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              // S??lo titular
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 2);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          }
        } else {
          // M??s de un miembro en repatriaci??n.
          // "Plan de Acceso para Titular menor de 56 a??os" Id: 1
          //"Plan de Acceso para Titular menor de 56 a??os (pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 3
          //"Plan de Acceso para Titular menor de 56 a??os (con padres, pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 5
          if (this.edad <= 56) {
            // Menor de 56
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 3);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 1);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          } else {
            // Mayor de 56.
            // "Plan de Acceso para Titular mayor de 56 a??os" Id: 2
            // "Plan de Acceso para Titular mayor de 56 a??os (con pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 4
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0) {
              // Pareja e hijos seleccionados sin padres
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 4);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              // S??lo titular
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 2);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          }
        }
      }
    } else {

      // Repatriaci??n
      if (beneficio == 1) {
        this.countRepatriacion--;
        if (this.edad <= 56) {
          // Menores de 56
          // "Plan de Acceso para Titular menor de 56 a??os" Id: 1
          // "Plan de Acceso para Titular menor de 56 a??os (pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 3
          // "Plan de Acceso para Titular menor de 56 a??os (con padres, pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 5
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);

          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));

          let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

          if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
            // Pareja y/o hijos
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 3);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
            // Padres
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
            // Parej, Hijos y/o padres
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else {
            // Titular
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 1);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          }
        } else {
          // Mayor de 56
          // "Plan de Acceso para Titular mayor de 56 a??os" Id: 2
          // "Plan de Acceso para Titular mayor de 56 a??os (con pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 4
          // Obtengo beneficio 1
          let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 1);
          // Busco si la pareja o hijos est??n seleccionados
          let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
          // Busco si los padres est??n seleccionados

          if (arrParejaHijo.length > 0) {
            // Pareja e hijos seleccionados sin padres
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 4);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          } else {
            // S??lo titular
            let index = this.arrPlan.findIndex(x => x.tipoplanId == 2);
            this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
          }
        }
        // Servicios funerarios
      } else if (beneficio == 2) {
        if (this.countRepatriacion == 1) {
          // S??lo titular en repatriaci??n
          if (this.edad <= 56) {
            // Menor de 56
            // "Plan de Acceso para Titular menor de 56 a??os (con padres, pareja y/o hijos en M??xico) s??lo el titular requiere Repatriaci??n" Id: 8
            // "Plan de Acceso para Titular  menor de 56 a??os (con pareja y/o hijos en M??xico) s??lo titular requiere Repatriaci??n" Id: 6
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 6);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 8);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 8);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 1);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          } else {
            // Mayor de 56
            // "Plan de Acceso para Titular mayor de 56 a??os" Id: 2
            // "Plan de Acceso para Titular mayor de 56 a??os (con pareja y/o hijos en M??xico) s??lo titular requiere Repatriaci??n" Id: 7
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0) {
              // Pareja e hijos seleccionados sin padres
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 7);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              // S??lo titular
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 2);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          }
        } else {
          // M??s de un miembro en repatriaci??n.
          // "Plan de Acceso para Titular menor de 56 a??os" Id: 1
          //"Plan de Acceso para Titular menor de 56 a??os (pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 3
          //"Plan de Acceso para Titular menor de 56 a??os (con padres, pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 5
          if (this.edad <= 56) {
            // Menor de 56
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0 && arrPadres.length == 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 3);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length == 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else if (arrParejaHijo.length > 0 && arrPadres.length > 0) {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 5);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 1);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          } else {
            // Mayor de 56.
            // "Plan de Acceso para Titular mayor de 56 a??os" Id: 2
            // "Plan de Acceso para Titular mayor de 56 a??os (con pareja y/o hijos) m??s de una persona requiere Repatriaci??n" Id: 4
            // Obtengo beneficio 2
            let arrBen = this.arrBeneficios.filter(e => e.beneficioid == 2);
            // Busco si la pareja o hijos est??n seleccionados
            let arrParejaHijo = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 19 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 16 && e.esseleccionado == true)));
            // Busco si los padres est??n seleccionados
            let arrPadres = arrBen[0].beneficiosbeneficiarios.filter(e => (e.tipobeneficiarioid == 17 && e.esseleccionado == true) || ((e.tipobeneficiarioid == 18 && e.esseleccionado == true)));

            if (arrParejaHijo.length > 0) {
              // Pareja e hijos seleccionados sin padres
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 4);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            } else {
              // S??lo titular
              let index = this.arrPlan.findIndex(x => x.tipoplanId == 2);
              this.precioMensual = this.arrPlan[index].precioMensual;
            this.precioAnual = this.arrPlan[index].precioAnual;
            this.tipoplanId = this.arrPlan[index].tipoplanId;
            this.descripcionPlan = this.arrPlan[index].descripcionPlan;
            }
          }
        }
      }
    }


    if (beneficio == 5) {
      // Bebeficio Env??o de dinero
      if (tipobeneficiarioid == 19) {
        this.openSnackBarHijo();
      }
      this.envioDineroSelected = true;
      this.arrBeneficios.forEach(element => {
        element['beneficiosbeneficiarios'].forEach(bb => {
          if (element.beneficioid == 5) {
            if ((bb.imagenactivo != imagenactivo) && bb.esseleccionado) {
              bb.esseleccionado = false;
              bb.activo = true;
              bb.imagendefault = bb.imageninactivo;
            } else if (bb.imagenactivo == imagenactivo) {
              bb.esseleccionado = true;
              bb.activo = true;
              bb.imagendefault = bb.imagenactivo;
            }
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

    localStorage.setItem("edad", yearsDiff.toString());
    this.edad = yearsDiff;

    this.sexo = this.s1.curp.value.slice(10, 11);
    localStorage.setItem("sexo", this.sexo);

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
    this._snackBar.open('??Atenci??n! La opci??n seleccionada no corresponde a tu edad.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  openSnackBarHijo() {
    this._snackBar.open('??Atenci??n! El beneficiario debe ser mayor de 18 a??os.', 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
