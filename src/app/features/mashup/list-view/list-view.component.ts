import { Component, ComponentRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-view',
  imports: [],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})
export class ListViewComponent{
  constructor(private router: Router) {}
  
  @ViewChild('item', { read: ViewContainerRef }) item!: ViewContainerRef;

  placeInventory = {
    place: {
      id: "Laboratorio hci"
    },
    inventory:[
      {
        id: "1234",
        nombre: "Imac",
        lugar: "Laboratorio HCI",
        item: "PC",
        estado: "bueno",
        fecha: "14/04/2025",
        img: "https://i0.wp.com/tgcomputer.net/wp-content/uploads/2021/09/719wkcjcgfl-_sl1500_-RG-a4.jpg?fit=1500%2C1500&ssl=1"
      },
      {
        id: "1235",
        nombre: "Imac",
        lugar: "Laboratorio HCI",
        item: "PC",
        estado: "bueno",
        fecha: "14/04/2025",
        img: "https://i0.wp.com/tgcomputer.net/wp-content/uploads/2021/09/719wkcjcgfl-_sl1500_-RG-a4.jpg?fit=1500%2C1500&ssl=1"
      },
      {
        id: "1236",
        nombre: "Imac",
        lugar: "Laboratorio HCI",
        item: "PC",
        estado: "bueno",
        fecha: "14/04/2025",
        img: "https://i0.wp.com/tgcomputer.net/wp-content/uploads/2021/09/719wkcjcgfl-_sl1500_-RG-a4.jpg?fit=1500%2C1500&ssl=1"
      },
      {
        id: "1237",
        nombre: "Imac",
        lugar: "Laboratorio HCI",
        item: "PC",
        estado: "bueno",
        fecha: "14/04/2025",
        img: "https://i0.wp.com/tgcomputer.net/wp-content/uploads/2021/09/719wkcjcgfl-_sl1500_-RG-a4.jpg?fit=1500%2C1500&ssl=1"
      },
    ]
  }

  @Input()
  set placeName(place: string){
    if(place?.trim().toLocaleLowerCase() === this.placeInventory.place.id.trim().toLocaleLowerCase()){
      if(this.item)
        this.item.clear();  
      for(var val of this.placeInventory.inventory){
        const componentRef = this.item.createComponent(ItemComponent);
        componentRef.setInput("nombre", val.nombre);
        componentRef.setInput("lugar", val.lugar);
        componentRef.setInput("item", val.item);
        componentRef.setInput("estado", val.estado);
        componentRef.setInput("fecha", val.fecha);
        componentRef.setInput("img", val.img);
      }
    }else{
      if(this.item)
        this.item.clear();  
    }
    
  }

  navigateTo(): void {
    this.router.navigate(["/inventory/inventories/new"]);
  }

}