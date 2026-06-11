export interface Client {
  id: string;
  name: string;
  phone: string;
  username: string;
  balance: number;
  vendorName: string;
  vendorPhone: string;
}

export type BetType = 'directo' | 'pale' | 'tripleta' | 'cash3' | 'play4' | 'pick5';

export interface Bet {
  id: string;
  numbers: string;
  type: BetType;
  lotteryId: string;
  lotteryName: string;
  amount: number;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  bets: Bet[];
  total: number;
  createdAt: Date;
  status: 'draft' | 'sent';
}

export interface Lottery {
  id: string;
  name: string;
  shortName: string;
  closingTime: string; // "HH:MM" format
  schedule: string;
  color: string; // hex color for this lottery's theme
  closed: boolean;
}
