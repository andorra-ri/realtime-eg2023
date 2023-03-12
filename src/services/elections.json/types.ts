export type RecordId = string;

export type ThumbnailDTO = {
  url: string;
  width: number;
  height: number;
}

export type AttachmentDTO = {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: ThumbnailDTO;
    large: ThumbnailDTO;
    full: ThumbnailDTO;
  };
};

export type PartyDTO = {
  _id: RecordId;
  _created: string;
  name: string;
  logo: AttachmentDTO[];
  color: string;
  order: number;
  groups?: string[];
  coalition_leader?: string[];
};

export type ListDTO = {
  _id: RecordId;
  _created: string;
  name: string;
  color?: string;
  logo?: AttachmentDTO[];
  parties: RecordId[];
  nominees: {
    _id: RecordId;
    _created: string;
    name: string;
    party: RecordId[];
  }[];
  district: string[];
};

