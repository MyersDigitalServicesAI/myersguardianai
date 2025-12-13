import { Task, Log } from '../types';

export const generateMockTasks = (): Task[] => [
  {
    id: 't-101',
    clientId: 'Client_A (Standard)',
    tier: 'standard',
    input: 'Draft a reply to the customer complaint about shipping delay.',
    aiDraft: 'Hey sorry about the wait. We will get it to you whenever.',
    confidence: 65,
    status: 'pending',
    riskFlag: true,
    timestamp: new Date(Date.now() - 1000000)
  },
  {
    id: 't-102',
    clientId: 'Client_B (Enterprise)',
    tier: 'enterprise',
    input: 'Generate legal disclaimer for the new Q3 report.',
    aiDraft: 'The company is likely not responsible for errors...',
    confidence: 82,
    status: 'pending',
    riskFlag: true,
    timestamp: new Date(Date.now() - 500000)
  },
  {
    id: 't-103',
    clientId: 'Client_C (Standard)',
    tier: 'standard',
    input: 'Write a blog post intro about AI automation.',
    aiDraft: 'AI is the future. It helps you save money and time.',
    confidence: 95,
    status: 'pending',
    riskFlag: false,
    timestamp: new Date()
  }
];

export const generateLiveTask = (): Task => {
  const clients = ['FinCorp', 'LegalEagle', 'RetailGiant', 'AutoSys', 'MediCare_Plus'];
  const inputs = [
    'Check this outgoing email for PII violations.',
    'Summarize the quarterly earnings call.',
    'Generate a SQL query for the user database.',
    'Draft a termination notice for vendor X.',
    'Translate this contract to Spanish.'
  ];
  const drafts = [
    'Here is the analysis. No PII detected in the header...',
    'Revenue is up 12% YoY. Growth is strong...',
    'SELECT * FROM users WHERE active = 1...',
    'We regret to inform you that we are ending...',
    'Este contrato establece los términos...'
  ];
  
  const isEnterprise = Math.random() > 0.6;
  const isRisk = Math.random() > 0.75;
  const randIndex = Math.floor(Math.random() * inputs.length);
  const clientName = clients[Math.floor(Math.random() * clients.length)];

  return {
    id: `live-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    clientId: `${clientName} (${isEnterprise ? 'Enterprise' : 'Standard'})`,
    tier: isEnterprise ? 'enterprise' : 'standard',
    input: inputs[randIndex],
    aiDraft: drafts[randIndex],
    confidence: Math.floor(Math.random() * (99 - 60) + 60),
    status: 'pending',
    riskFlag: isRisk,
    timestamp: new Date()
  };
};

export const generateGhostLogs = (): Log[] => [
  { id: 'l-1', date: '2025-12-10', taskSnippet: 'Refund Policy Update...', riskDetected: 'Incorrect Legal Term', outcome: 'Fixed by AI', savedLiability: 1200 },
  { id: 'l-2', date: '2025-12-11', taskSnippet: 'Customer Email: Angry...', riskDetected: 'Toxic Tone', outcome: 'Fixed by AI', savedLiability: 500 },
  { id: 'l-3', date: '2025-12-11', taskSnippet: 'Financial Disclosure...', riskDetected: 'Missing Compliance', outcome: 'Fixed by AI', savedLiability: 5000 },
  { id: 'l-4', date: '2025-12-12', taskSnippet: 'Competitor Analysis...', riskDetected: 'Hallucinated Data', outcome: 'Flagged for Human', savedLiability: 250 },
];

export const initialTrafficData = [
  { time: '10:00', load: 45 },
  { time: '10:05', load: 52 },
  { time: '10:10', load: 38 },
  { time: '10:15', load: 65 },
  { time: '10:20', load: 48 },
  { time: '10:25', load: 59 },
  { time: '10:30', load: 82 },
];