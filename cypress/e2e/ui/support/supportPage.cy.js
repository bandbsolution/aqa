import SupportPage from '../../../support/pages/SupportPage';
import { faker } from '@faker-js/faker';
import { setupUser } from '../../../support/helper';
import { ProfileActions } from '../../../support/enums';

const supportPage = new SupportPage();

describe('support page', () => {
    it('support link present in footer on Main and Search page', () => {
        supportPage.visit();
        supportPage.clickOnSupportLinkInFooter();
        supportPage.openSearchPage();
        supportPage.clickOnSupportLinkInFooter();
        cy.get('button').contains('Відправити').should('be.disabled');
    });

    it('support link NOT present in footer on Support page', () => {
        supportPage.visit();
        supportPage.clickOnSupportLinkInFooter();
        cy.get('.footer-address-text').should('not.exist');
    });

    it('validation message for: max length field, correct email', () => {
        supportPage.visit();
        supportPage.clickOnSupportLinkInFooter();
        supportPage.typeName('a'.repeat(101));
        supportPage.typeEmail('a');
        supportPage.typeSubject('a'.repeat(151));
        supportPage.typeText('a'.repeat(1001));
        cy.get('body').click();

        cy.get('button').contains('Відправити').should('be.disabled');
        cy.contains('Максимально 100 символів').should('be.visible');
        cy.contains('Максимально 150 символів').should('be.visible');
        cy.contains('Максимально 100 символів').should('be.visible');
        cy.contains('Введіть коректну електронну пошту').should('be.visible');
    });

    it('validation message for required filed, min length for text', () => {
        supportPage.visit();
        supportPage.clickOnSupportLinkInFooter();
        supportPage.nameField.click();
        supportPage.emailField.click();
        supportPage.subjectField.click();
        supportPage.textField.click();
        cy.get('body').click();

        cy.get('button').contains('Відправити').should('be.disabled');
        cy.get('[class*="container"]')
            .eq(1)
            .within(() => {
                cy.get('div')
                    .filter((index, el) => el.innerText.trim() === "Це поле обов'язкове")
                    .should('have.length', 3)
                    .each(($el) => {
                        cy.wrap($el).should('be.visible');
                    });
            });
        cy.contains('Мінімально 1 символ').should('be.visible');
    });

    it('unauthorized user send success request to support (without media files and checking email)', () => {
        supportPage.visit();
        supportPage.clickOnSupportLinkInFooter();
        supportPage.typeName(`CypressAutotest`);
        supportPage.typeEmail(faker.internet.email());
        supportPage.typeSubject(faker.company.catchPhrase());
        supportPage.typeText(faker.commerce.productName());
        supportPage.clickOnSendEmailToSupportButton();
        supportPage.assertSendEmailToSupport();
        supportPage.clickOnNackivatiPyatamyButton();
    });

    it('for authorized user support link NOT present in footer. The link in menu', () => {
        setupUser().then((data) => {
            supportPage.navigateToMenuItem(ProfileActions.SUPPORT);
            supportPage.assertUrl(Cypress.config('baseUrl') + '/support');
            supportPage.openSearchPage();
            cy.get('.footer-address-text').should('not.exist');
            supportPage.visit(Cypress.config('baseUrl'));
            cy.get('.footer-address-text').should('not.exist');
            cy.deleteAccount(data.userData.password);
        });
    });
});
