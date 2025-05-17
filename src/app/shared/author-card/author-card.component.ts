import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './author-card.component.html',
styleUrls: ['./author-card.component.css']
})
export class AuthorCardComponent {
  authors = [
    { name: 'Jonnathan', role: 'Author', email: 'jonnathan.cuzcot@ucuenca.edu.ec', img: 'assets/jonnathan.jpg' },
    { name: 'Emmanuel', role: 'Author', email: 'emmanuel.vintimilla@ucuenca.edu.ec', img: 'assets/emmanuel.jpg' },
    { name: 'Marco', role: 'Author', email: 'marco.siguenza@ucuenca.edu.ec', img: 'assets/marco.jpg' },
    { name: 'Alexander', role: 'Author', email: 'alexander.rojas@ucuenca.edu.ec', img: 'assets/alex.jpg' }
  ];

}
