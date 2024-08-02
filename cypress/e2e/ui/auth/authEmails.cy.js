import AuthModals from '../../../support/modals/AuthModals';
import { createInbox, createUser, deleteAccount, deleteAllEmails, login, waitForLatestEmail } from '../../../support/helper';

const followUpText = 'Якщо ви не здійснювали цього запиту, проігноруйте його або зверніться у службу підтримки.';
const authModals = new AuthModals();

describe('action with auth and emails', () => {
    let inboxId;
    let emailAddress;
    let activationCode;
    let activationLink;
    let userPassword;
    const newUserPassword = '123456789aA!';

    before(() => {
         createInbox().then((inbox) => {
            assert.isDefined(inbox);

            inboxId = inbox.id;
            emailAddress = inbox.emailAddress;
        });
    });

    after(() => {
        login(emailAddress, newUserPassword);
        deleteAccount(newUserPassword);
    });

    beforeEach(() => {
        deleteAllEmails();
    });

    it('register user with real email and activate account via link in email', () => {
        cy.log(emailAddress);
        createUser(emailAddress)
            .then((response) => {
                userPassword = response.password;
                 waitForLatestEmail(inboxId);
            })
            .then((email) => {
                assert.isDefined(email);
                assert.strictEqual(email.subject, 'Посилання для активації', 'Email subject is correct');
                const plainTextBody = email.body
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s\s+/g, ' ')
                    .trim();
                assert.include(
                    plainTextBody,
                    'Щоб завершити реєстрацію облікового запису, підтвердіть свою адресу електронної пошти за посиланням нижче:',
                    'Email contains the expected text'
                );

                activationLink = email.body.match(/href="(https:\/\/[^"]+?isActive=[^"]+)"/)[1];
                cy.visit(activationLink);
                authModals.assertNotification('Акаунт успішно активовано', { timeout: 50000 });
            });
    });

    it('recover password and login with new password', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnResetPass();
        authModals.typeEmail(emailAddress);
        authModals.clickOnContinueButton();

        waitForLatestEmail(inboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Код активації', 'Email subject is correct');
            const plainTextBody = email.body
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();
            assert.include(
                plainTextBody,
                'Ми отримали запит на зміну паролю для вашого облікового запису. Ваш код підтвердження:',
                'Email contains the expected text'
            );
            assert.include(plainTextBody, followUpText, 'Email contains the follow-up text');
            authModals.checkSupportLink(email.body);

            activationCode = />(\d{6})</.exec(email.body)[1];

            authModals.typeCode(activationCode);
            authModals.clickOnAgreeButton();
            authModals.typePassword(newUserPassword);
            authModals.typeConfirmPassword(newUserPassword);
            authModals.clickOnAgreeButton();
            cy.wait(3000);
            //authModals.assertNotification('Пароль успішно змінено', {timeout: 50000});
            authModals.typeEmail(emailAddress);
            authModals.typePassword(newUserPassword);
            authModals.clickOnLoginBtn();
            authModals.assertTitle('Моя сторінка');
        });
    });

    it('try to recover password passing previously activation code', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnResetPass();
        authModals.typeEmail(emailAddress);
        authModals.clickOnContinueButton();
        authModals.typeCode(activationCode);
        authModals.clickOnAgreeButton();

        authModals.assertNotification('Некоректний тимчасовий ключ', { timeout: 50000 });
    });

    it('unable to login with old password', () => {
        cy.wait(9000);
        login(emailAddress, userPassword);
        authModals.assertNotification('Не вірний логін або пароль', { timeout: 50000 });
    });
});
