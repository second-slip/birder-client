import { IObservationCount } from "../../_analysis/observation-count/i-observation-count.dto";
import { INetworkUser } from "../../_network/i-network-user.dto";

export interface IUserProfile {
    user: INetworkUser;
    registrationDate: Date | string;
    observationCount: IObservationCount;
    followersCount: number;
    followingCount: number;
}
