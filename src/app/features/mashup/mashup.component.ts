import { Component } from '@angular/core';
import { LocationMapComponent } from './location-map/location-map.component';
import { ListViewComponent } from './list-view/list-view.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-mashup',
  imports: [LocationMapComponent, ListViewComponent, SearchBarComponent],
  templateUrl: './mashup.component.html',
  styleUrl: './mashup.component.css'
})
export class MashupComponent {
  
}
