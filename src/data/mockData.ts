import type { Lead, Agent, WhatsAppConversation, LinkedInProspect } from '../types';

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const now = new Date();
const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

export const mockLeads: Lead[] = [
  {
    id: 'L001', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@gmail.com',
    propertyInterest: 'Apartment', budgetMin: 5000000, budgetMax: 8000000,
    preferredLocation: 'Whitefield, Bangalore', source: 'Google Ads',
    assignedAgent: 'Priya Mehta', status: 'Interested',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), now),
    notes: 'Interested in 3BHK, wants possession by Q1 2027.',
    timeline: [
      { id: 'T1', type: 'call', message: 'Initial call made, discussed requirements.', timestamp: randomDate(threeMonthsAgo, now), agent: 'Priya Mehta' },
      { id: 'T2', type: 'email', message: 'Sent property brochure via email.', timestamp: randomDate(threeMonthsAgo, now), agent: 'Priya Mehta' },
    ]
  },
  {
    id: 'L002', name: 'Anita Patel', phone: '+91 87654 32109', email: 'anita.patel@yahoo.com',
    propertyInterest: 'Villa', budgetMin: 15000000, budgetMax: 25000000,
    preferredLocation: 'Sarjapur Road, Bangalore', source: 'LinkedIn',
    assignedAgent: 'Arjun Singh', status: 'Site Visit Scheduled',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), now),
    notes: 'HNWI, looking for luxury villa for self-use.',
    timeline: [
      { id: 'T3', type: 'whatsapp', message: 'Shared villa brochure on WhatsApp.', timestamp: randomDate(threeMonthsAgo, now), agent: 'Arjun Singh' },
    ]
  },
  {
    id: 'L003', name: 'Vikram Nair', phone: '+91 76543 21098', email: 'vikram.nair@hotmail.com',
    propertyInterest: 'Plot', budgetMin: 3000000, budgetMax: 6000000,
    preferredLocation: 'Electronic City, Bangalore', source: 'Facebook Ads',
    assignedAgent: 'Priya Mehta', status: 'Negotiation',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), now),
    notes: 'Wants corner plot, price negotiation ongoing.',
    timeline: []
  },
  {
    id: 'L004', name: 'Deepika Reddy', phone: '+91 65432 10987', email: 'deepika.r@outlook.com',
    propertyInterest: 'Apartment', budgetMin: 7000000, budgetMax: 12000000,
    preferredLocation: 'Hebbal, Bangalore', source: 'Website',
    assignedAgent: 'Sneha Kapoor', status: 'Booked',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 0 * 24 * 60 * 60 * 1000), now),
    notes: 'Booking done for 4BHK unit 301. Payment plan selected.',
    timeline: []
  },
  {
    id: 'L005', name: 'Suresh Kumar', phone: '+91 54321 09876', email: 'suresh.k@gmail.com',
    propertyInterest: 'Commercial', budgetMin: 20000000, budgetMax: 50000000,
    preferredLocation: 'MG Road, Bangalore', source: 'Property Portal',
    assignedAgent: 'Arjun Singh', status: 'New Lead',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), now),
    notes: 'Looking for commercial space for IT company.',
    timeline: []
  },
  {
    id: 'L006', name: 'Meera Joshi', phone: '+91 43210 98765', email: 'meera.j@gmail.com',
    propertyInterest: 'Apartment', budgetMin: 4000000, budgetMax: 6500000,
    preferredLocation: 'Yelahanka, Bangalore', source: 'WhatsApp',
    assignedAgent: 'Sneha Kapoor', status: 'Contacted',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), now),
    notes: 'First-time buyer, needs home loan guidance.',
    timeline: []
  },
  {
    id: 'L007', name: 'Karan Malhotra', phone: '+91 32109 87654', email: 'karan.m@yahoo.com',
    propertyInterest: 'Villa', budgetMin: 18000000, budgetMax: 30000000,
    preferredLocation: 'Devanahalli, Bangalore', source: 'Google Ads',
    assignedAgent: 'Raj Verma', status: 'Lost',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), now),
    notes: 'Lost to competitor — shifted budget preference.',
    timeline: []
  },
  {
    id: 'L008', name: 'Pooja Agarwal', phone: '+91 21098 76543', email: 'pooja.a@gmail.com',
    propertyInterest: 'Plot', budgetMin: 2500000, budgetMax: 4000000,
    preferredLocation: 'Mysore Road, Bangalore', source: 'Facebook Ads',
    assignedAgent: 'Raj Verma', status: 'Interested',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), now),
    notes: 'Interested in residential plot for future construction.',
    timeline: []
  },
  {
    id: 'L009', name: 'Nitin Bhatia', phone: '+91 10987 65432', email: 'nitin.b@outlook.com',
    propertyInterest: 'Apartment', budgetMin: 9000000, budgetMax: 14000000,
    preferredLocation: 'Koramangala, Bangalore', source: 'LinkedIn',
    assignedAgent: 'Priya Mehta', status: 'Site Visit Scheduled',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), now),
    notes: 'Site visit scheduled for Saturday 10AM.',
    timeline: []
  },
  {
    id: 'L010', name: 'Sonal Gupta', phone: '+91 99887 76655', email: 'sonal.g@gmail.com',
    propertyInterest: 'Commercial', budgetMin: 10000000, budgetMax: 20000000,
    preferredLocation: 'Marathahalli, Bangalore', source: 'Website',
    assignedAgent: 'Sneha Kapoor', status: 'Negotiation',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), now),
    notes: 'Looking for co-working space on rent + purchase.',
    timeline: []
  },
  {
    id: 'L011', name: 'Amit Tiwari', phone: '+91 88776 65544', email: 'amit.t@gmail.com',
    propertyInterest: 'Apartment', budgetMin: 6000000, budgetMax: 10000000,
    preferredLocation: 'Indiranagar, Bangalore', source: 'Google Ads',
    assignedAgent: 'Arjun Singh', status: 'Booked',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), now),
    notes: 'Booking confirmed. 2BHK unit 205.',
    timeline: []
  },
  {
    id: 'L012', name: 'Ritu Choudhary', phone: '+91 77665 54433', email: 'ritu.c@yahoo.com',
    propertyInterest: 'Villa', budgetMin: 22000000, budgetMax: 35000000,
    preferredLocation: 'North Bangalore', source: 'Property Portal',
    assignedAgent: 'Raj Verma', status: 'New Lead',
    createdAt: randomDate(threeMonthsAgo, now), lastContact: randomDate(new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000), now),
    notes: 'Fresh inquiry from housing portal.',
    timeline: []
  },
];

export const mockAgents: Agent[] = [
  { id: 'A1', name: 'Priya Mehta', avatar: 'PM', role: 'Senior Sales Agent', leadsAssigned: 42, siteVisits: 18, bookings: 7, conversionRate: 16.7, avgResponseTime: '28 min', revenue: 52500000 },
  { id: 'A2', name: 'Arjun Singh', avatar: 'AS', role: 'Sales Agent', leadsAssigned: 38, siteVisits: 14, bookings: 5, conversionRate: 13.2, avgResponseTime: '35 min', revenue: 41000000 },
  { id: 'A3', name: 'Sneha Kapoor', avatar: 'SK', role: 'Sales Agent', leadsAssigned: 31, siteVisits: 11, bookings: 4, conversionRate: 12.9, avgResponseTime: '22 min', revenue: 33500000 },
  { id: 'A4', name: 'Raj Verma', avatar: 'RV', role: 'Junior Sales Agent', leadsAssigned: 24, siteVisits: 8, bookings: 2, conversionRate: 8.3, avgResponseTime: '48 min', revenue: 18000000 },
];

export const mockWhatsAppConversations: WhatsAppConversation[] = [
  {
    id: 'W1', leadId: 'L001', leadName: 'Rahul Sharma', phone: '+91 98765 43210',
    lastMessage: 'What is the price of 3BHK?', timestamp: '2m ago', unread: 2, status: 'active',
    messages: [
      { id: 'M1', sender: 'lead', message: 'Hi, I am interested in your apartments.', timestamp: '10:00 AM', type: 'text' },
      { id: 'M2', sender: 'bot', message: 'Hello! Welcome to LeadEstate. I\'m happy to help you find your dream home. Are you looking for a 2BHK or 3BHK apartment?', timestamp: '10:00 AM', type: 'text' },
      { id: 'M3', sender: 'lead', message: 'What is the price of 3BHK?', timestamp: '10:02 AM', type: 'text' },
      { id: 'M4', sender: 'bot', message: 'Our 3BHK apartments start from ₹72 Lakhs. May I know your preferred location and budget range?', timestamp: '10:02 AM', type: 'text' },
    ]
  },
  {
    id: 'W2', leadId: 'L002', leadName: 'Anita Patel', phone: '+91 87654 32109',
    lastMessage: 'Please send me the brochure.', timestamp: '1h ago', unread: 0, status: 'automated',
    messages: [
      { id: 'M5', sender: 'lead', message: 'I saw your villa project online.', timestamp: '09:00 AM', type: 'text' },
      { id: 'M6', sender: 'bot', message: 'Thank you for your interest! Our luxury villas are located in prime Bangalore locations. Please send me the brochure.', timestamp: '09:01 AM', type: 'text' },
      { id: 'M7', sender: 'agent', message: 'Hi Anita! I\'ve sent the brochure. Can we schedule a site visit this weekend?', timestamp: '09:30 AM', type: 'text' },
    ]
  },
  {
    id: 'W3', leadId: 'L006', leadName: 'Meera Joshi', phone: '+91 43210 98765',
    lastMessage: 'What are the payment options?', timestamp: '3h ago', unread: 1, status: 'active',
    messages: [
      { id: 'M8', sender: 'lead', message: 'Do you have any 2BHK options under 65 lakhs?', timestamp: '07:00 AM', type: 'text' },
      { id: 'M9', sender: 'bot', message: 'Yes! We have multiple options. Let me connect you with one of our specialists.', timestamp: '07:00 AM', type: 'text' },
      { id: 'M10', sender: 'lead', message: 'What are the payment options?', timestamp: '07:15 AM', type: 'text' },
    ]
  },
];

export const mockLinkedInProspects: LinkedInProspect[] = [
  { id: 'P1', name: 'Ramesh Gupta', title: 'Managing Director', company: 'Gupta Construction Pvt Ltd', location: 'Bangalore, Karnataka', industry: 'Real Estate', connections: 842, email: 'ramesh@guptaconstruction.in', addedToCRM: false },
  { id: 'P2', name: 'Sunita Sharma', title: 'Real Estate Developer', company: 'Sharma Builders', location: 'Hyderabad, Telangana', industry: 'Real Estate', connections: 612, addedToCRM: false },
  { id: 'P3', name: 'Vijay Malhotra', title: 'CEO', company: 'VKM Realtors', location: 'Mumbai, Maharashtra', industry: 'Real Estate', connections: 1240, email: 'vijay@vkmrealtors.com', addedToCRM: true },
  { id: 'P4', name: 'Kavita Nair', title: 'Property Investment Consultant', company: 'PropInvest India', location: 'Chennai, Tamil Nadu', industry: 'Real Estate', connections: 723, addedToCRM: false },
  { id: 'P5', name: 'Anil Kapoor', title: 'Director - Real Estate', company: 'Kapoor Properties', location: 'Pune, Maharashtra', industry: 'Real Estate', connections: 452, email: 'anil@kapoorproperties.com', addedToCRM: false },
  { id: 'P6', name: 'Neeraj Agarwal', title: 'Co-Founder', company: 'Urban Habitat Developers', location: 'Bangalore, Karnataka', industry: 'Real Estate', connections: 956, addedToCRM: false },
];

export const leadsSourceData = [
  { name: 'Google Ads', value: 34, color: '#4285F4' },
  { name: 'Facebook Ads', value: 22, color: '#1877F2' },
  { name: 'Website', value: 18, color: '#0ea5e9' },
  { name: 'WhatsApp', value: 12, color: '#25D366' },
  { name: 'LinkedIn', value: 8, color: '#0A66C2' },
  { name: 'Property Portal', value: 6, color: '#f59e0b' },
];

export const salesFunnelData = [
  { stage: 'New Leads', count: 248, color: '#0ea5e9' },
  { stage: 'Contacted', count: 186, color: '#6366f1' },
  { stage: 'Interested', count: 124, color: '#8b5cf6' },
  { stage: 'Site Visit', count: 68, color: '#f59e0b' },
  { stage: 'Negotiation', count: 34, color: '#f97316' },
  { stage: 'Booked', count: 18, color: '#10b981' },
];

export const weeklyLeadData = [
  { week: 'Week 1', leads: 42, converted: 6 },
  { week: 'Week 2', leads: 58, converted: 9 },
  { week: 'Week 3', leads: 51, converted: 7 },
  { week: 'Week 4', leads: 73, converted: 12 },
  { week: 'Week 5', leads: 65, converted: 10 },
  { week: 'Week 6', leads: 89, converted: 15 },
  { week: 'Week 7', leads: 78, converted: 11 },
  { week: 'Week 8', leads: 94, converted: 18 },
];

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 48, bookings: 5 },
  { month: 'Feb', revenue: 62, bookings: 7 },
  { month: 'Mar', revenue: 55, bookings: 6 },
  { month: 'Apr', revenue: 78, bookings: 9 },
  { month: 'May', revenue: 91, bookings: 11 },
  { month: 'Jun', revenue: 85, bookings: 10 },
];
