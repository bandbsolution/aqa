import { faker as fakerEn } from '@faker-js/faker/locale/en';
import { faker as fakerUk } from '@faker-js/faker/locale/uk';
import { faker } from '@faker-js/faker';
import 'cypress-iframe';

import MainPage from "../pages/MainPage";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";

const mainPage = new MainPage;
const loginForm = new LoginModal;
const registerForm = new RegisterModal;


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
    Cypress.env(`${id}UserEmail`, email);
    Cypress.env(`${id}UserPassword`, password);

    mainPage.visit();
    mainPage.openLoginModal();
    loginForm.clickOnCreateAcc();
    registerForm.typeName(`${id}${faker.person.firstName()}`);
    registerForm.typeSurname(`${id}${faker.person.lastName()}`);
    registerForm.typeNickname(`${id}${faker.internet.userName()}`);
    registerForm.typeEmail(email);
    registerForm.typePassword(password);
    registerForm.typeConfirmPassword(password);
    registerForm.agreeRegisterCheckbox();
    registerForm.clickOnRegisterButton();
    cy.wait(9999);
    cy.contains('Підтвердження електронної пошти');
    cy.contains('На вказану Вами електронну пошту, було надіслано листа з підвердженням реєстрації. Будь ласка, перевірте Вашу поштову скриньку.');
});

Cypress.Commands.add('activateAccount', (email) => {
    cy.wait(9999);
     email = Cypress.env(email);
    if (!email) {
        throw new Error('Email not found in env');
    }

    const encodedEmail = btoa(email);
    const activationUrl = `https://dev.bonfairplace.com?isActive=${encodedEmail}`;

    cy.visit(activationUrl);
    mainPage.assertNotification('Акаунт успішно активовано');
});

Cypress.Commands.add('deleteAccount', (password) => {
    password = Cypress.env(password);
    if (!password) {
        throw new Error('Email not found in env');
    }
    mainPage.goToMySettings();
    cy.frameLoaded('#accSettingsPage');
    cy.wait(3000);
    cy.iframe('#accSettingsPage').find('span').contains('Повне видалення акаунту').should('be.visible').click();
    cy.iframe('#accSettingsPage').find('button').contains('Видалити акаунт').click();
    cy.get('[type="password"]').type(password);
    cy.get('button').contains('Видалити').click();
    mainPage.assertNotification('Акаунт успішно видалено');
    mainPage.assertUrl('https://dev.bonfairplace.com/ua');
});

Cypress.Commands.add('login', (email, password) => {
    email = Cypress.env(email);
    password = Cypress.env(password);
    if (!password || !email) {
        throw new Error('Email or password not found in env');
    }
    loginForm.visit()
    mainPage.openLoginModal();
    loginForm.typeEmail(email);
    loginForm.typePassword(password);
    loginForm.clickOnLoginBtn();
    cy.wait(3000);
});

Cypress.Commands.add('logout', () => {
  mainPage.goToMyLogout();
  mainPage.assertUrl('https://dev.bonfairplace.com/ua');
});
