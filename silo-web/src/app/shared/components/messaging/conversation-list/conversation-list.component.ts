import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conversation } from '@services/messaging/messaging.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent {

  @Input() conversations: Conversation[] = [];
  @Input() currentUserId = '';
  @Input() activeConversationId: string | null = null;

  @Output() conversationSelected = new EventEmitter<Conversation>();
  @Output() newConversation = new EventEmitter<void>();

  selectConversation(conv: Conversation) {
    this.conversationSelected.emit(conv);
  }

  getOtherParticipants(conv: Conversation) {
    return conv.participants.filter(p => p._id !== this.currentUserId);
  }

  getDisplayName(conv: Conversation): string {
    const others = this.getOtherParticipants(conv);
    return others.map(p => p.fullName).join(', ') || 'Unknown';
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
