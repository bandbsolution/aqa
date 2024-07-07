import { faker } from '@faker-js/faker';
import AuthModals from '../../support/modals/AuthModals';
import { ProfileActions, SettingsMenu, SettingsMenuBlocks } from '../../support/enums';

const authModals = new AuthModals();

describe('create and activate user, change password, change email', () => {
    let inboxId;
    let emailAddress;
    let secondEmailAddress;
    let secondInboxId;
    let activationCode;
    let activationLink;
    let timeCode;
    let linkChangedEmail;
    const name = 'Autotest';
    const surname = 'Cypress';
    const password = '12345678aA';
    const newPassword = '123456789aA';
    const nickname = faker.internet.userName();
    const secondNickname = faker.internet.userName();
    const followUpText = 'Якщо ви не здійснювали цього запиту, проігноруйте його або зверніться у службу підтримки.';

    after(() => {
        cy.login(emailAddress, newPassword);
        cy.deleteAccount(newPassword);
        cy.login(secondEmailAddress, password);
        cy.deleteAccount(password);
    });

    it('create account', () => {
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
        });
    });

    it('activate account via link in email', () => {
        cy.waitForLatestEmail(inboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Activation link', 'Email subject is correct');
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
            cy.deleteAllEmails();
        });
    });

    it('create account with already created and activated nickname and email', () => {
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
        authModals.assertNotification('Акаунт з такою поштою вже існує', { timeout: 50000 });
        authModals.emailField.clear().type(faker.internet.email());
        authModals.clickOnRegisterButton();
        authModals.assertNotification('Користувач з таким нікнеймом, вже зареєстрований', { timeout: 50000 });
    });

    it('activate already activated account', () => {
        cy.visit(activationLink);
        authModals.assertNotification('Акаунт вже було активовано', { timeout: 50000 });
    });

    it('recover password and login with new password', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnResetPass();
        authModals.typeEmail(emailAddress);
        authModals.clickOnContinueButton();

        cy.waitForLatestEmail(inboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Activation code', 'Email subject is correct');
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
            authModals.typePassword(newPassword);
            authModals.typeConfirmPassword(newPassword);
            authModals.clickOnAgreeButton();
            //authModals.assertNotification('Пароль успішно змінено', {timeout: 50000});

            cy.login(emailAddress, newPassword);
            authModals.assertTitle('Моя сторінка');
            cy.deleteAllEmails();
        });
    });

    it('try to recover password passing previously activation code, SKIPPED. BUG: BON-1039', () => {
        authModals.visit();
        authModals.openLoginModal();
        authModals.clickOnResetPass();
        authModals.typeEmail(emailAddress);
        authModals.clickOnContinueButton();
        authModals.typeCode(activationCode);
        authModals.clickOnAgreeButton();

        authModals.assertNotification('Код не вірний або не існує', { timeout: 50000 });
    });

    it('unable to login with old password', () => {
        cy.wait(9000);
        cy.login(emailAddress, password);
        authModals.assertNotification('Не вірний логін або пароль', { timeout: 50000 });
    });

    it('settings - turn on 2FA and login, SKIPPED. BUG: BON-1038', () => {
        cy.login(emailAddress, newPassword);
        authModals.navigateToMenuItem(ProfileActions.SETTINGS);
        cy.frameLoaded('#accSettingsPage');
        cy.iframe('#accSettingsPage').find('button').contains('Безпека').click({ force: true });
        cy.iframe('#accSettingsPage').find('span').contains('Двофакторна аутентифікація').should('be.visible').click({ force: true });
        cy.iframe('#accSettingsPage').find('input[placeholder="Введіть E-mail*"]').should('have.value', emailAddress);

        cy.iframe('#accSettingsPage').find('[role="region"]').eq(2).find('input').eq(0).should('not.be.checked');
        cy.iframe('#accSettingsPage').find('[role="region"]').eq(2).find('input').eq(0).click({ force: true });
        cy.iframe('#accSettingsPage').find('button').contains('Підтвердити').click();
        cy.contains('Ви вмикаєте двофакторну аутентифікацію');
        cy.contains('На вказану вами електронну пошту надіслано листа з кодом підтвердження, будь ласка введіть його нижче.');

        cy.waitForLatestEmail(inboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Time code', 'Email subject is correct');

            const plainTextBody = email.body
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();

            assert.include(
                plainTextBody,
                'У вас увімкнена двухфакторна аутентифікація. Підтвердіть вашу особистість для входу в обліковий запис. Ваш код підтвердження:',
                'Email contains the expected text'
            );
            assert.include(plainTextBody, followUpText, 'Email contains the follow-up text');
            authModals.checkSupportLink(email.body);

            timeCode = />(\d{6})</.exec(email.body)[1];

            authModals.typeCode(timeCode);
            authModals.clickOnAgreeButton();
            authModals.navigateToMenuItem(ProfileActions.LOGOUT);

            cy.login(emailAddress, newPassword);
            authModals.typeCode(timeCode);
            //authModals.assertNotification('Двухфакторну аутентифікацію увімкнено', {timeout: 50000});
            cy.deleteAllEmails();
        });
    });

    it('settings - change email - change to the same email, change to already registered account', () => {
        cy.login(emailAddress, newPassword);
        authModals.choseMenuInSettings(SettingsMenu.Security, SettingsMenuBlocks.ChangeEmail);
        cy.iframe('#accSettingsPage').find('[role="region"]').eq(1).find('input').type(emailAddress);
        cy.iframe('#accSettingsPage').find('button').contains('Змінити').should('be.disabled');

        cy.iframe('#accSettingsPage').find('[role="region"]').eq(1).find('input').clear().type('drunyakk@gmail.com');
        cy.iframe('#accSettingsPage').find('[style="margin-top: 40px;"]').eq(1).click({force: true});
        cy.iframe('#accSettingsPage').contains('Користувач з такою поштою вже зареєстрований.',{timeout: 50000});
    });

    it('settings - change email to new one and login', () => {
        cy.createInbox().then((inbox) => {
            assert.isDefined(inbox);

            secondInboxId = inbox.id;
            secondEmailAddress = inbox.emailAddress;

            cy.login(emailAddress, newPassword);
            authModals.assertTitle('Моя сторінка');
            authModals.choseMenuInSettings(SettingsMenu.Security, SettingsMenuBlocks.ChangeEmail);
            cy.iframe('#accSettingsPage').find('[role="region"]').eq(1).find('input').clear().type(secondEmailAddress);
            cy.iframe('#accSettingsPage').find('[style="margin-top: 40px;"]').eq(1).click({ force: true });
            cy.contains('Зміна електронної пошти');
            cy.contains(
                'На вказану вами електронну пошту було надіслано листа про зміну електронної пошти. Будь ласка, перевірте вашу поштову скриньку.'
            );
            authModals.navigateToMenuItem(ProfileActions.LOGOUT);
            cy.login(emailAddress, newPassword); // still able to log in with old email
            authModals.assertTitle('Моя сторінка');
            authModals.navigateToMenuItem(ProfileActions.LOGOUT);

        cy.waitForLatestEmail(secondInboxId).then((email) => {
            assert.isDefined(email);
            assert.strictEqual(email.subject, 'Update email', 'Email subject is correct');

            const plainTextBody = email.body
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();

            assert.include(
                plainTextBody,
                'Щоб завершити зміну електронної пошти, підтвердіть свою адресу електронної пошти за посиланням нижче:',
                'Email contains the expected text'
            );

            linkChangedEmail = email.body.match(/href="(https:\/\/[^"]+?email=[^"]+)"/)[1];
            cy.visit(linkChangedEmail);
            authModals.clickClosModal();
            authModals.assertNotification('Електронну адресу успішно змінено', { timeout: 50000 });
            cy.login(secondEmailAddress, newPassword);
            authModals.assertTitle('Моя сторінка');
            cy.deleteAllEmails();
        });
      });
    });

    it('settings - unable to login with old email after success change to new email. Register again with old email, but not activate account', () => {
        cy.login(emailAddress, newPassword);
        authModals.assertNotification('Не вірний логін або пароль');
        authModals.clickOnCreateAcc();
        authModals.typeName(name);
        authModals.typeSurname(surname);
        authModals.typeNickname(secondNickname);
        authModals.typeEmail(emailAddress);
        authModals.typePassword(password);
        authModals.typeConfirmPassword(password);
        authModals.agreeRegisterCheckbox();
        authModals.clickOnRegisterButton();
        cy.contains('Підтвердження електронної пошти');
        cy.contains(
            'На вказану Вами електронну пошту, було надіслано листа з підвердженням реєстрації. Будь ласка, перевірте Вашу поштову скриньку.'
        );
        cy.login(emailAddress, password);
        authModals.assertNotification('Акаунт не активовано', { timeout: 50000 });
    });
});
