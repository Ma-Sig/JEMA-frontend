import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map',
  imports: [ CommonModule ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() coordinates: { lat: number; lng: number } | null = null;
  @Input() interactive: boolean = false;
  @Input() allowMarker: boolean = true;
  @Output() coordinateSelected = new EventEmitter<{ lat: number; lng: number }>();

  private map: any;
  private marker: any;

  selectedCoords: { lat: number; lng: number } | null = null;

  // ID único para cada instancia del mapa
  mapId: string = 'map-' + Math.random().toString(36).substring(2, 9);

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;

    const L = await import('leaflet');

    // Esperar que el div con id this.mapId esté en el DOM
    await this.waitForMapContainer();

    this.map = L.map(this.mapId, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true
    }).setView(this.coordinates || { lat: -2.9, lng: -79.0 }, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

    if (this.coordinates) {
      this.marker = L.marker(this.coordinates).addTo(this.map);
    }

    this.updateClickListener();

    requestAnimationFrame(() => {
      if (this.map && this.map._container.offsetParent !== null) {
        this.map.invalidateSize();
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allowMarker'] && this.map) {
      this.updateClickListener();
    }
  }

  private updateClickListener() {
    this.map.off('click', this.onMapClick);
    if (this.allowMarker) {
      this.map.on('click', this.onMapClick);
    }
  }

  // Función para esperar que el contenedor exista en el DOM
  waitForMapContainer(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (document.getElementById(this.mapId)) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }

  setMarker(coords: { lat: number; lng: number }) {
    if (this.marker) {
      this.marker.setLatLng(coords);
    } else {
      const L = (window as any).L;
      this.marker = L.marker(coords).addTo(this.map);
    }
  }

  onMapClick = (e: any) => {
    const coords = e.latlng;
    this.setMarker(coords);
    this.coordinateSelected.emit(coords);
    this.selectedCoords = coords;
  };

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      const container = document.getElementById(this.mapId);
      if (container && (container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }
    }
  }
  
}
