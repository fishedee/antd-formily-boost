export type KeyProps<T> = { [key in keyof T]-?: boolean };
