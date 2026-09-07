import { LanguageCode } from './index';

export type SupportChannel = 'WEB_CHAT' | 'PHONE' | 'EMAIL' | 'VOICE';

export type TicketCategory =
  | 'CROP_LISTING'
  | 'MARKETPLACE'
  | 'PAYMENT'
  | 'ORDER_DELIVERY'
  | 'AI_GRADING'
  | 'MANDI_RATES'
  | 'ACCOUNT'
  | 'TECHNICAL'
  | 'GENERAL';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketStatus =
  | 'OPEN'
  | 'AI_ASSISTING'
  | 'WAITING_FOR_USER'
  | 'ESCALATED'
  | 'IN_REVIEW'
  | 'RESOLVED'
  | 'CLOSED';

export interface SupportAction {
  id: string;
  label: string;
  labelHi?: string;
  actionType:
    | 'NAVIGATE_MARKETPLACE'
    | 'NAVIGATE_ADD_CROP'
    | 'NAVIGATE_ORDERS'
    | 'NAVIGATE_PROFILE'
    | 'NAVIGATE_MANDI'
    | 'NAVIGATE_PROPERTY'
    | 'NAVIGATE_REQUIREMENTS'
    | 'NAVIGATE_LOGIN'
    | 'NAVIGATE_VOICE'
    | 'CREATE_TICKET'
    | 'CALL_HELPLINE'
    | 'SEND_EMAIL';
  payload?: Record<string, unknown>;
  requiresConfirmation?: boolean;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'ai' | 'agent' | 'system';
  senderName?: string;
  text: string;
  timestamp: string;
  suggestedActions?: SupportAction[];
  isDiagnostics?: boolean;
  diagnosticsData?: {
    verified: boolean;
    cropFound?: boolean;
    listingStatus?: string;
    ordersFound?: number;
    details?: string;
  };
  needsResolutionConfirmation?: boolean;
}

export interface TicketResolution {
  text: string;
  resolvedAt: string;
  resolvedBy: string;
  autoResolved: boolean;
}

export interface TicketSatisfaction {
  rating?: number; // 1 to 5
  resolved: 'yes' | 'partial' | 'no';
  feedback?: string;
  submittedAt: string;
}

export interface SupportTicket {
  ticketId: string; // e.g. KIS-SUP-1042
  userId: string;
  userName: string;
  userRole: 'farmer' | 'buyer' | 'guest';
  userPhone?: string;
  userEmail?: string;
  channel: SupportChannel;
  category: TicketCategory;
  subject: string;
  description: string;
  conversationSummary: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  resolution?: TicketResolution;
  satisfaction?: TicketSatisfaction;
  messages: SupportMessage[];
  language?: 'hi-IN' | 'en-IN' | 'hinglish' | string;
  aiAttemptsCount?: number;
  diagnosticSummary?: {
    userProblem: string;
    aiAction: string;
    result: string;
    aiAttempts: string[];
    currentStatus: string;
  };
}

export interface SupportChatContext {
  token?: string;
  userId?: string;
  userName?: string;
  userRole?: 'farmer' | 'buyer' | 'guest';
  userPhone?: string;
  userEmail?: string;
  activeLanguage?: LanguageCode | 'hinglish';
  selectedLanguage?: LanguageCode | 'hinglish';
  isManualSelection?: boolean;
  currentScreen?: string;
  ticketId?: string;
}
