import { Component, Input} from '@angular/core';
import { MapComponent } from '../../../shared/map/map.component';

@Component({
  selector: 'app-location-map',
  imports: [ MapComponent ],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.css'
})
export class LocationMapComponent {
  currentLocation = { lat: -2.891358, lng: -79.037007 };

  @Input()
  set location(coord: { lat: number, lng: number }){
    if(coord){
      console.log('Nueva ubicación recibida:', coord);
      this.currentLocation = {lat: coord.lat, lng: coord.lng};
    }
  }

}
