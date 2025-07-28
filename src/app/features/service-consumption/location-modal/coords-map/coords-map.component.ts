import { Component, EventEmitter, Output } from '@angular/core';
import { MapComponent } from '../../../../shared/map/map.component';

@Component({
  selector: 'app-coords-map',
  imports: [ MapComponent ],
  templateUrl: './coords-map.component.html',
  styleUrl: './coords-map.component.css'
})
export class CoordsMapComponent {
  currentLocation = { lat: -2.891358, lng: -79.037007 };
  @Output() coordinateSelected = new EventEmitter<{ lat: number; lng: number }>();

  
  onMapCoordinateSelected(coords: { lat: number; lng: number }) {
    console.log('Reenviando coordenadas desde CoordsMapComponent:', coords);
    this.coordinateSelected.emit(coords);
  }
}
