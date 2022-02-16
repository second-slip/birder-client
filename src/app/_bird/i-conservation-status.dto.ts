import { IBirdDetail } from "./bird-detail/i-bird-detail.dto";

export interface IConservationStatus {
    conservationStatusId: number;
    conservationList: string;
    conservationListColourCode: string;
    description: string;
    creationDate: Date | string;
    lastUpdateDate: Date | string;
    birds: IBirdDetail[];
}
