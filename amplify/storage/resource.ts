import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'amplifyTeamDrive',
    access: (allow) => ({
        'profile-pictures/{entity_id}/*': [
            allow.guest.to(['read'])  // Guests can only read profile pictures
        ],
    })
});
