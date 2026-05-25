import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { ChatMessage, Conversation } from '@services/messaging/messaging.service';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrl: './chat-thread.component.scss'
})
export class ChatThreadComponent implements OnChanges {

  @Input() conversation!: Conversation;
  @Input() messages: ChatMessage[] = [];
  @Input() currentUserId = '';

  @Output() back = new EventEmitter<void>();

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  ngOnChanges(): void {
    setTimeout(() => this.scrollToBottom(), 50);
  }

  getDisplayName(): string {
    if (!this.conversation) return '';
    return this.conversation.participants
      .filter(p => p._id !== this.currentUserId)
      .map(p => p.fullName)
      .join(', ') || 'Unknown';
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  isMine(msg: ChatMessage): boolean {
    return msg.sender._id === this.currentUserId;
  }

  private scrollToBottom() {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
