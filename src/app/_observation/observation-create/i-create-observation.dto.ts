import { IBirdSummary } from "src/app/_bird/i-bird-summary.dto";
import { IObservationPosition } from "src/app/_map/i-observation-position.dto";
import { IObservationNote } from "src/app/_observation-note/i-observation-note.dto";

export interface ICreateObservation {
    quantity: number;
    observationDateTime: Date; //| string; --> not when posting to the server...
    bird: IBirdSummary;
    position: IObservationPosition;
    notes: IObservationNote[];
}
