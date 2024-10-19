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

export function setupUser(customEmail) {
    let userData;
    let token;

    return createUser(customEmail).then((user) => {
        userData = user;
        activateAccount(user.email);
        return login(userData.email, userData.password).then(() => {
            return cy.window().then((win) => {
                token = win.localStorage.getItem('accessToken');
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

export function logIntoGoogle() {
    const username = Cypress.env('GOOGLE_USERNAME');
    const password = Cypress.env('GOOGLE_PASSWORD');

    Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop') && !err.message.includes('Error in protected function'));

    cy.session(
        [username, password],
        () => {
            cy.visit(Cypress.config('baseUrl'));
            cy.location('href', { timeout: 10000 }).then((currentUrl) => {
                if (currentUrl.includes('accounts.google.com')) {
                    cy.get('input[type="email"]').type(username, { log: false });
                    cy.contains('Next').click();
                    cy.get('input[type="password"]').type(password, { log: false });
                    cy.contains('Next').click().wait(4000);
                    cy.visit('/');

                    cy.getCookie('GCP_IAP_UID').then((cookie) => {
                        if (cookie) {
                            Cypress.env('GCP_IAP_UID', cookie.value);
                        }
                    });

                    cy.getCookie('__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87').then((cookie) => {
                        if (cookie) {
                            Cypress.env('__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87', cookie.value);
                        }
                    });
                }
            });
        },
        {
            cacheAcrossSpecs: true,
            validate: () => {
                cy.getCookie('__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87').should('exist');
            },
        }
    );
}
