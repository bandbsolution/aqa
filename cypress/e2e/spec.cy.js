import LoginFormPageObject from "../support/pages/LoginForm.pageObject";
import { faker } from '@faker-js/faker';

const loginForm = new LoginFormPageObject;

const testData = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('template spec', () => {
  it('passes', () => {
    loginForm.visit()
    cy.get('[data-testid="PermIdentityIcon"]').click();
    loginForm.typeEmail(testData.email);
    loginForm.typePassword(testData.password);
    // loginForm.clickOnLoginBtn();

  })
})