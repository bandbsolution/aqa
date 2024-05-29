import MainPagePageObject from "../support/pages/MainPage.pageObject";
import LoginFormPageObject from "../support/pages/LoginForm.pageObject";

const mainPage = new MainPagePageObject;
const loginForm = new LoginFormPageObject;
const expectedTexts = [
    'Підтримуй та плекай українське – воно душу й серце гріє.',
    'Знайом зі своїм продуктом, бо він того вартий.',
    'Створюй зв’язки та прозорі стосунки, адже це основа довіри.',
    'Розвивай свій бізнес та отримуй прибуток.',
    'Отримуй миттєві сповіщення, щоб бути завжди в курсі подій.',
    'Ділись своїми новинами – нам це дійсно цікаво.'
];

describe('smoke test for unauthorized user', () => {
    it('Main page functional', () => {
        mainPage.visit();
        mainPage.assertUrl(Cypress.config('baseUrl'));
        mainPage.assertTitle('BONFAIR');
        mainPage.validateAdvice1();
        mainPage.validateAdvice2();
        mainPage.validateAdvice3();
        mainPage.clickOnLetsSeeBtn();
        mainPage.assertModalWindow();
        loginForm.loginBtn.should('be.disabled')
        mainPage.closeModal();
        mainPage.clickOnSupportLinkinFooter();
        // cy.wait(10000);
    })
    it('Carousel Test', () =>{
        mainPage.visit();
        for (let i = 0; i <= 5; i++) {
            cy.get(`.slick-slide[data-index="${i}"]`)
                .should('have.class', 'slick-active')
                .and('have.class', 'slick-current');

            cy.get(`.slick-slide[data-index="${i}"] span`)
                .should('exist')
                .and('have.text',expectedTexts[i])

            cy.wait(5000);
        }
    })
})