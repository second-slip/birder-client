import { tokens } from "./environment.keys";

export const environment = {
    production: false,
    ...tokens.mapKey,
    ...tokens.photoKey
  };
  