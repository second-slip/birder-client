import { ILifeList } from "../_list/life-list/i-life-list.dto";

function generateLifeListArray(): ILifeList[] {
    const data = [];
    for (let i = 0; i < 40; i++) {
        data.push(
            {
                birdId: 1044,
                englishName: 'Coot',
                species: 'Fulica atra',
                populationSize: '10,000 - 100,000 Pairs',
                btoStatusInBritain: 'Resident Breeder, Winter Visitor',
                conservationStatus: 'Green',
                conservationListColourCode: 'Green',
                count: 4
            }
        );
    }
    return data;
}
export const lifeListLongList = generateLifeListArray();

export const lifeListModel: ILifeList[] = [
    {
        birdId: 1044,
        englishName: 'Coot',
        species: 'Fulica atra',
        populationSize: '10,000 - 100,000 Pairs',
        btoStatusInBritain: 'Resident Breeder, Winter Visitor',
        conservationStatus: 'Green',
        conservationListColourCode: 'Green',
        count: 4
    },
    {
        birdId: 1225,
        englishName: 'Tufted Duck',
        species: 'Aythya fuligula',
        populationSize: '10,000 - 100,000 Pairs',
        btoStatusInBritain: 'Resident Breeder, Passage/Winter Visitor',
        conservationStatus: 'Green',
        conservationListColourCode: 'Green',
        count: 4
    },
    {
        birdId: 1143,
        englishName: 'Mute Swan',
        species: 'Cygnus olor',
        populationSize: '1,000 - 10,000 Pairs',
        btoStatusInBritain: 'Resident/Introduced Breeder',
        conservationStatus: 'Amber',
        conservationListColourCode: 'Yellow',
        count: 3
    }
];

export const lifeListResponse = [
    {
        "birdId": 1044,
        "englishName": "Coot",
        "species": "Fulica atra",
        "populationSize": "10,000 - 100,000 Pairs",
        "btoStatusInBritain": "Resident Breeder, Winter Visitor",
        "conservationStatus": "Green",
        "conservationListColourCode": "Green",
        "count": 4
    },
    {
        "birdId": 1225,
        "englishName": "Tufted Duck",
        "species": "Aythya fuligula",
        "populationSize": "10,000 - 100,000 Pairs",
        "btoStatusInBritain": "Resident Breeder, Passage/Winter Visitor",
        "conservationStatus": "Green",
        "conservationListColourCode": "Green",
        "count": 4
    },
    {
        "birdId": 1143,
        "englishName": "Mute Swan",
        "species": "Cygnus olor",
        "populationSize": "1,000 - 10,000 Pairs",
        "btoStatusInBritain": "Resident/Introduced Breeder",
        "conservationStatus": "Amber",
        "conservationListColourCode": "Yellow",
        "count": 3
    }
];