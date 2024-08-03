import MyProfile from '../../../support/pages/MyProfile';
import { SettingsMenu, SettingsMenuBlocks } from '../../../support/enums';

import { deleteAccount, setupUser } from '../../../support/helper';

const myProfile = new MyProfile();

function checkNotificationsByDefault() {
    cy.iframe('#accSettingsPage')
        .find('[role="region"]')
        .eq(1)
        .then(($region) => {
            const inputs = $region.find('input');

            inputs.each((index, input) => {
                cy.wrap(input).should('be.checked');
            });
        });
}

describe('default values for email subscribes on new created user', () => {
    let userDataFirst;

    it('all email subscribes turned on by default', () => {
        setupUser().then((data) => {
            userDataFirst = data.userData;
            myProfile.choseMenuInSettings(SettingsMenu.Notifications, SettingsMenuBlocks.EmailSubscription);
            checkNotificationsByDefault();
            deleteAccount(userDataFirst.password);
        });
    });
});
