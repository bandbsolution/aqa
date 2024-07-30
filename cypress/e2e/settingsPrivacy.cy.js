import MyProfile from '../support/pages/MyProfile';
import { changeUserAPI, getUserToken } from '../support/apiHelper';
import { ProfileActions, SettingsMenu, SettingsMenuBlocks, Switcher } from '../support/enums';

const myProfile = new MyProfile();

describe('settings - privacy', () => {

    let userData;

    before(() => {
        cy.createUser('first').then((user) => {
            cy.activateAccount(user.email);
            userData = user;
            cy.login(userData.email, userData.password);
            getUserToken().then((token) => {
                changeUserAPI(token, userData.name, userData.surname, userData.nickname, 'Амбуків', 'Волинська', 'Україна', 'autotest', '+380999999999',).then((response) => {
                    cy.log('UPDATE USER RESPONSE:', JSON.stringify(response))
                });
            });
        });
    });

    after(() => {
        cy.deleteAccount(userData.password);
    });

    it('not hidden user data in search', () => {
        myProfile.openSearchPage();
        myProfile.chooseInSwitcher(Switcher.PEOPLE);
        myProfile.inputInSearchFiled(`${userData.name} ${userData.surname}`);
        myProfile.waitFoDataLoad();
        cy.get('p').contains(`${userData.name} ${userData.surname}`).should('be.visible');
        cy.get('p').contains(`@${userData.nickname}`).should('be.visible');
        cy.get('p').contains(`Амбуків, Волинська обл., Україна`).should('be.visible');
        cy.get('p').contains(`+380999999999`).should('be.visible');
    });

    it('hidde user data throw settings - search page', () => {
        cy.login(userData.email, userData.password);
        myProfile.choseMenuInSettings(SettingsMenu.SettingsAccount, SettingsMenuBlocks.Privacy);

        cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(0).should('not.be.checked').click({ force: true });
        cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(1).should('not.be.checked').click({ force: true });
        cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(2).should('not.be.checked').click({ force: true });

        cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(0).should('be.checked');
        cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(1).should('be.checked');
        cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(2).should('be.checked');

        myProfile.openSearchPage();
        myProfile.chooseInSwitcher(Switcher.PEOPLE);
        myProfile.inputInSearchFiled(`${userData.name} ${userData.surname}`);
        myProfile.waitFoDataLoad();
        cy.get('p').contains(`${userData.name} ${userData.surname}`).should('be.visible');
        cy.get('p').contains(`@${userData.nickname}`).should('be.visible');
        cy.get('p').contains(`Амбуків, Волинська обл., Україна`).should('be.visible');
        cy.get('p').contains(`+380999999999`).should('be.visible');
    });
});
