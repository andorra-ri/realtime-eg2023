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
  order: number;
  district: string;
  votes: number;
  seats: number;
  nominees: Nominee[];
  alternates?: Nominee[];
  parties: Party[];
};

export type Results = {
  id: string;
  district: string;
  census: number;
  participation: number;
  abstention: number;
  valids: number;
  lists: {
    listId: string;
    votes: number;
  }[];
  blanks: number;
  nulls: number;
  lastModified: Date;
};

export type Coalition = {
  name: string;
  order: number;
};

export type Historic = {
  type: 'BLANK' | 'NULL' | 'ABSTENTION';
  year: number;
  value: number;
};

/* SERVICE INTERFACES */
export type ElectionsService = {
  getLists: () => Promise<List[]>;
  getResults: () => Promise<Results[]>;
  getHistorics: () => Promise<Historic[]>;
};
