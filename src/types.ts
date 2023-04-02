/* UTILITY TYPES */
export type Replace<O extends object, T extends object> = Omit<T, keyof O> & O;

/* DOMAIN MODELS */
export type Party = {
  id: string;
  name: string;
  logo?: string;
  color: string;
  order: number;
  groups?: string[];
  coalitionLeaderId?: string;
  coalitionName?: string;
};

export type Nominee = {
  name: string;
  party: Party;
  photo?: string;
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
  count: number;
  lastModified: Date;
};

export type TerritorialResults = {
  lists: Record<string, List[]>;
  nominees: Nominee[];
  countings: Record<string, number>;
  nulls: number;
  blanks: number;
  abstention: number;
};

export type NationalResults = Replace<{
  lists: ({
    reminder: number;
    votes: number;
    seats: number;
  } & List)[];
}, Partial<Results>> & {
  nominees: Nominee[];
  qe: number;
  totalVotes: number;
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
