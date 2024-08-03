import AuthModals from '../../../support/modals/AuthModals';
import { ProfileActions } from '../../../support/enums';
import { createInbox, deleteAccount, deleteAllEmails, login, setupUser, waitForLatestEmail } from '../../../support/helper';
import { postsService } from '../../../api/services';

const authModals = new AuthModals();

describe('new order email', () => {
    let serviceData;

    let accessTokenFirstUser;
    let accessTokenSecondUser;
    let userDataFirst;
    let userDataSecond;

    let firstInboxId;
    let firstEmailAddress;

    let idServiceWithKeyForFixture;
    let firstUserServiceDataId;
    let orderId;

    before(() => {
        createInbox()
            .then((inbox) => {
                assert.isDefined(inbox);

                firstInboxId = inbox.id;
                firstEmailAddress = inbox.emailAddress;
                setupUser(firstEmailAddress);
            })
            .then((data) => {
                userDataFirst = data.userData;
                accessTokenFirstUser = data.token;
                authModals.navigateToMenuItem(ProfileActions.LOGOUT);
            });
        setupUser().then((data) => {
            userDataSecond = data.userData;
            accessTokenSecondUser = data.token;
            authModals.navigateToMenuItem(ProfileActions.LOGOUT);
        });
    });

    after(() => {
        postsService.changeStatusOrder(accessTokenFirstUser, orderId, 'DONE');
        login(firstEmailAddress, userDataFirst.password);
        deleteAccount(userDataFirst.password);
        login(userDataSecond.email, userDataSecond.password);
        deleteAccount(userDataSecond.password);
    });

    it('Prepare Test data API: First user create service. Second user order the service', () => {
        deleteAllEmails();
        cy.fixture('serviceCreateData').then((data) => {
            serviceData = data;
            postsService.createService(accessTokenFirstUser, data).then((response) => {
                firstUserServiceDataId = response.result;
                idServiceWithKeyForFixture = {
                    serviceId: response.result,
                };
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
        });
    });

    it('Email: new order (first user gets email about new order)', () => {
        waitForLatestEmail(firstInboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Нове замовлення', `Received subject was: ${email.subject}`);

            const plainTextBody = email.body
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();

            assert.include(plainTextBody, `Надійшло нове замовлення від @${userDataSecond.nickname}`, 'Email contains the expected nickname');
            assert.include(plainTextBody, serviceData.nameService, 'Email contains the expected service name');
        });
    });
});
