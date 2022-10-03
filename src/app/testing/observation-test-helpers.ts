import { IObservation } from "../_observation/i-observation.dto";
import { IObservationFeed } from "../_observationFeed/i-observation-feed.dto";
import { ObservationNoteType } from "../_observationNotes/observation-note-type";


    // export interface IObservation {
    //     observationId: number;
    //     quantity: number;
    //     observationDateTime: Date | string;
    //     creationDate: Date | string;
    //     lastUpdateDate: Date | string;
    //     birdId: number;
    //     bird: IBirdSummary;
    //     user: IAuthUser;
    //     position: IObservationPosition;
    //     notes: IObservationNote[];
    // }

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


