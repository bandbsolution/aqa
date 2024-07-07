import { ProfileActions } from './enums';

class PageObject {
    clickOnSupportLinkInFooter() {
        cy.get('.footer-address-text').should('have.attr', 'href', '/ua/support').click();
        this.assertUrl(Cypress.config('baseUrl') + '/support');
        this.assertTitle('Підтримка');
    }

    visit() {
        cy.visit(Cypress.config('baseUrl'));
    }

    assertUrl(expectedUrl) {
        cy.url().should('eq', expectedUrl);
    }

    assertTitle(expectedTitle) {
        cy.title().should('eq', expectedTitle);
    }

    assertSuccessRegisterAccount() {
        cy.contains('Підтвердження електронної пошти', {timeout: 6000});
        cy.contains(
            'На вказану Вами електронну пошту, було надіслано листа з підвердженням реєстрації. Будь ласка, перевірте Вашу поштову скриньку.', {timeout: 6000}
        );
    }

    assertNotification(notificationMessage) {
        cy.get('#notistack-snackbar', { timeout: 3000 }).should('be.visible').and('have.text', notificationMessage);
    }

    openLoginModal() {
        cy.get('[data-testid="PermIdentityIcon"]', { timeout: 50000 }).should('exist');
        cy.get('[data-testid="PermIdentityIcon"]', { timeout: 50000 }).should('be.visible').click();
    }

    openSearchPage() {
        cy.get('[data-testid="SearchIcon"]', { timeout: 50000 }).click();
        this.assertUrl(Cypress.config('baseUrl') + '/search?question=&type=services');
        this.assertTitle('Пошук');
        this.waitFoDataLoad();
    }

    inputInSearchFiled(queryString) {
        cy.get('input[placeholder="Введіть свій пошуковий запит"]').type(queryString);
        cy.get('img[alt="arrow"]').click();
        this.waitFoDataLoad();
    }

    navigateToMenuItem(menuItem) {
        if (!Object.values(ProfileActions).includes(menuItem)) {
            throw new Error(`Invalid menu item: ${menuItem}`);
        }
        cy.get('[aria-label="Мій профіль"]').click({ force: true });
        cy.get('p').contains(menuItem).click({ force: true });
    }

    saveChanges() {
        cy.get('button').contains('Зберегти зміни').click({ force: true });
    }

    deleteButton() {
        cy.get('button').contains('Видалити').click({ force: true });
    }

    addToFavorites() {
        cy.get('[data-testid="BookmarkBorderIcon"]').click();
        cy.get('[data-testid="BookmarkIcon"]').should('be.visible');
    }

    chooseInSwitcher(object) {
        cy.get('span').contains(object).click();
    }

    waitFoDataLoad() {
        cy.get('.spinner', {timeout: 7000}).should('not.exist');
    }

    checkSupportLink(emailBody) {
        const supportLinkMatch = emailBody.match(/href="(https:\/\/dev\.bonfairplace\.com\/ua\/support)"/);
        assert.isNotNull(supportLinkMatch, 'Support link is present');
        assert.strictEqual(supportLinkMatch[1], 'https://dev.bonfairplace.com/ua/support', 'Support link is correct');
    }

    choseMenuInSettings(leftBlock, subBlock) {
        this.navigateToMenuItem(ProfileActions.SETTINGS);
        cy.frameLoaded('#accSettingsPage');
        cy.iframe('#accSettingsPage').find('button').contains(leftBlock).click({ force: true });
        cy.iframe('#accSettingsPage').find('span').contains(subBlock).should('be.visible').click({ force: true });
    }

    openScheduler() {
        cy.get('[data-testid="DateRangeIcon"]').click();
    }

    chooseStatusOfOrder(status) {
        cy.get('p').contains(status, {timeout: 5000}).click();
    }
}

export default PageObject;
