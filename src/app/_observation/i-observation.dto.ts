import { IauthUser } from "../_auth/iauth-user.dto";
import { IBirdSummary } from "../_bird/i-bird-summary.dto";
import { IObservationPosition } from "../_map/i-observation-position.dto";
import { IObservationNote } from "../_observationNotes/i-observation-note.dto";

export interface IObservation {
    observationId: number;
    quantity: number;
    observationDateTime: Date | string;
    creationDate: Date | string;
    lastUpdateDate: Date | string;
    birdId: number;
    bird: IBirdSummary;
    user: IauthUser;
    position: IObservationPosition;
    notes: IObservationNote[];
}
