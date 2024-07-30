import { faker as fakerEn } from '@faker-js/faker/locale/en';
import { faker as fakerUk } from '@faker-js/faker/locale/uk';
import { faker } from '@faker-js/faker';
import 'cypress-iframe';
import MainPage from "../pages/MainPage";
import AuthModals from "../modals/AuthModals";
import { SettingsMenu, SettingsMenuBlocks } from '../enums';

const mainPage = new MainPage;
const authModals = new AuthModals;


function getRandomLocale() {
    const locales = ['uk', 'en'];
    const randomIndex = Math.floor(Math.random() * locales.length);
    return locales[randomIndex];
}

function generatePassword() {
    const upperCaseLetter = faker.string.alpha({ count: 1, casing: 'upper' });
    const lowerCaseLetter = faker.string.alpha({ count: 1, casing: 'lower' });
    const digit = faker.string.numeric(1);
    const remainingLength = 7;
    const remainingCharacters = faker.string.alphanumeric(remainingLength);

    const passwordArray = [upperCaseLetter, lowerCaseLetter, digit, ...remainingCharacters].sort(() => 0.5 - Math.random());
    return passwordArray.join('');
}

// id - first, second
Cypress.Commands.add('createUser', (id) => {
    const locale = getRandomLocale();
    const faker = locale === 'en' ? fakerEn : fakerUk;
    const password = generatePassword();
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const nickname = faker.internet.userName();

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
    authModals.assertSuccessRegisterAccount();

    return cy.wrap({ email, password, name, surname, nickname });
});

Cypress.Commands.add('activateAccount', (email) => {
    const encodedEmail = btoa(email);
    const activationUrl = `https://dev.bonfairplace.com?isActive=${encodedEmail}`;
    cy.visit(activationUrl);
    cy.wait(500);
    mainPage.assertNotification('Акаунт успішно активовано');
});

Cypress.Commands.add('deleteAccount', (password) => {
    mainPage.choseMenuInSettings(SettingsMenu.SettingsAccount, SettingsMenuBlocks.DeleteAccount);
    cy.wait(3000);
    cy.iframe('#accSettingsPage').find('button').contains('Видалити акаунт').should('be.visible').click({force: true});
    cy.get('[type="password"]').type(password, {force: true});
    cy.get('button').contains('Видалити').click({force: true});
    cy.wait(1000);
    mainPage.assertNotification('Акаунт успішно видалено');
    mainPage.assertUrl(Cypress.config('baseUrl'));
});

Cypress.Commands.add('login', (email, password) => {
    authModals.visit();
    mainPage.openLoginModal();
    authModals.typeEmail(email);
    authModals.typePassword(password);
    authModals.clickOnLoginBtn();
    authModals.waitFoDataLoad();
});
