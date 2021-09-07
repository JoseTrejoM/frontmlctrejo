import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propuesta',
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.scss']
})
export class PropuestaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  changeStep(stepper){
    stepper.next();
  }

}
