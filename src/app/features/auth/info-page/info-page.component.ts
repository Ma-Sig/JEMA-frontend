import { Component } from '@angular/core';
import { SideBarComponent } from '../../../shared/side-bar/side-bar.component';
import { AuthorCardComponent } from '../../../shared/author-card/author-card.component';


@Component({
  selector: 'app-info-page',
  imports: [SideBarComponent, AuthorCardComponent],
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css',
  standalone: true
})
export class InfoPageComponent {

}
