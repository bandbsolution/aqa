import MyProfile from '../support/pages/MyProfile';
import { ProfileActions, SettingsMenu, SettingsMenuBlocks } from '../support/enums';

import {
    changeOrderStatusAPI,
    createCommentOrResponseAPI,
    createFeedbackAPI,
    createOrderAPI,
    getUserInfoAPI,
    getUserToken,
    likeCommentAPI,
    likePostAPI,
    subscribeAPI,
} from '../support/apiHelper';

const myProfile = new MyProfile();

function checkNotificationsByDefault() {
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(0).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(1).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(2).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(3).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(4).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(5).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(6).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(7).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(8).should('be.checked');
    cy.iframe('#accSettingsPage').find('[role="region"]').eq(0).find('input').eq(9).should('be.checked');
}

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

    before(() => {
        cy.createUser('first').then((user) => {
            cy.activateAccount(user.email);
            userDataFirst = user;
        });
        cy.createUser('second').then((user) => {
            cy.activateAccount(user.email);
            userDataSecond = user;
        });
    });

    it('default values for notifications for both users. Check user has 0 notifications', () => {
        cy.login(userDataFirst.email, userDataFirst.password);
        getUserToken().then((token) => {
            accessTokenFirstUser = token;
        });
        myProfile.openNotification();
        cy.get('h6').contains('Сповіщення');
        cy.get('p').contains('Немає нових сповіщень');
        myProfile.choseMenuInSettings(SettingsMenu.Notifications, SettingsMenuBlocks.AccountNotifications);
        checkNotificationsByDefault();
        myProfile.navigateToMenuItem(ProfileActions.LOGOUT);

        cy.login(userDataSecond.email, userDataSecond.password);
        getUserToken().then((token) => {
            accessTokenSecondUser = token;
        });
        myProfile.openNotification();
        cy.get('p').contains('Немає нових сповіщень');
        myProfile.choseMenuInSettings(SettingsMenu.Notifications, SettingsMenuBlocks.AccountNotifications);
        checkNotificationsByDefault();
        myProfile.navigateToMenuItem(ProfileActions.LOGOUT);
    });

    it('follow from Second user to First user', () => {
        getUserInfoAPI(accessTokenFirstUser).then((response) => {
            cy.log('GET USER INFO RESPONSE:', JSON.stringify(response));
            idFirstUser = response.result.id;
            cy.log('FIRST USER ID:', idFirstUser);
            subscribeAPI(accessTokenSecondUser, idFirstUser).then((response) => {
                cy.log('SUBSCRIBE RESPONSE:', JSON.stringify(response));
            });
        });
    });

    it('create on First user: service, post, add comment to post', () => {
        cy.createPostAPI(accessTokenFirstUser, 'Description for post test notifications').then((response) => {
            cy.log('Response body created POST:', JSON.stringify(response));
            firstUserPostDataId = response.result;
            cy.log('Post id:', firstUserPostDataId);

            createCommentOrResponseAPI(accessTokenFirstUser, 'Comment for post test notifications', firstUserPostDataId, 'post').then((response) => {
                cy.log('COMMENT:', JSON.stringify(response));
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq('ok');
                firstUserCommentDataId = response.body.result;
                cy.log('Comment id:', firstUserCommentDataId);
            });
        });
        cy.createServiceAPI(
            accessTokenFirstUser,
            '',
            1,
            100,
            'Нова Пошта',
            'Name for service test notify',
            "Понеділок,Вівторок,Середа,Четвер,П'ятниця,Субота,Неділя",
            100,
            'грн',
            10,
            'г',
            'Є в наявності',
            'Повна оплата',
            'Description for service test notify',
            'Їжа та напої'
        ).then((response) => {
            cy.log('Response body created SERVICE:', JSON.stringify(response));
            firstUserServiceDataId = response.result;
            cy.log('Service id:', firstUserServiceDataId);
        });
    });

    it('Second user: like post, order, comment post, leave feedback -first users', () => {
        likePostAPI(accessTokenSecondUser, firstUserPostDataId, true).then((response) => {
            cy.log('LIKE POST RESPONSE:', JSON.stringify(response));
        });
        likeCommentAPI(accessTokenSecondUser, firstUserCommentDataId, true).then((response) => {
            cy.log('LIKE COMMENT RESPONSE:', JSON.stringify(response));
        });
        createCommentOrResponseAPI(accessTokenSecondUser, 'Hello bro from autotest', firstUserPostDataId, 'post').then((response) => {
            cy.log('COMMENT POST RESPONSE:', JSON.stringify(response));
        });
        createCommentOrResponseAPI(accessTokenSecondUser, 'Hello bro from autotest', firstUserCommentDataId, 'response').then((response) => {
            cy.log('COMMENT-REPLY POST RESPONSE:', JSON.stringify(response));
        });
        createFeedbackAPI(accessTokenSecondUser, 'good autotest', firstUserServiceDataId, 1).then((response) => {
            cy.log('FEEDBACK RESPONSE:', JSON.stringify(response));
        });
        createOrderAPI(
            accessTokenSecondUser,
            firstUserServiceDataId,
            1,
            'Andrii Kar +380888888888',
            'Нова Пошта, н.п.Бесідка, Київська обл., Відділення 8',
            'Повна оплата',
            'autotest comment',
            '100'
        ).then((response) => {
            orderId = response.result.id;
            cy.log('ORDER RESPONSE:', JSON.stringify(response));
        });
    });

    it('First user change status of order', () => {
        changeOrderStatusAPI(accessTokenFirstUser, orderId, 'PROCESSING').then((response) => {
            cy.log('ORDER STATUS PROCESSING:', JSON.stringify(response));
        });
        changeOrderStatusAPI(accessTokenFirstUser, orderId, 'SENT').then((response) => {
            cy.log('ORDER STATUS SENT:', JSON.stringify(response));
        });
        changeOrderStatusAPI(accessTokenFirstUser, orderId, 'DONE').then((response) => {
            cy.log('ORDER STATUS DONE:', JSON.stringify(response));
        });
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
