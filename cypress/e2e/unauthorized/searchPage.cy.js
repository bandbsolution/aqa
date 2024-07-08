import SearchPage from "../../support/pages/SearchPage";

const searchPage = new SearchPage();


describe('smoke search page for unauthorized user', () => {
    it('search services', () => {
        searchPage.visit();
        searchPage.openSearchPage();
        searchPage.clickOnFilter();
        searchPage.availableCheckBox();
        searchPage.applyFilters();
        searchPage.clickOnPeople();
        cy.wait(3000);
        searchPage.clickOnPosts();
        cy.wait(3000);
        searchPage.sorting('input[role="combobox"]', 'Спочатку нові');
    })
})