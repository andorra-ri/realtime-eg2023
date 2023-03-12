/* DOMAIN MODELS */
export type Party = {
  id: string;
  name: string;
  logo?: string;
  color: string;
  order: number;
  groups?: string[];
  coalitionLeaderId?: string;
};

export type Nominee = {
  name: string;
  party: Party;
};

export type List = {
  id: string;
  name: string;
  color?: string;
  logo?: string;
  district: string;
  votes: number;
  seats: number;
  nominees: Nominee[];
  alternates?: Nominee[];
  parties: Party[];
};

/* SERVICE INTERFACES */
export type ElectionsService = {
  getParties: () => Promise<Party[]>;
  getLists: () => Promise<List[]>;
};
