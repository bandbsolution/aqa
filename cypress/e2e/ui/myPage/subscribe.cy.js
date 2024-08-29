import MyProfile from '../../../support/pages/MyProfile';
import { ProfileActions } from '../../../support/enums';
import { login, setupUser } from '../../../support/helper';

const myProfile = new MyProfile();

describe('test all notifications', () => {
    let userDataFirst;
    let userDataSecond;

    before(() => {
        setupUser().then((data) => {
            userDataFirst = data.userData;
            myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
        });
        setupUser().then((data) => {
            userDataSecond = data.userData;
            myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
        });
    });


    it('follow from Second user to First user', () => {
        login(userDataSecond.email, userDataSecond.password);
        cy.get('button').contains('Контакти').click({ force: true });
        cy.get('button').contains('Перейти до пошуку').click({ force: true });
        myProfile.inputInSearchFiled(`${userDataFirst.name} ${userDataFirst.surname}`);
        myProfile.waitFoDataLoad();
        cy.get('button').contains('Контакти').click({ force: true });
        cy.get('[data-testid="PersonOffOutlinedIcon"]').should('be.visible');
        myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
    });
});