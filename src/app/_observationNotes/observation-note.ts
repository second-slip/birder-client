import { ObservationNoteType } from "./observation-note-type";

export class ObservationNote {
    constructor(
        public id: number,
        public noteType: ObservationNoteType,
        public note: string,
    ) { }
}


