import { writeFile } from 'fs';

// import {name, version} from '../package.json';

const targetPath = './src/environments/environment.prod.ts';

// const envConfigFile = `export const environment = {
//    production: true,
//    firebase: {
//         apiKey: '${process.env.FIREBASE_API_KEY}'
//     },
//     name: '${name}',
//     version: '${version}'
// };
// `;

// const envConfigFile = `export const environment = {
//     production: true,
//     ...tokens.mapKey, //mapKey: 'AIzaSyD4IghqI4x7Sld9KP3sP6FtbN7wCPGySmY',
//     apiUrl: 'https://birderweb.com',
//     ...tokens.photoKey //: '03338e2c98b507aaf9fbd0f8f045581b'
//   };
//   `;

const envConfigFile = `export const environment = {
    production: true,
    mapKey: 'hello,
    apiUrl: 'https://birderweb.com',
    photoKey: 'hello'
  };`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
    if (err) {
        return console.log('hello 1' + err);
    }
});
