import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { CheckListComponent } from '../../../shared/check-list/check-list.component';
import { ButtonComponent } from '../../../shared/button/button.component';


import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-loans',
  imports: [DropdownComponent, CheckListComponent,CommonModule,ButtonComponent],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css',
})
export class LoansComponent {
  mode: 'create' | 'edit' | 'view' = 'view';
  itemId?: string;
  states: string[] = [];
  selectedState = '';
  selectedType = '';
  types: string[] = [];
  name: string = '';
  description: string = '';
  isModalOpen = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

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

  async ngOnInit(): Promise<void> {
      const data = await firstValueFrom(this.route.data);
      this.mode = data['mode'] ?? 'view';
  
      const params = await firstValueFrom(this.route.paramMap);
      this.itemId = params.get('id') ?? undefined;
  
      this.loadSystemData();
  
      if (this.mode === 'edit' || this.mode === 'view') {
        this.loadItemData();
      }
    }

  loadItemData() {
    console.log('Cargar datos del item con ID:', this.itemId);
    this.placesOriginOptions = this.placesData.map((place) => place.aula);
    this.placesDestinationOptions = this.placesData.map((place) => place.aula);
    this.itemOptions = this.itemsData['Laboratorio HCI'].map((item) => item.tipo);
  }  
  loadSystemData() {
    this.states = ['Nuevo', 'Usado', 'Dañado'];
    this.types = ['Computador', 'Mueble', 'Herramienta'];
  }
  get isReadOnly(): boolean {
      return this.mode === 'view';
    }
  
    get isEdit(): boolean {
      return this.mode === 'edit';
    }
  
    get isCreate(): boolean {
      return this.mode === 'create';
    }
  
    onPriorityChange1(value: string) {
      this.selectedState = value;
      console.log('Prioridad seleccionada:', value);
    }
  
    onPriorityChange2(value: string) {
      this.selectedType = value;
      console.log('Prioridad seleccionada:', value);
    }
  
    addItem() {
      console.log('Item added!');
    }
  
    onNameChange(value: string): void {
      this.name = value;
    }
  
    onDescriptionChange(value: string): void {
      this.description = value;
    }
  
    openTypeStateModal() {
      this.isModalOpen = true;
    }
  
    closeModal() {
      this.isModalOpen = false;
    }
  
    onDataSelected(data: any) {
      console.log('onDataSelected');
      console.log('Data selected:', data);
    }
  
    onStateChange(value: string) {
      console.log('Estado seleccionado:', value);
      this.selectedState = value;
    }
  
    onTypeChange(value: string): void {
      console.log('Tipo cambiado:', value);
      this.selectedType = value;
    }
  
    saveItem() {
      if (
        !this.name.trim() ||
        !this.description.trim() ||
        !this.selectedType ||
        !this.selectedState 
      ) {
        console.warn('Por favor, completa todos los campos antes de guardar.');
        console.log('this.name', this.name);
        console.log('this.description', this.description);
        console.log('this.selectedType', this.selectedType);
        console.log('this.selectedState', this.selectedState);
        return;
      }
  
      this.showToast();
      console.log('Guardar en la base de datos');
      this.router.navigate(['/inventory/items']);
    }
  
  
    showToast() {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Item guardado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  
    modalData(value: any) {
      console.log('Esto llega desde el modal');
      console.log('modalData', value);
      if (value.field === 'Tipo') {
        this.types.push(value.name);
      } else if (value.field === 'Estado') {
        this.states.push(value.name);
      }
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
