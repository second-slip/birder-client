import { ObservationNoteType } from "./observation-note-type";

export interface IObservationNote {
    id: number;
    noteType: ObservationNoteType;
    note: string;
}
