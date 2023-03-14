import { reactive, h, FunctionalComponent } from 'vue';

type I10nOptions = {
  messages: Record<string, any>;
  dateFormat?: Intl.DateTimeFormatOptions;
};

type I10nProps = {
  tag?: string,
  path: string,
};

const REPLACE_REGEX = /{([^{}]+)}/g; // Match text between curly braces

const state = reactive<I10nOptions>({
  messages: {},
  dateFormat: undefined,
});

const objectPath = (obj: Record<string, any>, path: string): any => {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc?.[key], obj) || path;
};

export const createI10n = (options: I10nOptions) => Object.assign(state, options);

export const useI10n = () => {
  const message = (path: string, object?: Record<string, string>): string => {
    const entry = objectPath(state.messages, path) as string;
    return entry.replace(REPLACE_REGEX, (match, key) => object?.[key.trim()] || match);
  };

  const formatDate = (date: Date) => date.toLocaleTimeString([], state.dateFormat);

  const I10n: FunctionalComponent<I10nProps> = (props, ctx) => {
    const entry = objectPath(state.messages, props.path) as string;
    const content = entry.split(REPLACE_REGEX).map(part => ctx.slots[part]?.() || part);
    return h(props.tag || 'p', content);
  };

  return { message, formatDate, I10n };
};
