import { indexate } from '/@/utils';
import type { ElectionsService, Party, List, Results, Historic } from '/@/types';
import type { PartyDTO, ListDTO, AttachmentDTO, ResultsDTO, HistoricDTO } from './types';

const URL = 'https://eleccions.andorra-ri.workers.dev/api';

const UrlFromAttachment = (
  attachments: AttachmentDTO[] | undefined,
  thumbnail?: 'small' | 'large' | 'full',
): string | undefined => {
  const [attachment] = attachments || [];
  if (!attachment) return undefined;
  return thumbnail ? attachment.thumbnails[thumbnail].url : attachment.url;
};

const adaptParty = (party: PartyDTO): Party => {
  const { _id: id, coalition_leader: [coalitionLeaderId] = [], ...rest } = party;
  const logo = UrlFromAttachment(party.logo);
  return { id, ...rest, logo, coalitionLeaderId };
};

const getLists = async (): Promise<List[]> => {
  const response = await fetch(`${URL}/elections/EG2023`);
  if (!response.ok) throw new Error('RETRIEVE_LISTS_ERROR');
  const { lists, parties }: { lists: ListDTO[], parties: PartyDTO[] } = await response.json();

  const partiesDict = indexate(parties.map(adaptParty), 'id');

  return lists.map(list => {
    const { _id, ...rest } = list;
    return {
      ...rest,
      id: _id,
      votes: 0,
      seats: 0,
      district: list.district[0].split('_')[1],
      parties: list.parties.map(partyId => partiesDict[partyId]),
      nominees: list.nominees.map(nominee => {
        const party = partiesDict[nominee.party[0]];
        return { ...nominee, party };
      }),
    };
  });
};

const getResults = async (): Promise<Results[]> => {
  const response = await fetch(`${URL}/results`);
  if (!response.ok) throw new Error('RETRIEVE_RESULTS_ERROR');
  const results: ResultsDTO[] = await response.json();

  return results.map(result => {
    const { _id: id, _created, last_modified: last, ...rest } = result;
    const lastModified = new Date(last);
    const [, district] = result.district.split('_');
    const lists = result.lists.map(({ _id: listId, votes }) => ({ listId, votes }));
    return { ...rest, id, district, lists, lastModified };
  });
};

const getHistorics = async (): Promise<Historic[]> => {
  const response = await fetch(`${URL}/historics`);
  if (!response.ok) throw new Error('RETRIEVE_HISTORIC_ERROR');
  const historics: HistoricDTO[] = await response.json();
  return historics;
};

const service: ElectionsService = { getLists, getResults, getHistorics };

export default service;
