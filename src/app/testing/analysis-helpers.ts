import { IObservationCount } from "../_analysis/observation-count/i-observation-count.dto";
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


// export const fakeIObservationTopFive: IObservationTopFive = {

//     // topObservations: IObservationTopFiveRecord[];
//     // topMonthlyObservations: IObservationTopFiveRecord[];
// }

export const fakeTopObservationsResponse: any =
{
    "topObservations": [
        {
            "birdId": 1002,
            "name": "Arctic Skua",
            "count": 1
        },
        {
            "birdId": 1006,
            "name": "Barn Owl",
            "count": 1
        }
    ],
    "topMonthlyObservations": []
}