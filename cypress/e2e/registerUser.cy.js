import { faker } from '@faker-js/faker';
import AuthModals from '../support/modals/AuthModals';

const authModals = new AuthModals();

describe('register user functional', () => {
    let userDataFirst;

    before(() => {
        cy.createUser('first').then((user) => {
            cy.activateAccount(user.email);
            userDataFirst = user;
        });
    });

    after(() => {
        cy.login(userDataFirst.email, userDataFirst.password);
        cy.deleteAccount(userDataFirst.password);
    });

    it('validation errors for fields - correct values', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnCreateAcc();
        cy.get('button').contains('Зареєструватись').should('be.disabled');

        cy.get('[name="nickname"]').type('ій');
        cy.get('body').click();
        cy.contains('Нікнейм має включати тільки латинські літери').should('be.visible');

        cy.get('[name="email"]').type('a');
        cy.get('body').click();
        cy.contains('Введіть коректну електронну пошту').should('be.visible');

        cy.get('[name="confirmPassword"]').type('ab');
        cy.get('[name="password"]').type('a');
        cy.get('body').click();
        cy.contains('Пароль має включати тільки латинські літери, 1 велику літеру, 1 цифру, та 1 маленьку літеру.').should('be.visible');
        cy.contains('Паролі не співпадають').should('be.visible');
    });

    it('max length for fields and required fields', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnCreateAcc();
        cy.get('[name="name"]').clear().type('a'.repeat(101));
        cy.get('body').click();
        cy.contains('Максимально 100 символів').should('be.visible');
        cy.get('[name="name"]').clear();

        cy.get('[name="surname"]').clear().type('a'.repeat(101));
        cy.get('body').click();
        cy.contains('Максимально 100 символів').should('be.visible');
        cy.get('[name="surname"]').clear();

        cy.get('[name="nickname"]').clear().type('a'.repeat(31));
        cy.get('body').click();
        cy.contains('Максимально 30 символів').should('be.visible');
        cy.get('[name="nickname"]').clear();

        cy.get('[name="email"]').click();

        cy.get('[name="confirmPassword"]').click();
        cy.get('body').click();

        cy.get('[name="password"]').type('1aB'.repeat(256));
        cy.get('body').click();
        cy.contains('Максимально 256 символів').should('be.visible');
        cy.get('[name="password"]').clear();
        cy.get('body').click();


        cy.get('form').within(() => {
            cy.get('div')
                .filter((index, el) => el.innerText.trim() === "Це поле обов'язкове")
                .should('have.length', 6)
                .each(($el, index) => {
                    cy.wrap($el).should('be.visible');
                    cy.log(`element: ${index}`);
                });
        });
    });

    it('min length for fields', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnCreateAcc();
        cy.get('[name="name"]').type('a');
        cy.get('[name="surname"]').type('a');
        cy.get('[name="nickname"]').type('a');
        cy.get('body').click();

        cy.get('form').within(() => {
            cy.get('div')
                .filter((index, el) => el.innerText.trim() === "Мінімально 2 символи")
                .should('have.length', 3)
                .each(($el, index) => {
                    cy.wrap($el).should('be.visible');
                    cy.log(`element: ${index}`);
                });
        });
    });

    it('create account with already created and activated nickname and email', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnCreateAcc();
        authModals.typeName('Just');
        authModals.typeSurname('Test');
        authModals.typeNickname(userDataFirst.nickname);
        authModals.typeEmail(userDataFirst.email);
        authModals.typePassword('12345678aA');
        authModals.typeConfirmPassword('12345678aA');
        authModals.agreeRegisterCheckbox();
        authModals.clickOnRegisterButton();
        authModals.assertNotification('Акаунт з такою поштою вже існує', { timeout: 50000 });
        cy.get('.SnackbarItem-action').click();
        authModals.emailField.clear().type(faker.internet.email());
        authModals.clickOnRegisterButton();
        authModals.assertNotification('Користувач з таким нікнеймом, вже зареєстрований', { timeout: 50000 });
    });

    it('activate already activated account', () => {
        const encodedEmail = btoa(userDataFirst.email);
        const correctUrl = Cypress.config('baseUrl').replace('/ua','');
        const activationUrl = `${correctUrl}?isActive=${encodedEmail}`;
        cy.visit(activationUrl);
        authModals.assertNotification('Акаунт вже було активовано', { timeout: 50000 });
    });
});
