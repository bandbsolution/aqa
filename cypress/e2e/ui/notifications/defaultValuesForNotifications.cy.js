import MyProfile from '../../../support/pages/MyProfile';
import { SettingsMenu, SettingsMenuBlocks } from '../../../support/enums';

import { deleteAccount, setupUser } from '../../../support/helper';

const myProfile = new MyProfile();

function checkNotificationsByDefault() {
    cy.iframe('#accSettingsPage')
        .find('[role="region"]')
        .eq(0)
        .then(($region) => {
            const inputs = $region.find('input');

            inputs.each((index, input) => {
                cy.wrap(input).should('be.checked');
            });
        });
}

describe('default values for notifications on new created user', () => {
    let userDataFirst;

    it('all notifications turned on by default and new created user has 0 notifications', () => {
        setupUser().then((data) => {
            userDataFirst = data.userData;
            myProfile.openNotification();
            cy.get('h6').contains('Сповіщення');
            cy.get('p').contains('Немає нових сповіщень');
            myProfile.choseMenuInSettings(SettingsMenu.Notifications, SettingsMenuBlocks.AccountNotifications);
            checkNotificationsByDefault();
            deleteAccount(userDataFirst.password);
        });
    });
});
