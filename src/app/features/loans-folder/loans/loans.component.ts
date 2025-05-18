import { Component, NgModule } from '@angular/core';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { CheckListComponent } from '../../../shared/check-list/check-list.component';
import Swal from 'sweetalert2';
import { NgFor } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-loans',
  imports: [DropdownComponent, CheckListComponent],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css',
})
export class LoansComponent {
  
  placesOriginOptions: string[] = [];
  itemOptions: string[] = [];
  placesDestinationOptions: string[] = [];
  selectedPlace: string = "";
  
  placesData = [
    {
      campus: "Balzay", 
      aula: "Laboratorio HCI"
    },
    {
      campus: "Balzay", 
      aula: "Laboratorio de Redes"
    },
    {
      campus: "Balzay", 
      aula: "C105"
    },
    {
      campus: "Balzay", 
      aula: "C106"
    },
  ];

  itemTypesData = ["Pc Imac", "Proyector"]

  itemsData = {
    'Laboratorio HCI': [
      {id: 1234, tipo: "PC Imac", estado: "bueno"},
      {id: 1235, tipo: "PC Imac", estado: "bueno"},
      {id: 1236, tipo: "PC Imac", estado: "bueno"},
      {id: 1237, tipo: "PC Imac", estado: "bueno"},
      {id: 1238, tipo: "PC Imac", estado: "bueno"}
    ]
  }

  ngOnInit() {
    this.placesOriginOptions = this.placesData.map(place => `${place.campus} - ${place.aula}`);
    this.itemOptions = this.itemTypesData;
    this.placesDestinationOptions = this.placesData.map(place => `${place.campus} - ${place.aula}`);
  }

  showAlert() {
  Swal.fire({
    title: '¿Deseas registrar este préstamo?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('¡Hecho!', 'El registro se realizó correctamente.', 'success');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelado', 'No se realizó ninguna acción', 'error');
    }
  });
}

}
