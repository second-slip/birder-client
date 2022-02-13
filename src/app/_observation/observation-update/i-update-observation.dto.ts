import { IauthUser } from "src/app/_auth/iauth-user.dto";
import { IBirdSummary } from "src/app/_bird/i-bird-summary.dto";
import { IObservationPosition } from "src/app/_map/i-observation-position.dto";
import { IObservationNote } from "src/app/_observationNotes/i-observation-note.dto";

export interface IUpdateObservation {
    observationId: number;
    quantity: number;
    observationDateTime: Date; //| string; --> not when posting to the server...
    // birdId: number;
    bird: IBirdSummary;
    user: IauthUser;
    position: IObservationPosition;
    notes: IObservationNote[];
}