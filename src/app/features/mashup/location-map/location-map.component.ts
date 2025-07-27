import { Component, ViewChild} from '@angular/core';
import { MapComponent } from '../../../shared/map/map.component';

@Component({
  selector: 'app-location-map',
  imports: [ MapComponent ],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.css'
})
export class LocationMapComponent {
  location = { lat: -2.891358, lng: -79.037007 };
}
