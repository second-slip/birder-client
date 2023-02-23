import { tokens } from "./environment.keys";

export const environment = {
  production: true,
  ...tokens.mapKey,
  apiUrl: 'https://birderweb.com',
  ...tokens.photoKey
};