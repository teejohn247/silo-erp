import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { SettingsService } from '@services/settings/settings.service';
import { HrService } from '@services/hr/hr.service';
import { ChatMessage, Conversation, MessagingService } from '@services/messaging/messaging.service';
import { AuthService } from '@services/utils/auth.service';

type PanelTab = 'messages' | 'notifications' | 'noticeboard';
type MessagingView = 'list' | 'thread' | 'new';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss'
})
export class RightPanelComponent implements OnInit, OnDestroy {

  activeTab: PanelTab = 'notifications';

  // ─── Notifications ───────────────────────────────────────────────────
  notifications: any[] = [];
  notificationBadgeCount = 0;

  // ─── Messaging ───────────────────────────────────────────────────────
  messagingView: MessagingView = 'list';
  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  activeMessages: ChatMessage[] = [];
  currentUserId = '';
  isSending = false;

  // ─── Employee picker ─────────────────────────────────────────────────
  filteredEmployees: any[] = [];
  employeeSearch = '';
  isSearching = false;
  isStartingConv = false;

  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  constructor(
    private settingsService: SettingsService,
    private hrService: HrService,
    private messagingService: MessagingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.loggedInUser?._id ?? '';
    this.loadNotifications();
    this.loadConversations();

    // Debounced server-side employee search
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(term => {
        this.isSearching = true;
        return this.hrService.getEmployees(1, 30, term || undefined);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: res => {
        this.filteredEmployees = (res.data ?? []).filter((e: any) => e._id !== this.currentUserId);
        this.isSearching = false;
      },
      error: () => { this.isSearching = false; }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setTab(tab: PanelTab) {
    this.activeTab = tab;
  }

  // ─── Notifications ───────────────────────────────────────────────────

  private loadNotifications() {
    this.settingsService.pollNotifications(600000).subscribe(res => {
      const raw: any[] = res.data ?? [];
      const sorted = raw.sort((a, b) => Number(a.read) - Number(b.read));
      this.notificationBadgeCount = sorted.filter(n => !n.read).length;
      this.notifications = sorted.slice(0, 20);
    });
  }

  // ─── Messaging ───────────────────────────────────────────────────────

  private loadConversations() {
    this.messagingService.getConversations().subscribe({
      next: res => { this.conversations = res.data ?? []; },
      error: () => { this.conversations = []; }
    });
  }

  openNewConversationView() {
    this.messagingView = 'new';
    this.employeeSearch = '';
    this.filteredEmployees = [];
    // Load initial list with no search term
    this.search$.next('');
  }

  onSearchChange() {
    this.search$.next(this.employeeSearch);
  }

  startConversation(employee: any) {
    this.isStartingConv = true;
    this.messagingService.createConversation([employee._id]).subscribe({
      next: res => {
        this.isStartingConv = false;
        const conv: Conversation = res.data;
        if (conv) {
          const exists = this.conversations.find(c => c._id === conv._id);
          if (!exists) this.conversations = [conv, ...this.conversations];
          this.openConversation(conv);
        }
      },
      error: () => { this.isStartingConv = false; }
    });
  }

  openConversation(conv: Conversation) {
    this.activeConversation = conv;
    this.activeMessages = [];
    this.messagingView = 'thread';
    this.messagingService.getMessages(conv._id).subscribe({
      next: res => { this.activeMessages = res.data ?? []; },
      error: () => { this.activeMessages = []; }
    });
  }

  backToList() {
    this.messagingView = 'list';
    this.activeConversation = null;
    this.activeMessages = [];
  }

  sendMessage(content: string) {
    if (!this.activeConversation || this.isSending) return;
    this.isSending = true;
    this.messagingService.sendMessage(this.activeConversation._id, content).subscribe({
      next: res => {
        if (res.data) this.activeMessages = [...this.activeMessages, res.data];
        this.isSending = false;
      },
      error: () => { this.isSending = false; }
    });
  }
}
