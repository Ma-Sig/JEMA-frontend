import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/table/table.component';
import { Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  imports: [TableComponent, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
   constructor(private router: Router, private userService: UserService) {}

  userData: any[] = [];
  userColumns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'E-mail' },
    { key: 'usuario', label: 'Usuario' },
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.userData = users.map(user => ({
          ...user,
          usuario: user.email  // si no tienes campo "usuario", usar email
        }));
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    });
  }

  onViewItem(row: any) {
    this.router.navigate(['/users/user', row.id_usuario, 'view']);
  }

  onEditItem(row: any) {
    this.router.navigate(['/users/user', row.id_usuario, 'edit']);
  }

  async onDeleteItem(row: any) {
    const confirmed = await this.confirmDeletion();
    if (confirmed) {
      this.userService.deleteUser(row.id_usuario).subscribe({
        next: () => {
          this.loadUsers();
          Swal.fire('Eliminado!', 'Usuario eliminado exitosamente.', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error'),
      });
    }
  }

  async confirmDeletion(): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Está seguro de eliminar este usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });

    return result.isConfirmed;
  }
}
