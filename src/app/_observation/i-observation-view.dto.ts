import { IObservationPosition } from "../_map/i-observation-position.dto";
import { IObservationNote } from "../_observation-note/i-observation-note.dto";

export interface IObservationViewDto {
    observationId: number;
    quantity: number;
    observationDateTime: string;
    birdId: number;
    species: string;
    englishName: string;
    username: string;
    position: IObservationPosition;
    notes: IObservationNote[];
    notesCount: number;
    creationDate: string;
    lastUpdateDate: string;
}
