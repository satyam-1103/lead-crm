import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Lead, Agent, WhatsAppConversation, LinkedInProspect } from '../types';

export const firebaseService = {
  // Leads
  async getLeads(): Promise<Lead[]> {
    const querySnapshot = await getDocs(collection(db, 'leads'));
    return querySnapshot.docs.map(doc => doc.data() as Lead);
  },

  subscribeToLeads(callback: (leads: Lead[]) => void) {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(doc => doc.data() as Lead);
      callback(leads);
    });
  },

  async updateLeadStatus(leadId: string, status: string) {
    const leadRef = doc(db, 'leads', leadId);
    await updateDoc(leadRef, { status });
  },

  // Agents
  async getAgents(): Promise<Agent[]> {
    const querySnapshot = await getDocs(collection(db, 'agents'));
    return querySnapshot.docs.map(doc => doc.data() as Agent);
  },

  // WhatsApp Conversations
  async getConversations(): Promise<WhatsAppConversation[]> {
    const querySnapshot = await getDocs(collection(db, 'conversations'));
    return querySnapshot.docs.map(doc => doc.data() as WhatsAppConversation);
  },

  // LinkedIn Prospects
  async getProspects(): Promise<LinkedInProspect[]> {
    const querySnapshot = await getDocs(collection(db, 'prospects'));
    return querySnapshot.docs.map(doc => doc.data() as LinkedInProspect);
  }
};
