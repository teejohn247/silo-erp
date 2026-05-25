import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {

  @Output() messageSent = new EventEmitter<string>();

  text = '';

  send() {
    const trimmed = this.text.trim();
    if (!trimmed) return;
    this.messageSent.emit(trimmed);
    this.text = '';
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
