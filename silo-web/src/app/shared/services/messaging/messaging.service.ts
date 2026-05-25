import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '@services/utils/auth.service';

export interface ChatParticipant {
  _id: string;
  fullName: string;
  profilePic?: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  sender: ChatParticipant;
  content: string;
  createdAt: Date | string;
  read: boolean;
}

export interface Conversation {
  _id: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: Date | string;
}

@Injectable({ providedIn: 'root' })
export class MessagingService {

  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  get currentUserId(): string {
    return this.authService.loggedInUser?._id ?? '';
  }

  getConversations(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/conversations`);
  }

  getMessages(conversationId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: string, content: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/conversations/${conversationId}/messages`, { content });
  }

  createConversation(participantIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/conversations`, { participants: participantIds });
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetchEmployees`);
  }
}
