import { writeFile } from 'fs';

// import {name, version} from '../package.json';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    production: true,
    mapKey: '${process.env.MAPKEY}',
    apiUrl: 'https://birderweb.com',
    photoKey: '${process.env.PHOTOKEY}'
  };
  `;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
    if (err) {
        return console.log('hello 1' + err);
    }
});