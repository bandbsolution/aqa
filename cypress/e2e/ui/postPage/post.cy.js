import PostModal from '../../../support/modals/PostModal';
import { PostActions, ProfileActions } from '../../../support/enums';
import { deleteAccount, login, setupUser } from '../../../support/helper';
import { faker } from '@faker-js/faker';
import MyProfile from '../../../support/pages/MyProfile';

const postModal = new PostModal();
const myProfile = new MyProfile();
const today = new Date();
const formatter = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: 'long', year: 'numeric' });
const formattedDate = formatter.format(today).replace(' р.', ' р.');

describe('smoke post', () => {
    let userDataFirst;

    before(() => {
        setupUser().then((data) => {
            userDataFirst = data.userData;
            postModal.navigateToMenuItem(ProfileActions.LOGOUT);
        });
    });

    beforeEach(() => {
        login(userDataFirst.email, userDataFirst.password);
    });

    after(() => {
        deleteAccount(userDataFirst.password);
    });

    it('create post', () => {
        const randomPostText = faker.lorem.paragraph({ min: 8, max: 10 });

        myProfile.clickOnCreateServiceOrPostIf0();
        postModal.typeTextPost(randomPostText);
        postModal.clickOnCreatePostBtn();
        postModal.assertNotification('Пост успішно створено');
        postModal.waitFoDataLoad();
        cy.get('span').contains('Читати більше').click();
        cy.get('p').contains(`@${userDataFirst.nickname}`).should('be.visible');
        cy.get('.postDescription').contains(randomPostText).should('be.visible');
        cy.contains('span', formattedDate).should('be.visible');
    });

    it('edit post', () => {
        cy.editPost().then(({ randomEditedPostText }) => {
            cy.get('span').contains('Читати більше').click({ force: true });
            cy.get('.postDescription').contains(randomEditedPostText).should('be.visible');
            cy.contains(randomEditedPostText).should('be.visible');
        });
    });

    it('like post', () => {
        postModal.like(0);
    });

    it('add to favorite post', () => {
        postModal.addToFavorites();
        postModal.navigateToMenuItem(ProfileActions.SAVED);
        postModal.waitFoDataLoad();
    });

    it('copy link on post', () => {
        postModal.copyLink();
    });

    it('turn off comments', () => {
        postModal.performPostActions(PostActions.DISABLE_COMMENTS);
        cy.get('span').contains('Читати більше').click({ force: true });
        cy.wait(3000);
        cy.get('textarea[placeholder="Прокоментуй тут"]').should('not.exist');
        cy.get('button').contains('Додати').should('not.exist');
    });

    it('turn on comments', () => {
        postModal.performPostActions(PostActions.ENABLE_COMMENTS);
        cy.get('span').contains('Читати більше').click({ force: true });
        cy.wait(3000);
        cy.get('textarea[placeholder="Прокоментуй тут"]').should('be.visible');
        cy.get('button').contains('Додати').should('be.visible');
    });

    it('opened new tab if click on comment icon', () => {
        cy.window().then((win) => {
            cy.stub(win, 'open')
                .callsFake((url) => {
                    Cypress.env('postUrl', url);
                    expect(url).to.include(Cypress.config('baseUrl') + '/post');
                })
                .as('windowOpen');
        });

        cy.get('[data-testid="ChatBubbleOutlineIcon"]').eq(1).click();

        cy.get('@windowOpen').should('be.called');
        cy.window().then(() => {
            const postUrl = Cypress.env('postUrl');
            cy.visit(postUrl);
        });
    });

    it('delete post', () => {
        postModal.performPostActions(PostActions.DELETE);
        postModal.deleteButton();
        cy.get('h3').contains('Постів ще нема').should('be.visible');
        cy.get('p')
            .contains('Віримо в тебе. Створи перший пост тицьнувши на велику жовту кнопку. А якщо немає ідей - завжди є котики. Котиків люблять всі.')
            .should('be.visible');
        cy.get('button').contains('Нумо створювати!').should('be.visible');
    });
});
