import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-datos-formulario',
  templateUrl: './datos-formulario.component.html',
  styleUrls: ['./datos-formulario.component.scss']
})
export class DatosFormularioComponent implements OnInit {

  miembroFamilia = '';

  config = {
    animated: true
  };

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  openModal(content, miembro) {
    this.miembroFamilia = miembro;
    this.modalService.open(content, {
      size: "sm",
      centered: true,
      scrollable: true,
      animation: true,
      backdrop: true,
    });
  }

}
