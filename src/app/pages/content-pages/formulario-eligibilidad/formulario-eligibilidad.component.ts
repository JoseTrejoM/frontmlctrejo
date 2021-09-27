import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {ApiService} from '../../../shared/services/api.service';
import {JwtHelperService} from '@auth0/angular-jwt';
const helper = new JwtHelperService();

@Component({
  selector: 'app-formulario-eligibilidad',
  templateUrl: './formulario-eligibilidad.component.html',
  styleUrls: ['./formulario-eligibilidad.component.scss']
})
export class FormularioEligibilidadComponent implements OnInit {


  showBtnContinuar = false;
  index = 0;
  cuestionario: any [] = [];
  respuestas: any [] = [];
  respuesta: string;
  cuestionarioLocal = [];
  decodedToken = this.jwtHelper.decodeToken(this.api.currentTokenValue);
  public selection: string;
  arrPropuesta: any;
  serviciobeneficiarioid: any;

  constructor(
    private api: ApiService,
    public router: Router,
    public jwtHelper: JwtHelperService
  ) {
    if (parseInt(localStorage.getItem('propuestaId')) == 0) {
      this.cuestionarioLocal = [];
    } else {
      this.cuestionarioLocal = JSON.parse(localStorage.getItem("cuestionario"));
    }
    console.log(this.api.currentTokenValue);
    console.log(this.cuestionarioLocal);


      this.api.loginapp().pipe(first()).subscribe((data: any) => {
        this.getPreguntas();
        this.getPropuesta();
      });

  }

  ngOnInit(): void {
  }

  getPropuesta() {
      this.api.getPropuesta(localStorage.getItem('curp'), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
        this.arrPropuesta = data
        if (data.propuestaid > 0) {
          this.arrPropuesta['beneficios'].forEach((element, index) => {
            if (element.beneficioid == 1) {
              element.beneficiosbeneficiarios.forEach(bb => {
                if (bb.tipobeneficiarioid == 15) {
                  this.serviciobeneficiarioid = bb.serviciobeneficiarioid
                }
              });
            }
          });
        }
      });
  }

  checkToken() {
    if (helper.isTokenExpired(this.api.currentTokenValue)) {
      this.api.loginapp().pipe(first()).subscribe((data: any) => {});
    }
  }

  getPreguntas() {
    this.api.getCuestionario(1, this.api.currentTokenValue).pipe(first()).subscribe((dataCuestionario:any) => {
      console.log(dataCuestionario);
        dataCuestionario['preguntas'].forEach(item => {
          this.cuestionario.push(
            {
              clavePregunta: item.clavePregunta,
              descripcionPregunta: item.descripcionPregunta,
              grupoPreguntasId: item.grupoPreguntasId,
              orden: item.orden,
              preguntaId: item.preguntaId,
              selected: false,
              respuesta: '',
              respuestaId: 0,
            }
          )
        });

        this.cuestionario = this.cuestionario.map(a => {
          const exists = this.cuestionarioLocal.find(b => b.preguntaid == a.preguntaId);

          if (exists) {
            a.selected = true;
            a.respuesta = exists.respuesta;
            a.respuestaId = exists.respuestaid;
          }

          return a;
        });

        this.cuestionario.sort((a,b) => (a.orden > b.orden) ? 1 : ((b.orden > a.orden) ? -1 : 0))
      },
      (error) => { }
    );
  }

  seleccionarRespuesta(index, value) {
    if (this.cuestionario[index].respuesta == 'si') {
    } else {
      this.cuestionario[index].respuesta = value;
    }
  }

  changeStep(stepper, index, value){
    console.log(value);
    let arrSend = [];
    if (index == this.cuestionario.length - 1) {
      this.respuestas=[];




      this.cuestionario.forEach(element => {
        if (parseInt(localStorage.getItem('propuestaId')) == 0) {
          this.respuestas.push(
            {
              "preguntaId": element.preguntaId,
              "respuesta": element.respuesta,
            }
          );
        } else {
          this.respuestas.push(
            {
              "preguntaId": element.preguntaId,
              "respuesta": element.respuesta,
              'respuestaId': element.respuestaId
            }
          );
        }

      });
      if (parseInt(localStorage.getItem('propuestaId')) == 0) {
      arrSend.push({
        "curp": localStorage.getItem('curp'),
        "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
        "beneficios": JSON.parse(localStorage.getItem('beneficios')),
        "respuestas": this.respuestas
      })
    } else {
      arrSend.push({
        "propuestaId": localStorage.getItem('propuestaId'),
        "servicioBeneficiarioId": this.serviciobeneficiarioid,
        "curp": localStorage.getItem('curp'),
        "beneficiarios": JSON.parse(localStorage.getItem('beneficiarios')),
        "beneficios": JSON.parse(localStorage.getItem('beneficios')),
        "respuestas": this.respuestas
      })
    }

        console.log(JSON.stringify(arrSend[0]));

        this.api.loginapp().pipe(first()).subscribe((data: any) => {
          this.api.postCuestionario(JSON.stringify(arrSend[0]), this.api.currentTokenValue).pipe(first()).subscribe((data: any) => {
            console.log(data);

            if (data.plan && data.propuesta) {

              localStorage.setItem('tipoplanId', data.plan['tipoplanId']);
              localStorage.setItem('precioAnual', data.plan['precioAnual']);
              localStorage.setItem('precioMensual', data.plan['precioMensual']);
              localStorage.setItem('propuestaId', data.propuesta['propuestaId']);
              localStorage.setItem('descripcionPlan', data.propuesta['descripcionPlan']);


              this.router.navigate(["./pages/propuesta"]);

            }
            },
            (error) => { }
          );
          });

      // this.router.navigate(["/pages/propuesta"]);
    } else {
      stepper.next();
      this.index++;
    }
  }

  changeStepInicial(stepper){
    stepper.next();
    this.index++;
  }

  save(e) {

  }

}
