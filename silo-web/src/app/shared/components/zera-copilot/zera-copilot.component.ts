import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@services/utils/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CopilotResponse {
  reply: string;
  intent?: {
    primary: string;
    secondary?: string;
    confidence?: number;
    filters?: Record<string, any>;
  };
  sources?: string[];
  mutation?: {
    action: string;
    entity: string;
  };
  result?: {
    ok: boolean;
    message: string;
    count?: number;
  };
  conversationId: string;
  model: string;
  resolvedRole: string;
  downloadUrl?: string;
  downloadLabel?: string;
  reportType?: string;
  error?: string;
}

interface Suggestion {
  suggestions: string[];
}

@Component({
  selector: 'app-zera-copilot',
  templateUrl: './zera-copilot.component.html',
  styleUrls: ['./zera-copilot.component.scss'],
})
export class ZeraCopilotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  image = 'assets/img/project/illustrations/chatbot.png';
  title = 'Zera';
  subtitle = 'SILO AI Assistant'

  // State
  isOpen = false;
  messages: Message[] = [];
  inputValue = '';
  isLoading = false;
  conversationId: string | null = null;
  suggestions: string[] = [];
  downloadLink: { url: string; label: string } | null = null;

  // Props - injected from parent or AuthService
  @Input() companyId: string | null = null;
  @Input() userId: string | null = null;

  // Logged in user from AuthService
  loggedInUser: any;

  // Track if we should auto-scroll
  private shouldScroll = true;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.loadSuggestions();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ───────────────────────────────────────────────────────────────
  // Core interactions
  // ───────────────────────────────────────────────────────────────

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.loadSuggestions();
    }
    if (this.isOpen) {
      this.shouldScroll = true;
    }
  }

  close(): void {
    this.isOpen = false;
  }

  async sendMessage(msg?: string): Promise<void> {
    const message = msg ? msg.trim() : this.inputValue.trim();

    if (!message || this.isLoading) {
      return;
    }

    // Add user message to UI
    this.messages.push({ role: 'user', content: message });
    this.inputValue = '';
    this.isLoading = true;
    this.downloadLink = null;
    this.shouldScroll = true;

    try {
      // Build request
      const body: any = {
        message,
        conversationHistory: this.messages.slice(0, -1),
      };

      if (this.conversationId) {
        body.conversationId = this.conversationId;
      }

      // Priority 1: Use loggedInUser from AuthService
      if (this.loggedInUser) {
        if (this.loggedInUser.isSuperAdmin) {
          body.companyId = this.loggedInUser._id;
        } else {
          body.userId = this.loggedInUser._id;
        }
      }

      // Priority 2: Fallback to component @Input properties
      if (!body.companyId && this.companyId) {
        body.companyId = this.companyId;
      }
      if (!body.userId && this.userId) {
        body.userId = this.userId;
      }

      
      const response = await this.http
        .post<CopilotResponse>(`${environment.aiBaseUrl}/copilot/chat`, body)
        .toPromise();

      if (response?.reply) {
        if (response.conversationId) {
          this.conversationId = response.conversationId;
        }

        this.messages.push({ role: 'assistant', content: response.reply });
        this.shouldScroll = true;

        // Handle download link
        if (response.downloadUrl) {
          let fullUrl = response.downloadUrl;
          if (!fullUrl.startsWith('http')) {
            const base = environment.aiBaseUrl.replace(/\/$/, '');
            const path = fullUrl.replace(/^\/api/, '');
            fullUrl = `${base}${path}`;
          }
          const reportType = response.reportType || 'Report';
          const label = this.generateDownloadLabel(reportType);
          this.downloadLink = { url: fullUrl, label };
        }

        // Handle navigation based on intent
        if (response.intent?.primary) {
          this.handleIntentNavigation(response.intent.primary, message);
        }

        // Trigger refetch if mutation
        if (response.mutation?.action) {
          this.handleMutation(response.mutation, response.result);
        }
      }
    } catch (err: any) {
      const errorMsg =
        err?.error?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      this.messages.push({ role: 'assistant', content: errorMsg });
      this.shouldScroll = true;
    } finally {
      this.isLoading = false;
    }
  }

  selectSuggestion(suggestion: string): void {
    this.sendMessage(suggestion);
  }

  downloadCSV(): void {
    if (this.downloadLink) {
      let downloadUrl = this.downloadLink.url;
      if (!downloadUrl.startsWith('http')) {
        downloadUrl = `${environment.aiBaseUrl}${downloadUrl}`;
      }
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.generateFileName(this.downloadLink.label);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Download helpers
  // ───────────────────────────────────────────────────────────────

  private generateDownloadLabel(reportType: string): string {
    const cleaned     = reportType.trim().replace(/CSV$/i, '').trim();
    const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `Download ${capitalized} CSV`;
  }

  private generateFileName(label: string): string {
    const match = label.match(/Download\s+(.+?)\s+CSV/i);
    if (match?.[1]) return `${match[1].replace(/\s+/g, '_')}.csv`;
    return 'download.csv';
  }

  // ───────────────────────────────────────────────────────────────
  // Intent-based Navigation
  // ───────────────────────────────────────────────────────────────

  private handleIntentNavigation(primary: string, userMessage: string = ''): void {
    const intent = primary.toLowerCase().trim();
    const msg    = userMessage.toLowerCase();

    // ── HR Settings sub-routing ──────────────────────────────────────────────
    // When the intent is hr_settings, check the message for more specific context
    // so we land on the right settings page instead of the generic one.
    if (intent === 'hr_settings' || intent === 'settings') {
      const settingsRoute = this.resolveSettingsRoute(msg);
      console.log(`Navigating to ${settingsRoute} based on intent: ${primary}`);
      this.router.navigate([settingsRoute]);
      return;
    }

    // ── Primary intent → route map ───────────────────────────────────────────
    const intentRoutes: Record<string, string> = {
      // ── People & Work ──────────────────────────────────────────────────────
      employees:          'app/hr/employees',
      employee:           'app/hr/employees',

      // ── Payroll ────────────────────────────────────────────────────────────
      payroll:            'app/hr/payroll',
      salary:             'app/hr/payroll',

      // ── Leave / Absence ────────────────────────────────────────────────────
      absence:            'app/hr/leave-management',
      absences:           'app/hr/leave-management',
      leave:              'app/hr/leave-management',

      // ── Expenses ───────────────────────────────────────────────────────────
      expense:            'app/hr/expense-management',
      expenses:           'app/hr/expense-management',

      // ── Performance ────────────────────────────────────────────────────────
      appraisal:          'app/hr/appraisals',
      appraisals:         'app/hr/appraisals',
      appraisal_period:   'app/hr/appraisals',
      kpi:                'app/hr/appraisals',

      // ── Calendar & Meetings ─────────────────────────────────────────────────
      meetings:           'app/hr/calender',
      meeting:            'app/hr/calender',
      calendar:           'app/hr/calender',

      // ── Reports ────────────────────────────────────────────────────────────
      reports:            'app/hr/reports',
      report:             'app/hr/reports',

      // ── Recruitment ────────────────────────────────────────────────────────
      recruitment:        'app/hr/recruitment',
      recruitments:       'app/hr/recruitment',
      application:        'app/hr/recruitment',
      applications:       'app/hr/recruitment',

      // ── Notice board ───────────────────────────────────────────────────────
      announcement:       'app/hr/notice-board',
      announcements:      'app/hr/notice-board',
      notice:             'app/hr/notice-board',

      // ── Attendance ─────────────────────────────────────────────────────────
      attendance:         'app/hr/attendance',

      // ── Visitors ───────────────────────────────────────────────────────────
      visitors:           'app/hr/visitor-management',
      visitor:            'app/hr/visitor-management',

      // ── Learning ───────────────────────────────────────────────────────────
      learning:           'app/hr/learning',

      // ── HR Settings (generic fallback — specific sub-pages handled above) ──
      hr_settings:        'app/settings/hr-settings',
      setup:              'app/settings/hr-settings',

      // ── Roles & Permissions ─────────────────────────────────────────────────
      roles:              'app/settings/general-settings/roles-permissions',
      permissions:        'app/settings/general-settings/roles-permissions',
      modules:            'app/settings/general-settings/roles-permissions',

      // ── Subscription ───────────────────────────────────────────────────────
      subscription:       'app/settings/general-settings/subscription/history',
      subscriptions:      'app/settings/general-settings/subscription/history',
      plan:               'app/settings/general-settings/subscription/history',
      plans:              'app/settings/general-settings/subscription/history',
      invoice:            'app/settings/general-settings/subscription/history',
      invoices:           'app/settings/general-settings/subscription/history',

      // ── Billing ────────────────────────────────────────────────────────────
      billing:            'app/settings/general-settings/billing',
    };

    const route = intentRoutes[intent];
    if (route) {
      console.log(`Navigating to ${route} based on intent: ${primary}`);
      this.router.navigate([route]);
    }
  }

  /**
   * Resolves the correct settings sub-page from the user's message text.
   *
   * Priority order (most specific first):
   *   1. Roles / Permissions / Modules
   *   2. Subscription / Plans / Invoices
   *   3. Billing / Payment methods
   *   4. HR Settings sub-sections (leave types, expense types, designations, etc.)
   *   5. Generic HR Settings fallback
   */
  private resolveSettingsRoute(msg: string): string {
    // ── Roles, Permissions, Modules ─────────────────────────────────────────
    if (
      /\b(role|roles|permission|permissions|module|modules|access\s+control|access\s+level)\b/i.test(msg)
    ) {
      return 'app/settings/general-settings/roles-permissions';
    }

    // ── Subscription, Plans, Invoices ────────────────────────────────────────
    if (
      /\b(subscription|subscriptions|plan|plans|invoice|invoices|upgrade|downgrade|pricing)\b/i.test(msg)
    ) {
      return 'app/settings/general-settings/subscription/history';
    }

    // ── Billing ───────────────────────────────────────────────────────────────
    if (
      /\b(billing|bill|payment\s+method|card|bank\s+details|billing\s+history)\b/i.test(msg)
    ) {
      return 'app/settings/general-settings/billing';
    }

    // ── HR Settings sub-sections ──────────────────────────────────────────────
    // All of these live under app/settings/hr-settings
    if (
      /\b(leave\s+type|expense\s+type|department|designation|branch|holiday|salary\s+scale|payroll\s+(credit|debit)|account\s+set.?up|hr\s+set.?up|configure\s+hr|initial\s+setup|set\s+up\s+account)\b/i.test(msg)
    ) {
      return 'app/settings/hr-settings';
    }

    // ── Generic settings fallback ─────────────────────────────────────────────
    return 'app/settings/hr-settings';
  }

  // ───────────────────────────────────────────────────────────────
  // Load suggestions
  // ───────────────────────────────────────────────────────────────

  private loadSuggestions(): void {
    this.http
      .get<Suggestion>(`${environment.aiBaseUrl}/copilot/suggestions`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.suggestions = response.suggestions.slice(0, 4);
        },
        error: () => {
          this.suggestions = [
            'How many employees do we have?',
            'Show all pending leave requests',
            'What was total payroll this month?',
            'List all pending expenses',
          ];
        },
      });
  }

  // ───────────────────────────────────────────────────────────────
  // Mutation handler
  // ───────────────────────────────────────────────────────────────

  private handleMutation(
    mutation: { action: string; entity: string },
    result?: { ok: boolean; message: string; count?: number }
  ): void {
    if (result?.ok) {
      console.log(`✓ Mutation success: ${mutation.action} ${mutation.entity}`, result);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Scroll to bottom
  // ───────────────────────────────────────────────────────────────

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) container.scrollTop = container.scrollHeight;
    } catch (_) {}
  }

  // ───────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────

  trackByIndex(index: number): number {
    return index;
  }
}