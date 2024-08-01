import MyProfile from '../../../support/pages/MyProfile';
import { ProfileActions } from '../../../support/enums';

import { setupUser } from '../../../support/helper';
import { authService, postsService } from '../../../api/services';

const myProfile = new MyProfile();

describe('test all turned on notifications', () => {
    let userDataFirst;
    let userDataSecond;
    let accessTokenFirstUser;
    let accessTokenSecondUser;
    let firstUserPostDataId;
    let firstUserCommentDataId;
    let firstUserServiceDataId;
    let idFirstUser;
    let orderId;
    let idServiceWithKeyForFixture;

    before(() => {
        setupUser().then((data) => {
            userDataFirst = data.userData;
            accessTokenFirstUser = data.token;
            myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
        });
        setupUser().then((data) => {
            userDataSecond = data.userData;
            accessTokenSecondUser = data.token;
            myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
        });
    });

    it('Prepare test data API: follow from Second user to First user', () => {
        authService.getUser(accessTokenFirstUser).then((response) => {
            idFirstUser = response.result.id;
            authService.subscribe(accessTokenSecondUser, idFirstUser);
        });
    });

    it('Prepare test data API: create on First user: service, post, add comment to post', () => {
        postsService.createPost(accessTokenFirstUser, 'Description for post test notifications').then((response) => {
            firstUserPostDataId = response.result;

            postsService.createComment(accessTokenFirstUser, 'Comment for post test notifications', firstUserPostDataId).then((response) => {
                firstUserCommentDataId = response.result;
            });
        });
        cy.fixture('serviceCreateData').then((data) => {
            postsService.createService(accessTokenFirstUser, data).then((response) => {
                firstUserServiceDataId = response.result;
                idServiceWithKeyForFixture = {
                    serviceId: response.result,
                };
            });
        });
    });

    it('Prepare test data API: Second user: like post, order, comment post, leave feedback - first users', () => {
        postsService.likePost(accessTokenSecondUser, firstUserPostDataId, true);
        postsService.likeComment(accessTokenSecondUser, firstUserCommentDataId, true);
        postsService.createComment(accessTokenSecondUser, 'Hello bro from autotest', firstUserPostDataId);
        postsService.createResponse(accessTokenSecondUser, 'Hello bro from autotest', firstUserCommentDataId);
        postsService.createFeedback(accessTokenSecondUser, 'good autotest', firstUserServiceDataId, 1);
        cy.fixture('orderCreateData').then((fixtureData) => {
            const orderCreateData = {
                ...idServiceWithKeyForFixture,
                ...fixtureData,
            };
            postsService.createOrder(accessTokenSecondUser, orderCreateData).then((response) => {
                orderId = response.result.id;
            });
        });
    });

    it('Prepare test data API: First user change status of order', () => {
        postsService.changeStatusOrder(accessTokenFirstUser, orderId, 'PROCESSING');
        postsService.changeStatusOrder(accessTokenFirstUser, orderId, 'SENT');
        postsService.changeStatusOrder(accessTokenFirstUser, orderId, 'DONE');
    });

    it('assert notifications First user', () => {
        cy.login(userDataFirst.email, userDataFirst.password);
        myProfile.openNotification();
        cy.get('[role="menu"]').within(() => {
            cy.contains('Вам надійшло нове замовлення').should('be.visible');
            cy.contains(`Користувач @${userDataSecond.nickname} додав новий відгук до вашої послуги`).should('be.visible');
            cy.contains(`Користувач @${userDataSecond.nickname} прокоментував ваш пост`).should('be.visible');
            cy.contains(`Користувач @${userDataSecond.nickname} відповів на ваш коментар`).should('be.visible');
            cy.contains(`Користувач @${userDataSecond.nickname} вподобав ваш коментар`).should('be.visible');
            cy.get('[data-testid="KeyboardArrowDownOutlinedIcon"]').click();
            cy.wait(1000);
            cy.contains(`Нова вподобайка до вашого посту від @${userDataSecond.nickname}`).should('be.visible');
            cy.contains(`У вас новий підписник: @${userDataSecond.nickname}`).should('be.visible');
            cy.get('[data-testid="DeleteOutlinedIcon"]').click();
            cy.get('p').contains('Немає нових сповіщень');
        });
        myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
    });

    it('assert notifications Second user', () => {
        cy.login(userDataSecond.email, userDataSecond.password);
        myProfile.openNotification();
        cy.get('[role="menu"]').within(() => {
            cy.get('p')
                .filter((index, element) => {
                    return element.textContent.includes('Ваше замовлення №1 змінило статус');
                })
                .should('have.length', 3);
        });
        cy.get('[role="menu"]').within(() => {
            cy.contains(`Користувач @${userDataFirst.nickname} додав нову послугу`).should('be.visible');
            cy.contains(`Користувач @${userDataFirst.nickname} запостив щось новеньке`).should('be.visible');
            cy.get('[data-testid="ClearOutlinedIcon"]').eq(4).click();
            cy.contains(`Користувач @${userDataFirst.nickname} запостив щось новеньке`).should('not.exist');
        });
        cy.deleteAccount(userDataSecond.password);
        cy.login(userDataFirst.email, userDataFirst.password);
        cy.deleteAccount(userDataFirst.password);
    });
});
