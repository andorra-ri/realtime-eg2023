export type RecordId = string;

export type PartyDTO = {
  _id: RecordId;
  _created: string;
  name: string;
  color: string;
  order: number;
  groups?: string[];
  coalition_leader?: string[];
  coalition_name?: string;
};

export type ListDTO = {
  _id: RecordId;
  _created: string;
  name: string;
  color?: string;
  order: number;
  parties: RecordId[];
  nominees: {
    _id: RecordId;
    _created: string;
    name: string;
    party: RecordId[];
  }[];
  district: string[];
};

export type ResultsDTO = {
  _id: RecordId;
  _created: string;
  lists: {
    _id: RecordId;
    _created: string;
    votes: number;
  }[];
  blanks: number;
  census: number;
  participation: number;
  nulls: number;
  district: string;
  abstention: number;
  count: number;
  last_modified: string;
  valids: number;
};

export type HistoricDTO = {
  _id: RecordId;
  _created: string;
  type: 'BLANK' | 'NULL' | 'ABSTENTION';
  year: number;
  value: number;
};
