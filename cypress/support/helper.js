import { faker } from '@faker-js/faker';

import MainPage from '../support/pages/MainPage';
import AuthModals from '../support/modals/AuthModals';

export function createUser(customEmail, customNickname, shouldAssert = true) {
    const mainPage = new MainPage();
    const authModals = new AuthModals();

    const password = '12345678aA';
    const email = customEmail || faker.internet.email();
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const nickname = customNickname || faker.internet.userName();

    mainPage.visit();
    mainPage.openLoginModal();
    authModals.clickOnCreateAcc();
    authModals.typeName(name);
    authModals.typeSurname(surname);
    authModals.typeNickname(nickname);
    authModals.typeEmail(email);
    authModals.typePassword(password);
    authModals.typeConfirmPassword(password);
    authModals.agreeRegisterCheckbox();
    authModals.clickOnRegisterButton();
    if (shouldAssert) {
        authModals.assertSuccessRegisterAccount();
    }

    return cy.wrap({ email, password, name, surname, nickname });
}

export function setupUser() {
    let userData;
    let token;

    return createUser().then((user) => {
        userData = user;
        return cy.activateAccount(user.email).then(() => {
            return cy.login(userData.email, userData.password).then(() => {
                token = window.localStorage.getItem('accessToken');
                return { userData, token };
            });
        });
    });
}

export function checkRequiredFields(expectedCount) {
    cy.get('form').within(() => {
        cy.get('div')
            .filter((index, el) => el.innerText.trim() === "Це поле обов'язкове")
            .should('have.length', expectedCount)
            .each(($el) => {
                cy.wrap($el).should('be.visible');
            });
    });
}
