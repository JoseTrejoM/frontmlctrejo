import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {ApiService} from '../../../shared/services/api.service';

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
  constructor(
    private api: ApiService,
    public router: Router
  ) {

    this.getPreguntas();

  }

  ngOnInit(): void {
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
              respuesta: ''
            }
          )
        });
        console.log(this.cuestionario);
        this.cuestionario.sort((a,b) => (a.orden > b.orden) ? 1 : ((b.orden > a.orden) ? -1 : 0))
      },
      (error) => { }
    );
  }

  changeStep(stepper, index){
    this.cuestionario[index].respuesta = this.respuesta;
    console.log(this.cuestionario);

    if (index == this.cuestionario.length - 1) {
      this.router.navigate(["/pages/propuesta"]);
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
