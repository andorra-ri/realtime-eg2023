import type { List } from '/@/types';

export * from 'stats-fns';

export type AttributesOfType<T, V> = {
  [K in keyof T]: (T[K] extends V ? K : never)
}[keyof T];

interface GroupBy {
  <T extends object, V>(items: T[], grouper: (item: T, i: number) => V): Map<V, T[]>;
  <T extends object, V extends keyof T>(items: T[], grouper: V): Map<T[V], T[]>;
}

export const groupBy: GroupBy = <T extends object, V>(
  items: T[],
  grouper: ((item: T, i: number) => V) | keyof T,
) => items.reduce((acc, item, i) => {
    const key = typeof grouper === 'function' ? grouper(item, i) : item[grouper];
    acc.set(key, [...(acc.get(key) || []), item]);
    return acc;
  }, new Map<V | T[keyof T], T[]>());

export const indexate = <
  T extends Record<string | number | symbol, any>,
  K extends AttributesOfType<T, string | number | symbol>,
>(items: T[], attr: K) => items.reduce((acc, item) => {
    acc[item[attr]] = item;
    return acc;
  }, {} as Record<T[K], T>);

export const isTie = (lists: List[]) => {
  const votes = lists.map(list => list.votes);
  return new Set(votes).size !== lists.length;
};
