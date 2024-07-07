import PageObject from '../PageObject';
import {PostActions} from "../enums";

class PostModal extends PageObject {

    get textPostField() {
        return cy.get('[placeholder="Чим хочеш поділитися сьогодні? "]');
    }

    clickOnCreatePostBtn() {
        cy.get('button').filter(`:contains("Створити")`).filter(function() {
            return Cypress.$(this).text().trim() === 'Створити';
        }).click();
    }

    performPostActions(action){
        cy.get('[data-testid="MoreVertIcon"]').click({ force: true });
        cy.get('li').contains(action).click({ force: true });
    }

    actionsWithComment(action) {
        cy.get('[data-testid="MoreVertIcon"]').eq(1).click({force: true});
        cy.get('li').contains(action).click({force: true});
    }

    actionsWithReplyOnComment(action) {
        cy.get('[data-testid="MoreVertIcon"]').eq(2).click({force: true});
        cy.get('li').contains(action).click({force: true});
    }

    like(index){
        cy.get('[data-testid="FavoriteBorderIcon"]').eq(index).click();
        cy.get('[data-testid="FavoriteIcon"]', {timeout: 5000}).should('be.visible');
    }

    copyLink(){
        cy.window().then(win => {
            cy.stub(win.navigator.clipboard, 'writeText').as('copy');
            this.performPostActions(PostActions.COPY_LINK);
            this.assertNotification('Посилання на пост скопійовано');
            cy.get('@copy').should('have.been.calledOnce').then((interception) => {
                const copiedLink = interception.args[0][0];
                cy.log(`Copied link: ${copiedLink}`);
                cy.visit(copiedLink);
            });
        });
    }

    typeTextPost(textPost) {
        this.textPostField.type(textPost, {force: true});
    }
}

export default PostModal;
