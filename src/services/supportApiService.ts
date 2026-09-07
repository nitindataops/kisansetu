import {
  SupportTicket,
  SupportMessage,
  SupportAction,
  SupportChatContext,
} from '../types/support';

export const OFFICIAL_KISANSETU_HELPLINE_DISPLAY = '+1 737 250 8034';
export const OFFICIAL_KISANSETU_HELPLINE_RAW = '+17372508034';

export interface SupportConfig {
  phoneNumber: string;
  rawPhoneNumber?: string;
  email: string;
  isAiEnabled: boolean;
  channels: string[];
  telephonyProvider?: string;
  telephonyStatus?: string;
}

export interface ChatResponse {
  success: boolean;
  replyText: string;
  suggestedActions?: SupportAction[];
  needsResolutionConfirmation?: boolean;
  createdTicketId?: string;
  isAiFallback?: boolean;
  error?: string;
}

export async function fetchSupportConfig(): Promise<SupportConfig> {
  try {
    const res = await fetch('/api/support/config');
    if (!res.ok) throw new Error('Failed to fetch support config');
    const data = await res.json();
    return {
      phoneNumber: data.phoneNumber || OFFICIAL_KISANSETU_HELPLINE_DISPLAY,
      rawPhoneNumber: data.rawPhoneNumber || OFFICIAL_KISANSETU_HELPLINE_RAW,
      email: data.email || 'support@kisansetu.in',
      isAiEnabled: Boolean(data.isAiEnabled),
      channels: data.channels || ['WEB_CHAT', 'PHONE', 'EMAIL', 'VOICE'],
      telephonyProvider: data.telephonyProvider || 'twilio',
      telephonyStatus: data.telephonyStatus,
    };
  } catch {
    return {
      phoneNumber: OFFICIAL_KISANSETU_HELPLINE_DISPLAY,
      rawPhoneNumber: OFFICIAL_KISANSETU_HELPLINE_RAW,
      email: 'support@kisansetu.in',
      isAiEnabled: true,
      channels: ['WEB_CHAT', 'PHONE', 'EMAIL', 'VOICE'],
      telephonyProvider: 'twilio',
    };
  }
}

export async function sendSupportChatMessage(
  message: string,
  conversationHistory: SupportMessage[],
  context: SupportChatContext = {}
): Promise<ChatResponse> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let token = context.token;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('kisansetu_auth_token') || localStorage.getItem('token') || undefined;
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/support/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        conversationHistory,
        context: {
          ...context,
          token: token || undefined,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        replyText: data.replyText || 'AI Support is temporarily unavailable. You can create a direct support request.',
        suggestedActions: data.suggestedActions || [],
        isAiFallback: true,
      };
    }
    return data;
  } catch {
    return {
      success: false,
      replyText: 'AI Support is temporarily unavailable. You can submit a support ticket or call our Kisan Helpline.',
      suggestedActions: [
        {
          id: 'err_act_ticket',
          label: 'Create Support Ticket',
          labelHi: 'सपोर्ट टिकट बनाएं',
          actionType: 'CREATE_TICKET',
        },
      ],
      isAiFallback: true,
    };
  }
}

export async function fetchSupportTickets(filter?: {
  userId?: string;
  role?: string;
  status?: string;
  channel?: string;
  category?: string;
}): Promise<SupportTicket[]> {
  try {
    const params = new URLSearchParams();
    if (filter?.userId) params.append('userId', filter.userId);
    if (filter?.role) params.append('role', filter.role);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.channel) params.append('channel', filter.channel);
    if (filter?.category) params.append('category', filter.category);

    const res = await fetch(`/api/support/tickets?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    const data = await res.json();
    return data.tickets || [];
  } catch (err) {
    console.error('Error fetching support tickets:', err);
    return [];
  }
}

export async function fetchSupportTicketById(id: string): Promise<SupportTicket | null> {
  try {
    const res = await fetch(`/api/support/tickets/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.ticket || null;
  } catch {
    return null;
  }
}

export async function createSupportTicket(ticketData: {
  userId?: string;
  userName?: string;
  userRole?: 'farmer' | 'buyer' | 'guest';
  userPhone?: string;
  userEmail?: string;
  channel?: string;
  category?: string;
  subject: string;
  description: string;
  priority?: string;
  status?: string;
  initialMessage?: string;
  language?: string;
}): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const res = await fetch('/api/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: 'Failed to create ticket' };
  }
}

export async function updateSupportTicket(
  ticketId: string,
  updates: Partial<SupportTicket>
): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const res = await fetch(`/api/support/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Failed to update ticket' };
  }
}

export async function addTicketReply(
  ticketId: string,
  replyData: {
    sender: 'user' | 'agent' | 'system';
    senderName?: string;
    text: string;
  }
): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const res = await fetch(`/api/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData),
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Failed to send reply' };
  }
}

export async function submitTicketFeedback(
  ticketId: string,
  feedback: {
    rating?: number;
    resolved: 'yes' | 'partial' | 'no';
    feedback?: string;
  }
): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const res = await fetch(`/api/support/tickets/${ticketId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Failed to submit feedback' };
  }
}

export async function processEmailSupport(emailData: {
  fromEmail: string;
  fromName?: string;
  subject: string;
  body: string;
}): Promise<{
  success: boolean;
  ticketId?: string;
  isExistingTicket?: boolean;
  replySubject?: string;
  replyBody?: string;
}> {
  try {
    const res = await fetch('/api/support/email-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

export async function processHelplineVoiceCall(callData: {
  callerPhone?: string;
  callerName?: string;
  speechTranscript: string;
  language?: 'hi' | 'en';
}): Promise<{
  success: boolean;
  spokenReply?: string;
  ticketId?: string;
  actionTaken?: string;
  isEscalated?: boolean;
}> {
  try {
    const res = await fetch('/api/support/voice-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callData),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

export type TelephonyOperationalState =
  | 'ACTIVE'
  | 'CONFIGURED'
  | 'TWILIO_TRIAL_RESTRICTION'
  | 'MISCONFIGURED'
  | 'WEBHOOK_UNREACHABLE'
  | 'UNAVAILABLE';

export interface TwilioTelephonyStatus {
  provider: string;
  isConfigured: boolean;
  operationalState?: TelephonyOperationalState;
  stateExplanation?: string;
  authMethod?: string;
  hasAccountSid?: boolean;
  hasAuthToken?: boolean;
  hasApiKey?: boolean;
  phoneNumber: string;
  formattedPhoneNumber?: string;
  webhookEndpoints?: {
    voiceUrl: string;
    gatherUrl: string;
    statusUrl: string;
    isHttps: boolean;
  };
  trialAccountAnalysis?: {
    isTrialAccount: boolean;
    restrictions: string[];
  };
  accountSidMasked?: string;
  apiKeySidMasked?: string;
  activeCalls: number;
}

export async function fetchTwilioTelephonyStatus(): Promise<TwilioTelephonyStatus | null> {
  try {
    const res = await fetch('/api/support/twilio/config');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function testTwilioVoiceSimulation(speechText: string, fromPhone?: string): Promise<{
  success: boolean;
  callSid?: string;
  speechReceived?: string;
  twiml?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/support/twilio/test-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speechText, fromPhone }),
    });
    return await res.json();
  } catch {
    return { success: false, error: 'Telephony simulation failed.' };
  }
}

