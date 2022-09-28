import { IObservationCount } from "../_analysis/observation-count/i-observation-count.dto";
import { IUserProfile } from "../_user/user-profile/i-user-profile.dto";

export const username = 'testusername';

export const userProfileModel: IUserProfile = {
    userName: username,
    avatar: '',
    registrationDate: 'Date | string',
    isOwnProfile: true,
    observationCount: {
        totalObservationsCount: 8,
        uniqueSpeciesCount: 5
    },
    followersCount: 1,
    followingCount: 2,
    isFollowing: false,
}

// const count: IObservationCount = {
//     totalObservationsCount: 8,
//     uniqueSpeciesCount: 5
// }