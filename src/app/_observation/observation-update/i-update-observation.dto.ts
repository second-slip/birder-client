import { IBirdSummary } from "src/app/_bird/i-bird-summary.dto";
import { IObservationPosition } from "src/app/_map/i-observation-position.dto";

export interface IUpdateObservation {
    observationId: number;
    quantity: number;
    observationDateTime: Date; // | string; --> not when posting to the server...
    username: string;
    bird: IBirdSummary;
    position: IObservationPosition;
    creationDate: Date | string;
    lastUpdateDate: Date | string;
}
