import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IBirdSummary } from 'src/app/_bird/i-bird-summary.dto';

import { SelectSpeciesService } from './select-species.service';

const apiUrl = `api/birds/ddl`;

describe('SelectSpeciesService', () => {
  let service: SelectSpeciesService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SelectSpeciesService]
    });
    service = TestBed.inject(SelectSpeciesService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches data', () => {
    let actualBirdsState: IBirdSummary[] | null | undefined;
    let actualErrorState: boolean | undefined;

    service.getData();

    service.isError
      .subscribe((error) => {
        actualErrorState = error;
      });

    controller.expectOne(apiUrl).flush(BirdsDddlResponse);

    actualBirdsState = service.getBirds;

    expect(actualBirdsState).toEqual(BirdsDddlResponse);
    expect(actualErrorState).toBeFalse();
  });

  it('#getData should use GET to retrieve data', () => {
    service.getData();
    const testRequest = controller.expectOne(apiUrl);
    expect(testRequest.request.method).toEqual('GET');
  });

  it('passes the errors through', () => {
    let actualBirdsState: IBirdSummary[] | null | undefined;
    let actualErrorState: boolean | undefined;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ProgressEvent('API error');

    service.getData();

    service.isError.subscribe((error) => {
      actualErrorState = error;
    });

    controller.expectOne(apiUrl).error(errorEvent, { status, statusText });

    actualBirdsState = service.getBirds;

    expect(actualBirdsState).toEqual([]);
    expect(actualErrorState).toBeTrue();
  });
});


export const BirdsDddlResponse =
  [
    {
      "birdId": 1002,
      "species": "Stercorarius parasiticus",
      "englishName": "Arctic Skua",
      "populationSize": "1,000 - 10,000 Pairs",
      "btoStatusInBritain": "Migrant Breeder, Passage Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    },
    {
      "birdId": 1003,
      "species": "Sterna paradisaea",
      "englishName": "Arctic Tern",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Migrant Breeder, Passage Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1004,
      "species": "Recurvirostra avosetta",
      "englishName": "Avocet",
      "populationSize": "1,000 - 10,000 Pairs",
      "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1005,
      "species": "Puffinus mauretanicus",
      "englishName": "Balearic Shearwater",
      "populationSize": "1,000 - 10,000 Birds",
      "btoStatusInBritain": "Passage Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    },
    {
      "birdId": 1006,
      "species": "Tyto alba",
      "englishName": "Barn Owl",
      "populationSize": "1,000 - 10,000 Pairs",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1007,
      "species": "Branta leucopsis",
      "englishName": "Barnacle Goose",
      "populationSize": "10,000 - 100,000 Individuals",
      "btoStatusInBritain": "Escaped Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1008,
      "species": "Limosa lapponica",
      "englishName": "Bar-tailed Godwit",
      "populationSize": "10,000 - 100,000 Individuals",
      "btoStatusInBritain": "Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1009,
      "species": "Panurus biarmicus",
      "englishName": "Bearded Tit",
      "populationSize": "500 - 1000 Pairs",
      "btoStatusInBritain": "Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1010,
      "species": "Cygnus columbianus",
      "englishName": "Bewick's Swan",
      "populationSize": "1,000 - 10,000 Individuals",
      "btoStatusInBritain": "Winter Migrant",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1012,
      "species": "Lyrurus tetrix",
      "englishName": "Black Grouse",
      "populationSize": "1,000 - 10,000 Males",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    },
    {
      "birdId": 1013,
      "species": "Cepphus grylle",
      "englishName": "Black Guillemot",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1015,
      "species": "Chlidonias niger",
      "englishName": "Black Tern",
      "populationSize": "Not recorded",
      "btoStatusInBritain": "Former Breeder, Passage Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1016,
      "species": "Turdus merula",
      "englishName": "Blackbird",
      "populationSize": "4.9 million Pairs",
      "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1017,
      "species": "Sylvia atricapilla",
      "englishName": "Blackcap",
      "populationSize": "1.1 million Territories",
      "btoStatusInBritain": "Migrant Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1018,
      "species": "Chroicocephalus ridibundus",
      "englishName": "Black-headed Gull",
      "populationSize": "100,000 - 500,000 Pairs",
      "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1021,
      "species": "Gavia arctica",
      "englishName": "Black-throated Diver",
      "populationSize": "100-500 Pairs",
      "btoStatusInBritain": "Migrant/Resident Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1022,
      "species": "Cyanistes caeruleus",
      "englishName": "Blue Tit",
      "populationSize": "3.4 million Territories",
      "btoStatusInBritain": "Resident Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1023,
      "species": "Fringilla montifringilla",
      "englishName": "Brambling",
      "populationSize": "100,000 - 500,000 Individuals",
      "btoStatusInBritain": "Scarce Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1024,
      "species": "Branta bernicla",
      "englishName": "Brent Goose",
      "populationSize": "10,000 - 100,000 Individuals",
      "btoStatusInBritain": "Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1025,
      "species": "Pyrrhula pyrrhula",
      "englishName": "Bullfinch",
      "populationSize": "100,000 - 500,000 Territories",
      "btoStatusInBritain": "Resident Breeder, Scarce Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1026,
      "species": "Buteo buteo",
      "englishName": "Buzzard",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1027,
      "species": "Branta canadensis",
      "englishName": "Canada Goose",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Introduced Breeder, Accidental",
      "thumbnailUrl": null,
      "conservationStatus": "Not assessed",
      "conservationListColourCode": "Black",
      "birderStatus": "Common"
    },
    {
      "birdId": 1028,
      "species": "Tetrao urogallus",
      "englishName": "Capercaillie",
      "populationSize": "Not recorded",
      "btoStatusInBritain": "Not recorded",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    },
    {
      "birdId": 1029,
      "species": "Corvus corone",
      "englishName": "Carrion Crow",
      "populationSize": "1 million Territories",
      "btoStatusInBritain": "Resident Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1030,
      "species": "Larus cachinnans",
      "englishName": "Caspian Gull",
      "populationSize": "Not recorded",
      "btoStatusInBritain": "Scarce Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1031,
      "species": "Cettia cetti",
      "englishName": "Cetti's Warbler",
      "populationSize": "1,000 - 10,000 Males",
      "btoStatusInBritain": "Resident Breeder, Passage Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1032,
      "species": "Fringilla coelebs",
      "englishName": "Chaffinch",
      "populationSize": "5.8 million Territories",
      "btoStatusInBritain": "Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1033,
      "species": "Phylloscopus collybita",
      "englishName": "Chiffchaff",
      "populationSize": "1.1 million Territories",
      "btoStatusInBritain": "Migrant Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1034,
      "species": "Pyrrhocorax pyrrhocorax",
      "englishName": "Chough",
      "populationSize": "100-500 Pairs",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1035,
      "species": "Emberiza cirlus",
      "englishName": "Cirl Bunting",
      "populationSize": "1,000 - 10,000 Territories",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    },
    {
      "birdId": 1036,
      "species": "Periparus ater",
      "englishName": "Coal Tit",
      "populationSize": "500,000 - 1 million Territories",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1085,
      "species": "Parus major",
      "englishName": "Great Tit",
      "populationSize": "2.5 million Territories",
      "btoStatusInBritain": "Resident Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1086,
      "species": "Tringa ochropus",
      "englishName": "Green Sandpiper",
      "populationSize": "Not recorded",
      "btoStatusInBritain": "Scarce Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1087,
      "species": "Picus viridis",
      "englishName": "Green Woodpecker",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Resident Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1088,
      "species": "Chloris chloris",
      "englishName": "Greenfinch",
      "populationSize": "1.7 million Pairs",
      "btoStatusInBritain": "Resident Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1089,
      "species": "Tringa nebularia",
      "englishName": "Greenshank",
      "populationSize": "1,000 - 10,000 Pairs",
      "btoStatusInBritain": "Migrant/Resident Breeder, Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1090,
      "species": "Ardea cinerea",
      "englishName": "Grey Heron",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Resident Breeder, Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Green",
      "conservationListColourCode": "Green",
      "birderStatus": "Common"
    },
    {
      "birdId": 1091,
      "species": "Perdix perdix",
      "englishName": "Grey Partridge",
      "populationSize": "10,000 - 100,000 Territories",
      "btoStatusInBritain": "Resident/Introduced Breeder",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    },
    {
      "birdId": 1092,
      "species": "Pluvialis squatarola",
      "englishName": "Grey Plover",
      "populationSize": "10,000 - 100,000 Individuals",
      "btoStatusInBritain": "Passage/Winter Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Amber",
      "conservationListColourCode": "Yellow",
      "birderStatus": "Common"
    },
    {
      "birdId": 1093,
      "species": "Motacilla cinerea",
      "englishName": "Grey Wagtail",
      "populationSize": "10,000 - 100,000 Pairs",
      "btoStatusInBritain": "Resident Breeder, Passage Visitor",
      "thumbnailUrl": null,
      "conservationStatus": "Red",
      "conservationListColourCode": "Red",
      "birderStatus": "Common"
    }
  ];