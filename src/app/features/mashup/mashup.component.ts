import { Component } from '@angular/core';
import { LocationMapComponent } from './location-map/location-map.component';
import { ListViewComponent } from './list-view/list-view.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MashupService } from './services/mashup.service';

@Component({
  selector: 'app-mashup',
  imports: [LocationMapComponent, ListViewComponent, SearchBarComponent],
  templateUrl: './mashup.component.html',
  styleUrl: './mashup.component.css'
})
export class MashupComponent {
  coord: { lat: number; lng: number } = { lat: -2.891358, lng: -79.037007 };
  items: Item[] = [];

  constructor(private service: MashupService){}

  onSearch(place: string) {
    console.log("Se obtiene en el padre: ", place);
    this.setData(place);
  }

  setData(place: string) {
    
    this.service.getPlaceByName(place).subscribe({
      next: (res) =>{
        console.log('Datos', res)
        this.loadItems(res.id_lugar);
        if(res.coordenadas){
          const coords = res.coordenadas.coordinates;
          const lng = coords[0]; // longitud
          const lat = coords[1]; // latitud

          this.coord = { lat, lng };
          console.log('Coordenadas:', this.coord);
          
        }
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      }
    });
  }

  loadItems(placeId: number) {
    console.log("Desde servicios id_lugar:", placeId); 
    if(placeId){
      this.service.getItemsByPlaceId(placeId).subscribe({
        next: (res) =>{
          const itemsAux: Item[] = [];
          for(var value of res){
            const image = value.caracteristicas.imagen;
            let urlImage!: string;
            if (image){
              urlImage = 'data:image/jpeg;base64,' + value.caracteristicas.imagen;
            }
            itemsAux.push(
              {
                nombre: value.caracteristicas.nombre,
                marca: value.caracteristicas.marca,
                categoria: value.caracteristicas.categoria,
                estado: value.estadoItem.estado,
                img: urlImage
              }
            );
          }
          this.items = itemsAux;

        },
        error: (error) => {
          console.error('Error al obtener datos:', error);
        }
      })
    }
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  }

}

interface Item {
  nombre: string;
  marca: string;
  categoria: string;
  estado: string;
  img: string;
}