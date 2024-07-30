import MyProfile from '../support/pages/MyProfile';
import { ProfileActions } from '../support/enums';

import { getUserToken } from '../support/apiHelper';

const myProfile = new MyProfile();

describe('feedback for service', () => {
    let userDataFirst;
    let userDataSecond;
    let accessTokenFirstUser;
    let firstUserServiceDataId;

    before(() => {
        cy.createUser('first').then((user) => {
            cy.activateAccount(user.email);
            userDataFirst = user;
            cy.login(userDataFirst.email, userDataFirst.password);
            getUserToken().then((token) => {
                accessTokenFirstUser = token;
                cy.createServiceAPI(
                    accessTokenFirstUser,
                    '',
                    1,
                    100,
                    'Нова Пошта',
                    'Name for service test notify',
                    "Понеділок,Вівторок,Середа,Четвер,П'ятниця,Субота,Неділя",
                    100,
                    'грн',
                    10,
                    'г',
                    'Є в наявності',
                    'Повна оплата',
                    'Description for service test notify',
                    'Їжа та напої'
                ).then((response) => {
                    cy.log('Response body created SERVICE:', JSON.stringify(response));
                    firstUserServiceDataId = response.result;
                    cy.log('Service id:', firstUserServiceDataId);
                });
            });
        });
        myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
        cy.createUser('second').then((user) => {
            cy.activateAccount(user.email);
            userDataSecond = user;
        });
    });

    it('service without feedback', () => {
        cy.login(userDataSecond.email, userDataSecond.password);
        const serviceUrl = `${Cypress.config('baseUrl')}/service/${firstUserServiceDataId}`;
        cy.visit(serviceUrl);
        myProfile.waitFoDataLoad();
        cy.get('p').contains('У цього товару поки що немає відгуків. Напиши перший відгук!').should('be.visible');

        cy.get('button').contains('Залишити відгук').click();
        cy.get('button').contains('Опублікувати відгук').click();
        cy.get('p').contains('Мінімальна довжина відгука: 1 символ').should('be.visible');

        cy.get('[placeholder="Опиши більш детально свої враження. Нам дійсно важлива твоя думка!"]').type(faker.lorem.words(100));
    });
});
