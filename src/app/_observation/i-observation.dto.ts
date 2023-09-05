import { IBirdSummary } from "../_bird/i-bird-summary.dto";
import { IObservationPosition } from "../_map/i-observation-position.dto";

export interface IObservation {
    observationId: number;
    quantity: number;
    observationDateTime: Date | string;
    creationDate: Date | string;
    lastUpdateDate: Date | string;
    // birdId: number;
    bird: IBirdSummary;
    username: string;
    // user: IAuthUser;
    position: IObservationPosition;

    // notes: IObservationNote[];
}
