import { faker } from '@faker-js/faker';
import MyProfile from "../pages/MyProfile";
import PostModal from "../modals/PostModal";
import {PostActions} from "../enums";

const postModal = new PostModal;
const myProfile = new MyProfile;

Cypress.Commands.add('createPost', () => {
    const randomPostText = faker.lorem.paragraph({min: 5, max: 10});

    myProfile.clickOnCreateServiceOrPostIf0();
    postModal.typeTextPost(randomPostText);
    postModal.clickOnCreatePostBtn();
    postModal.assertNotification('Пост успішно створено');

    return cy.wrap({ randomPostText });
});

Cypress.Commands.add('editPost', () => {
    const randomEditedPostText = faker.lorem.paragraph({min: 5, max: 10});

    postModal.performPostActions(PostActions.EDIT);
    postModal.textPostField.clear();
    postModal.typeTextPost(randomEditedPostText);
    postModal.saveChanges();
    postModal.assertNotification('Зміни збережено');
    return cy.wrap({ randomEditedPostText });
});

Cypress.Commands.add('deletePost', () => {
    postModal.performPostActions(PostActions.DELETE);
    postModal.deleteButton();
   // postModal.assertNotification('Пост видалено');

});

Cypress.Commands.add('commentPost', () => {
    const randomComment = faker.lorem.text();
    cy.get('[placeholder="Прокоментуй тут"]').type(randomComment);
    cy.get('button').contains('Додати').click({ force: true });
    cy.wait(2000);
    cy.contains('p', randomComment).should('be.visible');
    cy.contains('span', '0 хв тому').should('be.visible');

    return cy.wrap({ randomComment });
});

Cypress.Commands.add('editCommentPost', () => {
    const editedComment = faker.lorem.text();
    cy.get('[placeholder="Прокоментуй тут"]').type(editedComment);
    cy.get('button').contains('Додати').click({ force: true });
    cy.contains('p', editedComment).should('be.visible');
    cy.contains('span', '0 хв тому').should('be.visible');

    return cy.wrap({ editedComment });
});

Cypress.Commands.add('replyOnComment', () => {
    const randomReplyOnComment = faker.lorem.text();
    cy.get('[data-testid="ReplyIcon"]').click();
    cy.get('[placeholder="Відповісти"]').type(randomReplyOnComment);
    cy.get('button').contains('Додати').eq(1).click({ force: true });
    cy.get('span').contains('Показати відповіді').click();
    cy.contains('p', randomReplyOnComment).should('be.visible');
    cy.contains('span', '0 хв тому').should('be.visible');

    return cy.wrap({ randomReplyOnComment });
});

Cypress.Commands.add('turnOffComments', () => {
    cy.get('[data-testid="MoreVertIcon"]').click();
    cy.get('li').contains('Вимкнути коментарі').click({ force: true });
    cy.get('[placeholder="Прокоментуй тут"]').should('not.exist');
    cy.get('button').contains('Додати').eq(0).should('not.exist');
    // и каунт 0 возле иконки
    // нотификашка мб
});

Cypress.Commands.add('turnOnComments', () => {
    cy.get('[data-testid="MoreVertIcon"]').click();
    cy.get('li').contains('Увімкнути коментарі').click({ force: true });
    cy.get('[placeholder="Прокоментуй тут"]').should('be.visible');
    cy.get('button').contains('Додати').eq(0).should('be.visible');
    // и каунт уже показивает возле иконки
    // нотификашка мб
});

Cypress.Commands.add('deleteComment', () => {
    cy.get('[data-testid="MoreVertIcon"]').eq(1).click();
    cy.get('li').contains('Видалити коментар').click({ force: true });
    cy.get('button').contains('Видалити').click();
    // нотификашка мб
});

Cypress.Commands.add('deleteResponseOnComment', () => {
    cy.get('[data-testid="ReplyIcon"]').click();
    cy.get('[data-testid="MoreVertIcon"]').eq(2).click();
    cy.get('li').contains('Видалити відповідь').click({ force: true });
    cy.get('button').contains('Видалити').click();
    cy.get('span').contains('Показати відповіді').should('not.exist');
    // нотификашка мб
});

Cypress.Commands.add('editResponseOnComment', (previouslyText) => {
    const randomReplyOnComment = faker.lorem.text();
    cy.get('[data-testid="ReplyIcon"]').click();
    cy.get('[data-testid="MoreVertIcon"]').eq(2).click();
    cy.get('li').contains('Редагувати').click({ force: true });
    cy.get('texarea').contains(`${previouslyText}`).clear();
    cy.get('[placeholder="Відповісти"]').type(randomReplyOnComment);
    postModal.saveChanges();
    cy.contains('p', randomReplyOnComment).should('be.visible');

    return cy.wrap({ previouslyText });
});