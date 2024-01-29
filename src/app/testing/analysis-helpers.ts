import { IObservationCount } from "../_analysis/observation-count/i-observation-count.dto";
import { IObservationTopFiveRecord } from "../_analysis/observation-top-five/i-observation-top-five-record.dto";
import { IObservationTopFive } from "../_analysis/observation-top-five/i-observation-top-five.dto";

export const fakeIObservationCount: IObservationCount =
{
    totalObservationsCount: 123,
    uniqueSpeciesCount: 57
};

export const fakeIObservationCountIsZero: IObservationCount =
{
    totalObservationsCount: 0,
    uniqueSpeciesCount: 0
};


// important to check that the object is valid JSON!
// use https://jsonlint.com/ to validate the object
// it causes all sorts of issues if the object is not valid!!!!!
export const fakeObservationCountResponse: any =
{
    "totalObservationsCount": 123,
    "uniqueSpeciesCount": 57
}

export const fakeTopObservationsArray: IObservationTopFiveRecord[] =
    [
        {
            "birdId": 1004,
            "name": "Avocet",
            "count": 1
        },
        {
            "birdId": 1022,
            "name": "Blue Tit",
            "count": 1
        },
        {
            "birdId": 1023,
            "name": "Brambling",
            "count": 1
        },
        {
            "birdId": 1037,
            "name": "Collared Dove",
            "count": 1
        },
        {
            "birdId": 1090,
            "name": "Grey Heron",
            "count": 1
        }
    ]


export const fakeIObservationTopFive: IObservationTopFive = {
    topObservations: [
        {
            "birdId": 1004,
            "name": "Avocet",
            "count": 1
        },
        {
            "birdId": 1022,
            "name": "Blue Tit",
            "count": 1
        },
        {
            "birdId": 1023,
            "name": "Brambling",
            "count": 1
        },
        {
            "birdId": 1037,
            "name": "Collared Dove",
            "count": 1
        },
        {
            "birdId": 1090,
            "name": "Grey Heron",
            "count": 1
        }
    ],
    topMonthlyObservations: [
        {
            "birdId": 1022,
            "name": "Blue Tit",
            "count": 1
        },
        {
            "birdId": 1037,
            "name": "Collared Dove",
            "count": 1
        },
        {
            "birdId": 1090,
            "name": "Grey Heron",
            "count": 1
        },
        {
            "birdId": 1143,
            "name": "Mute Swan",
            "count": 1
        },
        {
            "birdId": 1225,
            "name": "Tufted Duck",
            "count": 1
        }
    ]
}

export const fakeIObservationTopFiveEmpty: IObservationTopFive =
{
    topObservations: [],
    topMonthlyObservations: []
}

export const fakeTopObservationsResponse: any =
{
    "topObservations": [
        {
            "birdId": 1004,
            "name": "Avocet",
            "count": 1
        },
        {
            "birdId": 1022,
            "name": "Blue Tit",
            "count": 1
        },
        {
            "birdId": 1023,
            "name": "Brambling",
            "count": 1
        },
        {
            "birdId": 1037,
            "name": "Collared Dove",
            "count": 1
        },
        {
            "birdId": 1090,
            "name": "Grey Heron",
            "count": 1
        }
    ],
    "topMonthlyObservations": [
        {
            "birdId": 1022,
            "name": "Blue Tit",
            "count": 1
        },
        {
            "birdId": 1037,
            "name": "Collared Dove",
            "count": 1
        },
        {
            "birdId": 1090,
            "name": "Grey Heron",
            "count": 1
        },
        {
            "birdId": 1143,
            "name": "Mute Swan",
            "count": 1
        },
        {
            "birdId": 1225,
            "name": "Tufted Duck",
            "count": 1
        }
    ]
}