import { faker } from '@faker-js/faker';
import AuthModals from '../../../support/modals/AuthModals';
import { ProfileActions, SettingsMenu, SettingsMenuBlocks, Statuses } from '../../../support/enums';
import { createInbox, createUser } from '../../../support/helper';

const authModals = new AuthModals();

function turnOffEmailSubscriptions() {
    cy.iframe('#accSettingsPage')
        .find('[role="region"]')
        .eq(1)
        .then(($region) => {
            const inputs = $region.find('input');

            inputs.each((index, input) => {
                cy.wrap(input).click();
                cy.wait(1000);
            });

            inputs.each((index, input) => {
                cy.wrap(input).should('not.be.checked');
            });
        });
}

describe('get emails: change status of order, leave feedback, new order', () => {
    let inboxId;
    let emailAddress;
    let activationLink;
    let serviceData;

    let secondInboxId;
    let secondEmailAddress;
    let secondActivationLink;

    const name = 'First';
    const surname = 'Userfirst';
    const secondName = 'Second';
    const secondSurname = 'Usersecond';
    const password = '12345678aA';
    const nickname = faker.internet.userName();
    const secondNickname = faker.internet.userName();

    beforeEach(() => {
        createInbox().then((inbox) => {
            assert.isDefined(inbox);

            inboxId = inbox.id;
            emailAddress = inbox.emailAddress;
        })

        after(() => {
            authModals.navigateToMenuItem(ProfileActions.LOGOUT);
            cy.login(emailAddress, password);
            cy.deleteAccount(password);
            cy.login(secondEmailAddress, password);
            cy.deleteAccount(password);
        });

        it('create First user', () => {
            cy.createInbox().then((inbox) => {
                assert.isDefined(inbox);

                inboxId = inbox.id;
                emailAddress = inbox.emailAddress;

                authModals.visit();
                authModals.openLoginModal();
                authModals.clickOnCreateAcc();
                authModals.typeName(name);
                authModals.typeSurname(surname);
                authModals.typeNickname(nickname);
                authModals.typeEmail(emailAddress);
                authModals.typePassword(password);
                authModals.typeConfirmPassword(password);
                authModals.agreeRegisterCheckbox();
                authModals.clickOnRegisterButton();
                authModals.assertSuccessRegisterAccount();

                cy.waitForLatestEmail(inboxId).then((email) => {
                    assert.isDefined(email);
                    assert.strictEqual(email.subject, 'Посилання для активації', `Received subject was: ${email.subject}`);
                    activationLink = email.body.match(/href="(https:\/\/[^"]+?isActive=[^"]+)"/)[1];
                    cy.visit(activationLink);
                    authModals.assertNotification('Акаунт успішно активовано', { timeout: 50000 });
                    cy.deleteAllEmails();
                });
            });
        });

        it('create Second user', () => {
            cy.createInbox().then((inbox) => {
                assert.isDefined(inbox);

                secondInboxId = inbox.id;
                secondEmailAddress = inbox.emailAddress;

                createUser(secondEmailAddress)

                authModals.visit();
                authModals.openLoginModal();
                authModals.clickOnCreateAcc();
                authModals.typeName(secondName);
                authModals.typeSurname(secondSurname);
                authModals.typeNickname(secondNickname);
                authModals.typeEmail(secondEmailAddress);
                authModals.typePassword(password);
                authModals.typeConfirmPassword(password);
                authModals.agreeRegisterCheckbox();
                authModals.clickOnRegisterButton();
                authModals.assertSuccessRegisterAccount();

                cy.waitForLatestEmail(secondInboxId).then((email) => {
                    assert.isDefined(email);
                    assert.strictEqual(email.subject, 'Посилання для активації', `Received subject was: ${email.subject}`);
                    secondActivationLink = email.body.match(/href="(https:\/\/[^"]+?isActive=[^"]+)"/)[1];
                    cy.visit(secondActivationLink);
                    authModals.assertNotification('Акаунт успішно активовано', { timeout: 50000 });
                    cy.deleteAllEmails();
                });
            });
        });

        it('First user - create service', () => {
            cy.login(emailAddress, password);
            cy.createService().then((service) => {
                serviceData = service;
            });
        });

        it('Second user - order service of First user. First user gets email about new order', () => {
            cy.login(secondEmailAddress, password);
            authModals.openSearchPage();
            authModals.inputInSearchFiled(serviceData.serviceName);
            cy.get('button').contains('Детальніше').click();
            cy.get('button').contains('Замовити').click();
            cy.orderService();
            cy.waitForLatestEmail(inboxId).then((email) => {
                assert.isDefined(email);
                assert.strictEqual(email.subject, 'Нове замовлення', `Received subject was: ${email.subject}`);

                const plainTextBody = email.body
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s\s+/g, ' ')
                    .trim();

                assert.include(plainTextBody, `Надійшло нове замовлення від @${secondNickname}`, 'Email contains the expected nickname');
                assert.include(plainTextBody, serviceData.serviceName, 'Email contains the expected service name');
            });
            cy.deleteAllEmails();
        });

        it('Second user leave feedback about service and First user gets email', () => {
            cy.login(secondEmailAddress, password);
            authModals.openSearchPage();
            authModals.inputInSearchFiled(serviceData.serviceName);
            cy.get('button').contains('Детальніше').click();
            cy.leaveFeedback('12345');
            cy.waitForLatestEmail(inboxId).then((email) => {
                assert.isDefined(email);
                assert.strictEqual(email.subject, 'Новий відгук', `Received subject was: ${email.subject}`);

                const plainTextBody = email.body
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s\s+/g, ' ')
                    .trim();

                assert.include(plainTextBody, `У вас новий відгук:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Від: ${secondNickname}`, 'Email contains the expected nickname');
                assert.include(plainTextBody, `До: ${serviceData.serviceName}`, 'Email contains the expected service');
            });
            cy.deleteAllEmails();
        });

        it('First user change status of order. Second user gets emails about changing statuses', () => {
            cy.login(emailAddress, password);
            authModals.openScheduler();
            cy.get('button').contains('Замовлення').click();
            authModals.chooseStatusOfOrder(Statuses.NEW);
            authModals.chooseStatusOfOrder(Statuses.IN_PROGRESS);
            cy.waitForLatestEmail(secondInboxId).then((email) => {
                assert.isDefined(email);
                assert.strictEqual(email.subject, 'Зміна статусу замовлення', `Received subject was: ${email.subject}`);

                const plainTextBody = email.body
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s\s+/g, ' ')
                    .trim();

                assert.include(plainTextBody, `Статус вашого замовлення був змінений:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Замовлення:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Статус: ${Statuses.NEW} ${Statuses.IN_PROGRESS}`, 'Email contains the expected text');
            });
            cy.deleteAllEmails();
            authModals.chooseStatusOfOrder(Statuses.IN_PROGRESS);
            authModals.chooseStatusOfOrder(Statuses.SENT);
            cy.waitForLatestEmail(secondInboxId).then((email) => {
                assert.isDefined(email);
                assert.strictEqual(email.subject, 'Зміна статусу замовлення', `Received subject was: ${email.subject}`);

                const plainTextBody = email.body
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s\s+/g, ' ')
                    .trim();

                assert.include(plainTextBody, `Статус вашого замовлення був змінений:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Замовлення:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Статус: ${Statuses.IN_PROGRESS} ${Statuses.SENT}`, 'Email contains the expected text');
            });
            cy.deleteAllEmails();
            authModals.chooseStatusOfOrder(Statuses.SENT);
            authModals.chooseStatusOfOrder(Statuses.DELIVERED);
            cy.waitForLatestEmail(secondInboxId).then((email) => {
                assert.isDefined(email);
                assert.strictEqual(email.subject, 'Зміна статусу замовлення', `Received subject was: ${email.subject}`);

                const plainTextBody = email.body
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s\s+/g, ' ')
                    .trim();

                assert.include(plainTextBody, `Статус вашого замовлення був змінений:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Замовлення:`, 'Email contains the expected text');
                assert.include(plainTextBody, `Статус: ${Statuses.SENT} ${Statuses.DELIVERED}`, 'Email contains the expected text');
            });
            cy.deleteAllEmails();
        });

        it('settings - turn off email subscribes for two accounts', () => {
            cy.login(emailAddress, password);
            authModals.choseMenuInSettings(SettingsMenu.Notifications, SettingsMenuBlocks.EmailSubscription);
            turnOffEmailSubscriptions();
            authModals.navigateToMenuItem(ProfileActions.LOGOUT);
            cy.login(secondEmailAddress, password);
            authModals.choseMenuInSettings(SettingsMenu.Notifications, SettingsMenuBlocks.EmailSubscription);
            turnOffEmailSubscriptions();
        });

        it('turned off email notification about Feedback. Second user leave feedback again. First user dont get email', () => {
            cy.login(secondEmailAddress, password);
            authModals.openSearchPage();
            authModals.inputInSearchFiled(serviceData.serviceName);
            cy.get('button').contains('Детальніше').click();
            cy.leaveFeedback('12345');
            cy.wait(5000);
            cy.emailCount(inboxId).then((emailCount) => {
                expect(emailCount.totalElements).to.equal(0);
            });
        });

        it('turned off email notification about New order. Second user order service again. First user dont get email', () => {
            cy.login(secondEmailAddress, password);
            authModals.openSearchPage();
            authModals.inputInSearchFiled(serviceData.serviceName);
            cy.get('button').contains('Детальніше').click();
            cy.get('button').contains('Замовити').click();
            cy.orderService();
            cy.wait(5000);
            cy.emailCount(inboxId).then((emailCount) => {
                expect(emailCount.totalElements).to.equal(0);
            });
        });

        it('turned off email notification about Changing status of order. First user change order status. Second user dont get email', () => {
            cy.login(emailAddress, password);
            authModals.openScheduler();
            cy.get('button').contains('Замовлення').click();
            authModals.chooseStatusOfOrder(Statuses.NEW);
            authModals.chooseStatusOfOrder(Statuses.IN_PROGRESS);
            authModals.chooseStatusOfOrder(Statuses.CANCELED);
            cy.wait(5000);
            cy.emailCount(inboxId).then((emailCount) => {
                expect(emailCount.totalElements).to.equal(0);
            });
        });
    });
});