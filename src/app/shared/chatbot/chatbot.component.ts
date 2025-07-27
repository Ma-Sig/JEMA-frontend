import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from './services/chatbot.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  isOpen = false;
  messageText = '';
  messages: { type: 'user' | 'bot'; text: string }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    const text = this.messageText.trim();
    if (!text) return;

    // Agrega mensaje del usuario
    this.messages.push({ type: 'user', text });
    this.messageText = '';

    try {
      const response = await this.chatbotService.sendMessageToChatbot(text);
      const botReply = response?.formattedAnswer || 'Lo siento, no entendí tu pregunta.';
      this.messages.push({ type: 'bot', text: botReply });
    } catch (error) {
      console.error('Error al obtener respuesta del chatbot:', error);
      this.messages.push({ type: 'bot', text: 'Ocurrió un error al procesar tu mensaje.' });
    }
  }
}
