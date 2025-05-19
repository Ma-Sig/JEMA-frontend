import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  isOpen = false;
  messageText = '';

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.messageText.trim()) {
      // Aquí puedes agregar la lógica para enviar el mensaje
      console.log('Mensaje enviado:', this.messageText);
      this.messageText = '';
    }
  }
}
