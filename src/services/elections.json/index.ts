import { indexate } from '/@/utils';
import type { ElectionsService, Party, List, Results, Historic } from '/@/types';
import type { PartyDTO, ListDTO, ResultsDTO, HistoricDTO } from './types';

const getParties = async (): Promise<Party[]> => {
  const response = await fetch('/json/parties.json');
  const parties: PartyDTO[] = await response.json();

  return parties.map(party => {
    const {
      _id: id,
      coalition_leader: [coalitionLeaderId] = [],
      coalition_name: coalitionName,
      ...rest
    } = party;
    const logo = `/images/parties/${id}.png`;
    return { id, ...rest, logo, coalitionLeaderId };
  });
};

const getLists = async (): Promise<List[]> => {
  const parties = indexate(await getParties(), 'id');

  const response = await fetch('/json/lists.json');
  const lists: ListDTO[] = await response.json();

  return lists.map(list => {
    const { _id, ...rest } = list;
    return {
      ...rest,
      id: _id,
      votes: 0,
      seats: 0,
      district: list.district[0].split('_')[1],
      parties: list.parties.map(partyId => parties[partyId]),
      nominees: list.nominees.map(nominee => {
        const party = parties[nominee.party[0]];
        const photo = `/images/nominees/${nominee._id}.jpg`; // eslint-disable-line no-underscore-dangle
        return { ...nominee, party, photo };
      }),
    };
  });
};

const getResults = async (): Promise<Results[]> => {
  const response = await fetch('/json/results.json');
  if (!response.ok) return [];
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
  const response = await fetch('/json/historics.json');
  const historics: HistoricDTO[] = await response.json();
  return historics;
};

const service: ElectionsService = { getLists, getResults, getHistorics };

export default service;
