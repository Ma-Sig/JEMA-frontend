import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../../shared/input-field/input-field.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TextareaFieldComponent } from '../../../shared/textarea-field/textarea-field.component';

import Swal from 'sweetalert2';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { ModalsService } from '../services/modals.service';

interface LugarPadre {
  id_lugar: number;
  nombre: string;
}

interface Lugar {
  id_lugar?: number;
  id_lugar_padre: number;
  nombre: string;
  descripcion: string;
  lugarPadre: LugarPadre;
  coordenadas?: string;
}

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [
    CommonModule,
    InputFieldComponent,
    ButtonComponent,
    TextareaFieldComponent,
    DropdownComponent,
  ],
  templateUrl: './location-modal.component.html',
  styleUrl: './location-modal.component.css',
})
export class LocationModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() emitDataSelected = new EventEmitter<any>();

  locationName: string = '';
  coordinates: string = '';
  description: string = '';
  places: Lugar[] = [];
  fatherPlace: Lugar | null = null;

  coordinatesRegex: RegExp = /^[+-]?\d+(?:\.\d+)?, [+-]?\d+(?:\.\d+)?$/;

  constructor(private modalsService: ModalsService) {}

  ngOnInit(): void {
    this.getSystemData();
  }

  private getSystemData(): void {
    this.modalsService.getPlaces().then((places: Lugar[]) => {
      this.places = places;
    });
  }

  public close() {
    if (!this.validate()) {
      return;
    }

    const request: any = {
      id_lugar_padre: this.fatherPlace ? this.fatherPlace.id_lugar : null,
      nombre: this.locationName,
      descripcion: this.description,
      ...(this.coordinates !== '' && {
        coordenadas: {
          type: 'Point',
          coordinates: this.coordinates.split(',').map(Number),
        },
      }),
    };

    console.log('Request to create place:', request);

    this.modalsService.createPlace(request).then((response) => {
      this.emitDataSelected.emit(response);

      // Reset the form fields
      this.fatherPlace = null;
      this.locationName = '';
      this.coordinates = '';
      this.description = '';

      this.isOpen = false;
      this.isOpenChange.emit(this.isOpen);
    });
  }

  public closeWithoutSave() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);

    // Reset the form fields
    this.fatherPlace = null;
    this.locationName = '';
    this.coordinates = '';
    this.description = '';
  }

  private validate() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    if (!this.locationName) {
      Toast.fire({
        icon: 'error',
        title: 'El nombre de la ubicación es obligatorio',
      });
      return false;
    }
    if (!this.description) {
      Toast.fire({
        icon: 'error',
        title: 'La descripción es obligatoria',
      });
      return false;
    }

    return true;
  }

  open() {
    this.isOpen = true;
    this.isOpenChange.emit(this.isOpen);
  }

  public onPlaceChange(place: Lugar) {
    console.log('Lugar seleccionado:', place);
    this.fatherPlace = place;
  }

  public onLocationNameChange(value: string) {
    this.locationName = value;
  }

  public onCoordinatesChange(value: string) {
    this.coordinates = value;
  }

  public onDescriptionChange(value: string) {
    this.description = value;
  }
}
