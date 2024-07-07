import SupportPage from "../../support/pages/SupportPage";
import { faker } from '@faker-js/faker';

const supportPage = new SupportPage();

function getCurrentTime() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substr(0, 19);
}

describe('success send request to support', () => {
    it('unauthorized user send success request to support (without media files)', () => {
        supportPage.visit()
        supportPage.clickOnSupportLinkInFooter();
        supportPage.typeName(`CypressAutotest`);
        supportPage.typeEmail(faker.internet.email());
        supportPage.typeSubject(faker.company.catchPhrase());
        supportPage.typeText(faker.commerce.productName());
        supportPage.clickOnSendEmailToSupportButton();
        supportPage.assertSendEmailToSupport();
        supportPage.clickOnNackivatiPyatamyButton();
    })
})