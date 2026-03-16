export type LeadStatus = 'New Lead' | 'Contacted' | 'Interested' | 'Site Visit Scheduled' | 'Negotiation' | 'Booked' | 'Lost';
export type PropertyType = 'Plot' | 'Apartment' | 'Villa' | 'Commercial';
export type LeadSource = 'Google Ads' | 'Facebook Ads' | 'Website' | 'WhatsApp' | 'LinkedIn' | 'Property Portal';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyInterest: PropertyType;
  budgetMin: number;
  budgetMax: number;
  preferredLocation: string;
  source: LeadSource;
  assignedAgent: string;
  status: LeadStatus;
  createdAt: string;
  lastContact: string;
  notes: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'whatsapp' | 'visit' | 'note';
  message: string;
  timestamp: string;
  agent: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  leadsAssigned: number;
  siteVisits: number;
  bookings: number;
  conversionRate: number;
  avgResponseTime: string;
  revenue: number;
}

export interface WhatsAppConversation {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'active' | 'resolved' | 'automated';
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'lead' | 'bot' | 'agent';
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

export interface LinkedInProspect {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  connections: number;
  email?: string;
  phone?: string;
  addedToCRM: boolean;
}
