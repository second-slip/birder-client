import { IObservationPosition } from "../_map/i-observation-position.dto";
import { IObservation } from "../_observation/i-observation.dto";
import { ICreateObservation } from "../_observation/observation-create/i-create-observation.dto";
import { IUpdateObservation } from "../_observation/observation-update/i-update-observation.dto";
import { IObservationNote } from "../_observation-note/i-observation-note.dto";
import { authUserName, userModel } from "./auth-test-helpers";
import { ObservationNoteType } from "../_observation-note/observation-note-type";
import { fakeIBirdSummary } from "./birds-helpers";

export const observationId = 10090;
export const quantity = 5;
export const observationDateTime = new Date('Tue Oct 04 2022 09:38:50 GMT+0100');
export const observationPosition: IObservationPosition = {
  observationPositionId: 1,
  latitude: 1.9,
  longitude: -6.7,
  formattedAddress: 'address',
  shortAddress: 'short_address'
}
export const notes: IObservationNote[] = [
  {
    id: 1,
    noteType: ObservationNoteType['Weather'],
    note: 'example note 1'
  },
  {
    id: 2,
    noteType: ObservationNoteType['General'],
    note: 'example note 2'
  }
];

export const createObservationModel: ICreateObservation = {
  quantity: quantity,
  observationDateTime: observationDateTime, //| string; --> not when posting to the server...
  bird: fakeIBirdSummary,
  position: observationPosition,
  notes: notes
}

export const updateObservationModel: IUpdateObservation = {
  observationId: observationId,
  quantity: quantity,
  observationDateTime: observationDateTime, //| string, --> not when posting to the server...
  bird: fakeIBirdSummary,
  user: userModel,
  position: observationPosition,
  notes: notes
}







export const singleObservation: IObservation = {
  "observationId": 10090,
  "quantity": 1,
  "observationDateTime": "2022-01-29T13:26:26Z",
  "creationDate": "2022-01-30T17:26:56.6266781Z",
  "lastUpdateDate": "2022-01-30T17:26:56.6266781Z",
  "birdId": 1177,
  "bird": {
    "birdId": 1177,
    "species": "Erithacus rubecula",
    "englishName": "Robin",
    "populationSize": "6 million Territories",
    "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
    "thumbnailUrl": null,
    "conservationStatus": '',
    "conservationListColourCode": '',
    "birderStatus": "Common"
  },
  "position": {
    "observationPositionId": 90,
    "latitude": 53.431684,
    "longitude": -2.3001578,
    "formattedAddress": "Sale Water Park, Rifle Rd, Sale M33 2LX, UK",
    "shortAddress": "Sale, United Kingdom"
  },
  "user": {
    "userName": "Andrew",
    "avatar": "https://img.icons8.com/color/96/000000/user.png",
    "defaultLocationLatitude": 53.4425934,
    "defaultLocationLongitude": -2.2769052
  },
  "notes": [
    {
      "id": 6,
      "noteType": ObservationNoteType["General"],
      "note": "Observed from the Broad Ees Dole hide."
    },
    {
      "id": 7,
      "noteType": ObservationNoteType["Weather"],
      "note": "Clear winter day"
    }
  ]
}

export const singleObservationAuthUser: IObservation = {
  "observationId": 10090,
  "quantity": 1,
  "observationDateTime": "2022-01-29T13:26:26Z",
  "creationDate": "2022-01-30T17:26:56.6266781Z",
  "lastUpdateDate": "2022-01-30T17:26:56.6266781Z",
  "birdId": 1177,
  "bird": {
    "birdId": 1177,
    "species": "Erithacus rubecula",
    "englishName": "Robin",
    "populationSize": "6 million Territories",
    "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
    "thumbnailUrl": null,
    "conservationStatus": '',
    "conservationListColourCode": '',
    "birderStatus": "Common"
  },
  "position": {
    "observationPositionId": 90,
    "latitude": 53.431684,
    "longitude": -2.3001578,
    "formattedAddress": "Sale Water Park, Rifle Rd, Sale M33 2LX, UK",
    "shortAddress": "Sale, United Kingdom"
  },
  "user": {
    "userName": authUserName,
    "avatar": "https://img.icons8.com/color/96/000000/user.png",
    "defaultLocationLatitude": 53.4425934,
    "defaultLocationLongitude": -2.2769052
  },
  "notes": [
    {
      "id": 6,
      "noteType": ObservationNoteType["General"],
      "note": "Observed from the Broad Ees Dole hide."
    },
    {
      "id": 7,
      "noteType": ObservationNoteType["Weather"],
      "note": "Clear winter day"
    }
  ]
}

export const singleObservationResponse = {
  "observationId": 10090,
  "quantity": 1,
  "observationDateTime": "2022-01-29T13:26:26Z",
  "creationDate": "2022-01-30T17:26:56.6266781Z",
  "lastUpdateDate": "2022-01-30T17:26:56.6266781Z",
  "birdId": 1177,
  "bird": {
    "birdId": 1177,
    "species": "Erithacus rubecula",
    "englishName": "Robin",
    "populationSize": "6 million Territories",
    "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
    "thumbnailUrl": null,
    "conservationStatus": '',
    "conservationListColourCode": '',
    "birderStatus": "Common"
  },
  "position": {
    "observationPositionId": 90,
    "latitude": 53.431684,
    "longitude": -2.3001578,
    "formattedAddress": "Sale Water Park, Rifle Rd, Sale M33 2LX, UK",
    "shortAddress": "Sale, United Kingdom"
  },
  "user": {
    "userName": "Andrew",
    "avatar": "https://img.icons8.com/color/96/000000/user.png",
    "defaultLocationLatitude": 53.4425934,
    "defaultLocationLongitude": -2.2769052
  },
  "notes": [
    {
      "id": 6,
      "noteType": "General",
      "note": "Observed from the Broad Ees Dole hide."
    },
    {
      "id": 7,
      "noteType": "Weather",
      "note": "Clear winter day"
    }
  ]
};


