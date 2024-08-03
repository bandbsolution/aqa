import AuthModals from '../../../support/modals/AuthModals';
import { ProfileActions } from '../../../support/enums';
import { createInbox, deleteAccount, deleteAllEmails, login, setupUser, waitForLatestEmail } from '../../../support/helper';
import { postsService } from '../../../api/services';

const authModals = new AuthModals();

describe('user leave feedback email', () => {
    let serviceData;

    let accessTokenFirstUser;
    let accessTokenSecondUser;
    let userDataFirst;
    let userDataSecond;

    let firstInboxId;
    let firstEmailAddress;

    let idServiceWithKeyForFixture;
    let firstUserServiceDataId;

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
        login(firstEmailAddress, userDataFirst.password);
        deleteAccount(userDataFirst.password);
        login(userDataSecond.email, userDataSecond.password);
        deleteAccount(userDataSecond.password);
    });

    it('Prepare Test data API: Second user leave feedback about service and First user gets email', () => {
        deleteAllEmails();
        cy.fixture('serviceCreateData').then((data) => {
            serviceData = data;
            postsService.createService(accessTokenFirstUser, data).then((response) => {
                firstUserServiceDataId = response.result;
                idServiceWithKeyForFixture = {
                    serviceId: response.result,
                };
                postsService.createFeedback(accessTokenSecondUser, 'good autotest', firstUserServiceDataId, 1);
            });
        });
    });

    it('Email: user leave feedback (first user gets email about feedback on service)', () => {
        waitForLatestEmail(firstInboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Новий відгук', `Received subject was: ${email.subject}`);

            const plainTextBody = email.body
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();

            assert.include(plainTextBody, `У вас новий відгук:`, 'Email contains the expected text');
            assert.include(plainTextBody, `Від: ${userDataSecond.nickname}`, 'Email contains the expected nickname');
            assert.include(plainTextBody, `До: ${serviceData.nameService}`, 'Email contains the expected service');
        });
    });
});
