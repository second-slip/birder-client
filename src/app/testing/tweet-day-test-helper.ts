import { IBirdSummary } from "src/app/_bird/i-bird-summary.dto";
import { ITweet } from "../_tweet/i-tweet.dto";

export const fakeIBirdSummary: IBirdSummary = {
    birdId: 1113,
    species: 'Vanellus vanellus',
    englishName: 'Lapwing',
    populationSize: '100,000 - 500,000 Pairs',
    btoStatusInBritain: 'Migrant/Resident Breeder, Passage/Winter Visitor',
    thumbnailUrl: null,
    conservationStatus: '',
    conservationListColourCode: '',
    birderStatus: 'Common'
}

export const fakeITweet: ITweet = 
{
    tweetDayId: 1,
    songUrl: 'https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/XC448690--Tofsvipa-varningsl%C3%A4te-Eneb%C3%A5gsudden%2C%20Brevik%20Vg-%282017-05-01%2012.05%29-LS140667.mp3',
    displayDay: '2021-02-18T00:00:00Z',
    creationDate: '2020-11-27T22:30:26.5866667Z',
    lastUpdateDate: '2021-01-29T14:32:24.91Z',
    bird: fakeIBirdSummary // {} as IBirdSummary
};


// important to check that the object is valid JSON!
// use https://jsonlint.com/ to validate the object
// it causes all sorts of issues if the object is not valid!!!!!
export const fakeTweetResponse: any =
{
    "tweetDayId": 1,
    "songUrl": "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/XC448690--Tofsvipa-varningsl%C3%A4te-Eneb%C3%A5gsudden%2C%20Brevik%20Vg-%282017-05-01%2012.05%29-LS140667.mp3",
    "displayDay": "2021-02-18T00:00:00Z",
    "creationDate": "2020-11-27T22:30:26.5866667Z",
    "lastUpdateDate": "2021-01-29T14:32:24.91Z",
    "bird": {
        "birdId": 1113,
        "species": "Vanellus vanellus",
        "englishName": "Lapwing",
        "populationSize": "100,000 - 500,000 Pairs",
        "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
        "thumbnailUrl": null,
        "conservationStatus": "",
        "conservationListColourCode": "",
        "birderStatus": "Common"
    }
}