import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, filter } from 'rxjs/operators';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { setTheme } from 'ngx-bootstrap/utils';
import * as moment from 'moment';


@Component({
  selector: 'app-datos-formulario',
  templateUrl: './datos-formulario.component.html',
  styleUrls: ['./datos-formulario.component.scss']
})
export class DatosFormularioComponent implements OnInit {

  miembroFamilia = '';
  precioAnual = '0';
  precioMensual = '0';
  arrBeneficios = [];
  arrBeneficiosSeleccionados = [];
  arrTabla = [];
  tipoPago = 0;
  paises = [];
  estados = [];
  estadosEU = [];
  sexos = [
    {
      sexo: 'Masculino',
      sexoid: 46
    },
    {
      sexo: 'Femenino',
      sexoid: 45
    }
  ];
  maxDate = new Date();
  submitted = false;
  submittedP = false;
  submitted2 = false;
  frm: FormGroup;
  frmP: FormGroup;
  frm2: FormGroup;
  tipobeneficiarioid = 0;
  arrBeneficiarios = [];
  formlarioCompleto = false;
  countCompleto = 0;
  index = 1;
  arrResumen = [];
  personaId = 0;
  plan =[];

  sexo = 'Sexo'

  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);

  config = {
    animated: true
  };

  constructor(
    private modalService: NgbModal,
    private api: ApiService,
    public router: Router,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public jwtHelper: JwtHelperService,
    private route: ActivatedRoute

  ) {

    setTheme('bs4');
    this.maxDate.setDate(this.maxDate.getDate());

      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.getPais();
        this.getEstadosMexico(142);
        this.getData();
        this.getResumenPropuesta();
        this.getPropuesta();
      });

  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nombre: ["", Validators.required],
      apaterno: ["", Validators.required],
      amaterno: ["", Validators.required],
      telefono: ["",  [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      correo: ["", Validators.required],
      fnacimiento: ["", Validators.required],
      sexo: ["", Validators.required],
      estado: ["0", Validators.required],
      estadoEU: ["0", Validators.required],
      pais: ["0", Validators.required],
    });

    this.frmP = this.formBuilder.group({
      nombreP: ["", Validators.required],
      apaternoP: ["", Validators.required],
      amaternoP: ["", Validators.required],
      telefonoP: ["",  [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      correoP: ["", Validators.required],
      fnacimientoP: ["", Validators.required],
      sexoP: ["0", Validators.required],
      estadoP: ["0", Validators.required],
    });

    this.frm2 = this.formBuilder.group({
      nombre2: ["", Validators.required],
      apaterno2: ["", Validators.required],
      amaterno2: ["", Validators.required],
      telefono2: ["",  [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],],
      correo2: ["", Validators.required],
      fnacimiento2: ["", Validators.required],
      sexo2: ["0", Validators.required],
    });
  }

  get f() {
    return this.frm.controls;
  }

  get f2() {
    return this.frm2.controls;
  }

  get fP() {
    return this.frmP.controls;
  }

  checkToken() {
    // if (helper.isTokenExpired(this.api.currentTokenValue)) {
    //   this.api.loginapp().pipe(first()).subscribe((data: any) => { });
    // }
  }

  getData() {
    this.arrBeneficiarios = [];
    this.api.getDataBeneficiariosById(localStorage.getItem('propuestaId'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);

      data.beneficiario = [...new Map(data.beneficiario.map(item =>
        [item['tipoBeneficiarioId'], item])).values()];

        data.beneficiario.forEach((element, index) => {

        element.fechaNacimiento ? element.fechaNacimiento = element.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '') : '';

        if (element.tipoBeneficiarioId == 15) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId && element.telefono && element.correo
            && element.estadoOrigenId && element.estadoTrabajoId && element.paisTrabajoId) {
            element.completo = true;
            this.countCompleto++;
          }
        } else if (element.tipoBeneficiarioId == 16) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId && element.telefono && element.correo
            && element.estadoOrigenId) {
            element.completo = true;
            this.countCompleto++;
          }

        } else if (element.tipoBeneficiarioId > 16) {
          if (element.apellidoMaterno && element.apellidoPaterno && element.fechaNacimiento
            && element.nombre && element.sexoId && element.telefono && element.correo) {
            element.completo = true;
            this.countCompleto++;
          }

        }

        this.countCompleto == data.beneficiario.length ? this.formlarioCompleto = true : this.formlarioCompleto = false;

      });

      this.arrBeneficiarios = data.beneficiario;
      this.ref.detectChanges();
    });
  }

  getResumenPropuesta() {
    this.arrResumen =[];
    this.arrBeneficios = [];
    let arr = [];
    this.api.getResumenPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      this.arrResumen = data.beneficiarios;
      this.arrResumen.forEach(element => {
        element['beneficioSimpleDTO'].forEach(item => {
          if (item.activo) {
            arr.push(
              item.titulobeneficio
            );
          }
        });
      });

      this.arrBeneficios = [...new Set(arr)];
      this.ref.detectChanges();

    });
  }

  getPropuesta() {
    this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      this.plan = data.plan;
    });
  }

  getPais() {

      this.api.getPais(this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.paises = data;
        this.paises = this.paises.filter(item => item.paisid == 70 || item.paisid == 40);
      });

  }

  getEstadosMexico(idPais) {
    this.estados = [];

      this.api.getEstado(idPais, this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.estados = data;
      });

  }

  getEstadosEU(idPais) {
    this.estadosEU = [];

      this.api.getEstado(idPais, this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.estadosEU = data;
      });

  }

  addUserTitular() {
    this.submitted = true;
    let arrSend = [];
    if (this.frm.invalid || this.frm.value.sexo == 0 ||
      this.frm.value.pais == 0 ||
      this.frm.value.estado == 0) {
      return;
    }
    if (this.personaId == 0) {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm.value.nombre,
        "apellidoPaterno": this.frm.value.apaterno,
        "apellidoMaterno": this.frm.value.amaterno,
        "telefono": this.frm.value.telefono,
        "email": this.frm.value.correo,
        "fechaNacimiento": this.frm.value.fnacimiento,
        "sexo": this.frm.value.sexo,
        "paisOrigenId": 142,
        "estadoOrigenId": this.frm.value.estado,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisResidenciaId": this.frm.value.pais,
        "estadoResidenciaId": this.frm.value.estadoEU,
      });
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.addUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          console.log(data);
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });
    } else {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm.value.nombre,
        "apellidoPaterno": this.frm.value.apaterno,
        "apellidoMaterno": this.frm.value.amaterno,
        "telefono": this.frm.value.telefono,
        "email": this.frm.value.correo,
        "fechaNacimiento": this.frm.value.fnacimiento,
        "sexo": this.frm.value.sexo,
        "paisOrigenId": 142,
        "estadoOrigenId": this.frm.value.estado,
        "propuestaId": localStorage.getItem('propuestaId'),
        "paisResidenciaId": this.frm.value.pais,
        "estadoResidenciaId": this.frm.value.estadoEU,
        "personaId": this.personaId,
      });
      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.addUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          console.log(data);
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });
    }


  }

  addUserPareja() {
    this.submittedP = true;
    let arrSend = [];
    if (this.frmP.invalid || this.frmP.value.sexo == 0) {
      return;
    }
    if (this.personaId == 0) {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frmP.value.nombreP,
        "apellidoPaterno": this.frmP.value.apaternoP,
        "apellidoMaterno": this.frmP.value.amaternoP,
        "telefono": this.frmP.value.telefonoP,
        "email": this.frmP.value.correoP,
        "fechaNacimiento": this.frmP.value.fnacimientoP,
        "sexo": this.frmP.value.sexoP,
        "paisOrigenId": 142,
        "estadoOrigenId": this.frmP.value.estadoP,
        "propuestaId": localStorage.getItem('propuestaId'),
      });
        this.api.loginapp().pipe(first()).subscribe((data: any) => {
          this.api.addUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
            if (data.personaFisica) {
              this.modalService.dismissAll();
              this.reloadCurrentRoute();
            }
          });
        });
      } else {
        arrSend.push({
          "tipoBeneficiarioId": this.tipobeneficiarioid,
          "nombre": this.frmP.value.nombreP,
          "apellidoPaterno": this.frmP.value.apaternoP,
          "apellidoMaterno": this.frmP.value.amaternoP,
          "telefono": this.frmP.value.telefonoP,
          "email": this.frmP.value.correoP,
          "fechaNacimiento": this.frmP.value.fnacimientoP,
          "sexo": this.frmP.value.sexoP,
          "paisOrigenId": 142,
          "estadoOrigenId": this.frmP.value.estadoP,
          "propuestaId": localStorage.getItem('propuestaId'),
          "personaId": this.personaId,
        });
          this.api.loginapp().pipe(first()).subscribe((data: any) => {
            this.api.updateUserTitularPareja(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
              if (data.personaFisica) {
                this.modalService.dismissAll();
                this.reloadCurrentRoute();
              }
            });
          });
      }

  }

  addUserPadres() {
    this.submitted2 = true;
    let arrSend = [];
    if (this.frm2.invalid || this.frm2.value.sexo2 == 0) {
      return;
    }

    if (this.personaId == 0) {
      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm2.value.nombre2,
        "apellidoPaterno": this.frm2.value.apaterno2,
        "apellidoMaterno": this.frm2.value.amaterno2,
        "telefono": this.frm2.value.telefono2,
        "email": this.frm2.value.correo2,
        "fechaNacimiento": this.frm2.value.fnacimiento2,
        "sexo": this.frm2.value.sexo2,
        "propuestaId": localStorage.getItem('propuestaId'),
      });

      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.addUserBeneficiario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });
    } else {

      arrSend.push({
        "tipoBeneficiarioId": this.tipobeneficiarioid,
        "nombre": this.frm2.value.nombre2,
        "apellidoPaterno": this.frm2.value.apaterno2,
        "apellidoMaterno": this.frm2.value.amaterno2,
        "telefono": this.frm2.value.telefono2,
        "email": this.frm2.value.correo2,
        "fechaNacimiento": this.frm2.value.fnacimiento2,
        "sexo": this.frm2.value.sexo2,
        "propuestaId": localStorage.getItem('propuestaId'),
        "personaId": this.personaId,

      });

      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.updateUserBeneficiario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          if (data.personaFisica) {
            this.modalService.dismissAll();
            this.reloadCurrentRoute();
          }
        });
      });

    }

  }

  openModal(content, item) {
    this.miembroFamilia = item.tipoBeneficiario;
    this.tipobeneficiarioid = item.tipoBeneficiarioId;
    item.personaId ? this.personaId = item.personaId : 0;

    if (item.tipoBeneficiarioId == 15) {
      this.frm.patchValue(
        {
          'nombre': item.nombre ? item.nombre : '',
          'apaterno': item.apellidoPaterno ? item.apellidoPaterno : '',
          'amaterno': item.apellidoMaterno ? item.apellidoMaterno : '',
          'fnacimiento': item.fechaNacimiento ? new Date(item.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '')) : '',
          'sexo': item.sexoId ? item.sexoId : '0',
          'telefono': item.telefono ? item.telefono : '',
          'correo': item.correo ? item.correo : '' ,
          'estado': item.estadoOrigenId ? item.estadoOrigenId : '0',
          'estadoEU': item.estadoTrabajoId ? item.estadoTrabajoId : '0',
          'pais': item.paisTrabajoId ? item.paisTrabajoId : '0'
        });
        this.getEstadosEU(item.paisTrabajoId);

    } else if (item.tipoBeneficiarioId == 16) {
      this.frmP.patchValue(
        {
          'nombreP': item.nombre ? item.nombre : '',
          'apaternoP': item.apellidoPaterno ? item.apellidoPaterno : '',
          'amaternoP': item.apellidoMaterno ? item.apellidoMaterno : '',
          'fnacimientoP': item.fechaNacimiento ? new Date(item.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '')) : '',
          'sexoP': item.sexoId ? item.sexoId : '0',
          'telefonoP': item.telefono,
          'correoP': item.correo,
          'estadoP': item.estadoOrigenId ? item.estadoOrigenId : '0',
        });
    } else if (item.tipoBeneficiarioId > 16) {
      this.frm2.patchValue(
        {
          'nombre2': item.nombre ? item.nombre : '',
          'apaterno2': item.apellidoPaterno ? item.apellidoPaterno : '',
          'amaterno2': item.apellidoMaterno ? item.apellidoMaterno : '',
          'fnacimiento2': item.fechaNacimiento ? new Date(item.fechaNacimiento.replace(/-/g, '\/').replace(/T.+/, '')) : '',
          'sexo2': item.sexoId ? item.sexoId : '0',
          'telefono2': item.telefono,
          'correo2': item.correo,
        });
    }


    this.modalService.open(content, {
      size: "sm",
      centered: true,
      scrollable: true,
      animation: true,
      backdrop: true,
    });

    this.reloadCurrentRoute();
  }

  changeStep(stepper) {

    stepper.next();
   this.index++;

  }

  backStep(stepper) {
    stepper.previous();
    this.index--;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
    // this.router.navigate([currentUrl]);
  }

}



