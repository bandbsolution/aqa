import { ProfileActions } from './enums';

class PageObject {
    clickOnSupportLinkInFooter() {
        cy.get('.footer-address-text').should('have.attr', 'href', '/ua/support').click();
        this.assertUrl(Cypress.config('baseUrl') + '/support');
        this.assertTitle('Підтримка');
    }

    visit() {
        cy.visit(Cypress.config('baseUrl'));
        cy.wait(1000);
    }

    assertUrl(expectedUrl) {
        cy.url().should('eq', expectedUrl);
    }

    assertTitle(expectedTitle) {
        cy.title().should('eq', expectedTitle);
    }

    assertSuccessRegisterAccount() {
        this.waitFoDataLoad();
        cy.contains('Підтвердження електронної пошти');
        cy.contains('На вказану Вами електронну пошту, було надіслано листа з підвердженням реєстрації. Будь ласка, перевірте Вашу поштову скриньку.');
    }

    assertNotification(notificationMessage) {
        cy.get('#notistack-snackbar').should('be.visible').and('have.text', notificationMessage);
    }

    openLoginModal() {
        cy.get('button').contains('Увійти').click({force: true});
        this.waitFoDataLoad();
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
        this.waitFoDataLoad();
    }

    waitFoDataLoad() {
        cy.wait(1000);
        cy.get('.spinner').should('not.exist');
    }

    checkSupportLink(emailBody) {
        const supportLinkMatch = emailBody.match(/href="(https:\/\/dev\.bonfairplace\.com\/ua\/support)"/);
        assert.isNotNull(supportLinkMatch, 'Support link is present');
        assert.strictEqual(supportLinkMatch[1], 'https://dev.bonfairplace.com/ua/support', 'Support link is correct');
    }

    choseMenuInSettings(leftBlock, subBlock) {
        this.navigateToMenuItem(ProfileActions.SETTINGS);
        cy.frameLoaded('#accSettingsPage').should('be.visible');
        cy.iframe('#accSettingsPage').find('button').contains(leftBlock).should('be.visible').click({ force: true });
        cy.iframe('#accSettingsPage').find('span').contains(subBlock).should('be.visible').click({ force: true });
    }

    openScheduler() {
        cy.get('[data-testid="DateRangeIcon"]').click();
    }

    openNotification() {
        cy.get('[aria-label="Сповіщення"]').click();
        cy.wait(1000);
    }

    chooseStatusOfOrder(status) {
        cy.get('p').contains(status, {timeout: 5000}).click();
    }
}

export default PageObject;
