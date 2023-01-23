import { IUserProfile } from "../_user/user-profile/i-user-profile.dto";

export const username = 'testusername';

export const userProfileModel: IUserProfile = {
    user: {
        avatar: "",
        userName: username,
        isFollowing: true,
        isOwnProfile: true
    },
    registrationDate: new Date,
    observationCount: {
        totalObservationsCount: 8,
        uniqueSpeciesCount: 5
    },
    followersCount: 1,
    followingCount: 2
}