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

export const fakeTweetArchiveArray: ITweet[] =
[
    {
      tweetDayId: 10,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/WICPTAWEIC/XC613745-210107_0534_2363_chapellestadrien_canardsiffleurgroupesvariations_AA.mp3",
      displayDay: "2021-02-27T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1241,
        species: "Mareca penelope",
        englishName: "Wigeon",
        populationSize: "100,000 - 500,000 Individuals",
        btoStatusInBritain: "Resident Breeder, Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 9,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/BLMSIUFTFU/XC513481-190707_1154_jer-np.mp3",
      displayDay: "2021-02-26T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1023,
        species: "Fringilla montifringilla",
        englishName: "Brambling",
        populationSize: "100,000 - 500,000 Individuals",
        btoStatusInBritain: "Scarce Breeder, Passage/Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 8,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/QAJPWEPSTL/XC559850-kleiber0748.mp3",
      displayDay: "2021-02-25T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1146,
        species: "Sitta europaea",
        englishName: "Nuthatch",
        populationSize: "100,000 - 500,000 Territories",
        btoStatusInBritain: "Resident Breeder",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 7,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC617358-LS_56722%20Meerkoet%20calls%20A%20Krakeend%20C.mp3",
      displayDay: "2021-02-24T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1044,
        species: "Fulica atra",
        englishName: "Coot",
        populationSize: "10,000 - 100,000 Pairs",
        btoStatusInBritain: "Resident Breeder, Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 6,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/BBJSEFYVPV/XC578613-Green%20and%20Wood%20Sand%20Audiomoth%2020th%20july.mp3",
      displayDay: "2021-02-23T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1086,
        species: "Tringa ochropus",
        englishName: "Green Sandpiper",
        populationSize: "Not recorded",
        btoStatusInBritain: "Scarce Breeder, Passage/Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 5,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/FFFADKCCII/XC599692-WPig-4104d28.mp3",
      displayDay: "2021-02-22T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1248,
        species: "Columba palumbus",
        englishName: "Woodpigeon",
        populationSize: "5.3 million Pairs",
        btoStatusInBritain: "Resident Breeder, Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 4,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/RVLNPQSYVW/XC572076-200627_8.45(Eurasian%20wren).mp3",
      displayDay: "2021-02-21T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1249,
        species: "Troglodytes troglodytes",
        englishName: "Wren",
        populationSize: "7.7 million Territories",
        btoStatusInBritain: "Resident Breeder, Passage/Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    },
    {
      tweetDayId: 3,
      songUrl: "http://www.xeno-canto.org/sounds/uploaded/HNYFHZLJOD/XC617349-210125-DU%20clip.mp3",
      displayDay: "2021-02-20T00:00:00Z",
      creationDate: "2021-01-29T15:16:39.26Z",
      lastUpdateDate: "2021-01-29T15:16:39.26Z",
      bird: {
        birdId: 1058,
        species: "Prunella modularis",
        englishName: "Dunnock",
        populationSize: "2.3 million Territories",
        btoStatusInBritain: "Resident Breeder, Passage/Winter Visitor",
        thumbnailUrl: null,
        conservationStatus: '',
        conservationListColourCode: '',
        birderStatus: "Common"
      }
    }
  ]

export const fakeTweetArchiveResponse = 
[
    {
        "tweetDayId": 10,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/WICPTAWEIC/XC613745-210107_0534_2363_chapellestadrien_canardsiffleurgroupesvariations_AA.mp3",
        "displayDay": "2021-02-27T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1241,
            "species": "Mareca penelope",
            "englishName": "Wigeon",
            "populationSize": "100,000 - 500,000 Individuals",
            "btoStatusInBritain": "Resident Breeder, Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 9,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/BLMSIUFTFU/XC513481-190707_1154_jer-np.mp3",
        "displayDay": "2021-02-26T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1023,
            "species": "Fringilla montifringilla",
            "englishName": "Brambling",
            "populationSize": "100,000 - 500,000 Individuals",
            "btoStatusInBritain": "Scarce Breeder, Passage/Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 8,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/QAJPWEPSTL/XC559850-kleiber0748.mp3",
        "displayDay": "2021-02-25T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1146,
            "species": "Sitta europaea",
            "englishName": "Nuthatch",
            "populationSize": "100,000 - 500,000 Territories",
            "btoStatusInBritain": "Resident Breeder",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 7,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/OOECIWCSWV/XC617358-LS_56722%20Meerkoet%20calls%20A%20Krakeend%20C.mp3",
        "displayDay": "2021-02-24T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1044,
            "species": "Fulica atra",
            "englishName": "Coot",
            "populationSize": "10,000 - 100,000 Pairs",
            "btoStatusInBritain": "Resident Breeder, Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 6,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/BBJSEFYVPV/XC578613-Green%20and%20Wood%20Sand%20Audiomoth%2020th%20july.mp3",
        "displayDay": "2021-02-23T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1086,
            "species": "Tringa ochropus",
            "englishName": "Green Sandpiper",
            "populationSize": "Not recorded",
            "btoStatusInBritain": "Scarce Breeder, Passage/Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 5,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/FFFADKCCII/XC599692-WPig-4104d28.mp3",
        "displayDay": "2021-02-22T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1248,
            "species": "Columba palumbus",
            "englishName": "Woodpigeon",
            "populationSize": "5.3 million Pairs",
            "btoStatusInBritain": "Resident Breeder, Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 4,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/RVLNPQSYVW/XC572076-200627_8.45(Eurasian%20wren).mp3",
        "displayDay": "2021-02-21T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1249,
            "species": "Troglodytes troglodytes",
            "englishName": "Wren",
            "populationSize": "7.7 million Territories",
            "btoStatusInBritain": "Resident Breeder, Passage/Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    },
    {
        "tweetDayId": 3,
        "songUrl": "http://www.xeno-canto.org/sounds/uploaded/HNYFHZLJOD/XC617349-210125-DU%20clip.mp3",
        "displayDay": "2021-02-20T00:00:00Z",
        "creationDate": "2021-01-29T15:16:39.26Z",
        "lastUpdateDate": "2021-01-29T15:16:39.26Z",
        "bird": {
            "birdId": 1058,
            "species": "Prunella modularis",
            "englishName": "Dunnock",
            "populationSize": "2.3 million Territories",
            "btoStatusInBritain": "Resident Breeder, Passage/Winter Visitor",
            "thumbnailUrl": null,
            "conservationStatus": "",
            "conservationListColourCode": "",
            "birderStatus": "Common"
        }
    }
]