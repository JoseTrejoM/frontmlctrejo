import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiService } from '../../../shared/services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import * as _ from 'lodash';

@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.scss']
})
export class PropuestaComponent implements OnInit {

  precioAnual = '0';
  precioMensual = '0';
  arrBeneficios = [];
  arrBeneficiosSeleccionados = [];
  arrTabla = [];
  tipoPago = 0;
  arrResumen = [];
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);

  constructor(
    private api: ApiService,
    public router: Router,
    private ref: ChangeDetectorRef,
    public jwtHelper: JwtHelperService

  ) {

    this.precioAnual = localStorage.getItem('precioAnual');
    this.precioMensual = localStorage.getItem('precioMensual');


      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.getResumenPropuesta();
      });


  }

  ngOnInit(): void {
  }

  getResumenPropuesta() {
    this.arrResumen = [];
    console.log('Entra');
    this.api.getResumenPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
      console.log(data);

      this.precioMensual = data.mensual ? data.mensual : localStorage.getItem('precioAnual');
      this.precioAnual = data.anual ? data.anual : localStorage.getItem('precioMensual');
      this.arrResumen = data.beneficiarios;
      this.ref.detectChanges();
    });
  }

  getSeleccionados(tipo) {

    let arr = this.arrTabla.filter(function (e) {
      return e.tipobeneficiario == tipo;
    });

    arr = [...new Map(arr.map(item =>
      [item['beneficioid'], item])).values()];

    if (tipo != 'Titular') {
      arr.push({
        beneficioid: 3,
        esseleccionado: false
      });
    }
    arr.sort((a, b) => (a.beneficioid > b.beneficioid) ? 1 : ((b.beneficioid > a.beneficioid) ? -1 : 0));
    console.log(arr);
    return arr
  }

  changeTipoPago(id) {
    this.tipoPago = id;
  }

  aceptarPropuesta() {
    let arrSend = [];
    arrSend.push({
      "propuestaId": localStorage.getItem('propuestaId'),
      "frecuenciaPagoId": this.tipoPago,
      "tipoPlanId": localStorage.getItem('tipoplanId'),
      "formaPagoId": this.tipoPago
    });


      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.api.postAceptarPropuesta(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
          console.log(data);
          if (data.servicioContratadoId) {
            localStorage.setItem('servicioContratadoId', data.servicioContratadoId);
            this.router.navigate(["./pages/datos-formulario"]);
          }
        });
      });
  }

  changeStep(stepper) {
    stepper.next();
  }

}
