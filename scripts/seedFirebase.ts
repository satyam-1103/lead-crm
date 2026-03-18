import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockLeads, mockAgents, mockWhatsAppConversations, mockLinkedInProspects } from '../src/data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, '../Service-accountkey.json');
console.log('Loading service account from:', serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account file not found!');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Initialization Error:', error);
  process.exit(1);
}

const db = admin.firestore();

async function seed() {
  console.log('Seeding Firestore database...');
  
  // Note: we're uploading sequentially or in chunks if it's too big, 
  // but batch limits are 500 so this is small enough.
  let count = 0;
  
  for (const lead of mockLeads) {
    await db.collection('leads').doc(lead.id).set(lead);
    count++;
  }
  console.log(`Uploaded ${count} leads.`);
  
  count = 0;
  for (const agent of mockAgents) {
    await db.collection('agents').doc(agent.id).set(agent);
    count++;
  }
  console.log(`Uploaded ${count} agents.`);

  count = 0;
  for (const conv of mockWhatsAppConversations) {
    await db.collection('conversations').doc(conv.id).set(conv);
    count++;
  }
  console.log(`Uploaded ${count} conversations.`);

  count = 0;
  for (const prospect of mockLinkedInProspects) {
    await db.collection('prospects').doc(prospect.id).set(prospect);
    count++;
  }
  console.log(`Uploaded ${count} prospects.`);

  console.log('Database seeded successfully!');
}

seed().catch(console.error);
