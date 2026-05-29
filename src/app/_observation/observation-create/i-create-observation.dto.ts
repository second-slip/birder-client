import { IBirdSummary } from "../../_bird/i-bird-summary.dto";
import { IObservationPosition } from "../../_map/i-observation-position.dto";

export interface ICreateObservation {
    quantity: number;
    observationDateTime: Date; //| string; --> not when posting to the server...
    bird: IBirdSummary;
    position: IObservationPosition;
}
