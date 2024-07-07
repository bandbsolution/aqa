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
        this.waitFoDataLoad();
    }

    clickOnPeople() {
        cy.get('span').contains('Люди').click();
        this.waitFoDataLoad();
    }

    applyFilters() {
        cy.get('button').contains('Застосувати фільтри').click();
        this.waitFoDataLoad();
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