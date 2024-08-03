import 'cypress-iframe';
import { faker } from '@faker-js/faker';
import AuthModals from '../support/modals/AuthModals';
import { SettingsMenu, SettingsMenuBlocks } from './enums';
const { MailSlurp } = require('mailslurp-client');

const mailslurp = new MailSlurp({ apiKey: Cypress.env('MAILSLURP_API_KEY') });
const authModals = new AuthModals();

export function createUser(customEmail, customNickname, shouldAssert = true) {
    const password = '12345678aA';
    const email = customEmail || faker.internet.email();
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const nickname = customNickname || faker.internet.userName();

    authModals.visit();
    authModals.openLoginModal();
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
        activateAccount(user.email);
        login(userData.email, userData.password).then(() => {
            token = window.localStorage.getItem('accessToken');
            return { userData, token };
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

export function createInbox() {
    return cy.wrap(mailslurp.createInbox());
}

export function waitForLatestEmail(inboxId) {
    const timeoutMillis = 30_000;
    return cy.wrap(mailslurp.waitForLatestEmail(inboxId, timeoutMillis));
}

export function emailCount(inboxId) {
    return cy.wrap(mailslurp.inboxController.getInboxEmailCount({ inboxId: inboxId }));
}

export function deleteAllEmails() {
    return cy.wrap(mailslurp.emailController.deleteAllEmails());
}

export function selectDropdownOption(dropdownName, optionText) {
    cy.get(`input[placeholder="${dropdownName}"]`).click();
    cy.get('.MuiAutocomplete-listbox li').contains(optionText).click();
}

export function activateAccount(email, shouldAssert = true) {
    const encodedEmail = btoa(email);
    const correctUrl = Cypress.config('baseUrl').replace('/ua', '');
    const activationUrl = `${correctUrl}?isActive=${encodedEmail}`;
    cy.visit(activationUrl);
    cy.wait(500);
    if (shouldAssert) {
        return authModals.assertNotification('Акаунт успішно активовано');
    }
    return cy.wrap(null);
}

export function deleteAccount(password) {
    authModals.choseMenuInSettings(SettingsMenu.SettingsAccount, SettingsMenuBlocks.DeleteAccount);
    cy.wait(3000);
    cy.iframe('#accSettingsPage').find('button').contains('Видалити акаунт').should('be.visible').click({ force: true });
    cy.get('[type="password"]').type(password, { force: true });
    cy.get('button').contains('Видалити').click({ force: true });
    cy.wait(1000);
    authModals.assertNotification('Акаунт успішно видалено');
    authModals.assertUrl(Cypress.config('baseUrl'));
}

export function login(email, password) {
    authModals.visit();
    authModals.openLoginModal();
    authModals.typeEmail(email);
    authModals.typePassword(password);
    authModals.clickOnLoginBtn();
    authModals.waitFoDataLoad();
    return cy.wrap(null);
}
