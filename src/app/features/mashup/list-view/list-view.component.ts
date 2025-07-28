import { Component, ComponentRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-list-view',
  imports: [],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css'
})


export class ListViewComponent{
  constructor(private router: Router) {}
  
  @ViewChild('item', { read: ViewContainerRef }) item!: ViewContainerRef;

  @Input()
  set setItems(items: Item[]){
    if(this.item)
      this.item.clear();  
    for(var val of items){
      const componentRef = this.item.createComponent(ItemComponent);
      componentRef.setInput("nombre", val.nombre);
      componentRef.setInput("marca", val.marca);
      componentRef.setInput("categoria", val.categoria);
      componentRef.setInput("estado", val.estado);
      componentRef.setInput("img", val.img);
    }
  }

  navigateTo(): void {
    this.router.navigate(["inventory/items/new"]);
  }

}

interface Item {
  nombre: string;
  marca: string;
  categoria: string;
  estado: string;
  img: string;
}