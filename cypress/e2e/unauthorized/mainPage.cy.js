import MainPage from "../../support/pages/MainPage";
import AuthModals from "../../support/modals/AuthModals";

const mainPage = new MainPage;
const authModals = new AuthModals();
const expectedTexts = [
    'Підтримуй та плекай українське – воно душу й серце гріє.',
    'Знайом зі своїм продуктом, бо він того вартий.',
    'Створюй зв’язки та прозорі стосунки, адже це основа довіри.',
    'Розвивай свій бізнес та отримуй прибуток.',
    'Отримуй миттєві сповіщення, щоб бути завжди в курсі подій.',
    'Ділись своїми новинами – нам це дійсно цікаво.'
];

describe('test main page for unauthorized user', () => {
    it('Main page functional', () => {

        mainPage.visit();
        mainPage.assertUrl(Cypress.config('baseUrl'));
        mainPage.assertTitle('BONFAIR');

        mainPage.validateAdvice1();
        mainPage.validateAdvice2();
        mainPage.validateAdvice3();
        mainPage.clickOnLetsSeeBtn();
        mainPage.assertModalWindow();
        authModals.clickClosModal();
        mainPage.clickOnSupportLinkInFooter();
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