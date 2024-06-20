import PageObject from '../PageObject';

class SearchPage extends PageObject {

    typeName(name) {
        this.nameField.type(name, { force: true });
    }

     clickOnFilter() {
        cy.get('[data-testid="TuneIcon"]').click();
    }

    clickOnPosts() {
        cy.get('span').contains('Пости').click();
        cy.wait(5000);
    }

    clickOnPeople() {
        cy.get('span').contains('Люди').click();
        cy.wait(5000);
    }

    applyFilters() {
        cy.get('button').contains('Застосувати фільтри').click();
        cy.wait(5000);
    }

    availableCheckBox() {
        cy.get('span').contains('Є в наявності').click();
    }

    sorting(dropdownSelector, optionText) {
        cy.get(dropdownSelector).click();
        cy.contains('li', optionText).click();
        cy.get(dropdownSelector).should('have.value', optionText);
    }

}

export default SearchPage;