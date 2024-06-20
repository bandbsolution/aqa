import PageObject from '../PageObject';

class PostModal extends PageObject {

    get textPostField() {
        return cy.get('[placeholder="Чим хочеш поділитися сьогодні? "]');
    }

    clickOnCreatePostBtn() {
        cy.get('button').filter(`:contains("Створити")`).filter(function() {
            return Cypress.$(this).text().trim() === 'Створити';
        }).click();
    }

    typeTextPost(textPost) {
        this.textPostField.type(textPost, {force: true});
    }

}

export default PostModal;
