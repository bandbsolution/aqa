import ServiceModal from '../modals/ServiceModal';
import { faker } from '@faker-js/faker';
import MyProfile from '../pages/MyProfile';

const serviceModal = new ServiceModal;
const myProfile = new MyProfile;

const categories = [
    'Їжа та напої',
    'Одяг та взуття',
    'Канцелярія',
    'Косметика',
    'Аксесуари',
    'Товари для дому',
    'Флористика',
    'Товари для дітей',
    'Інше',
];

const initOfMeasures = ['г', 'кг', 'мл', 'л', 'см', 'м', 'шт', '-'];

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

Cypress.Commands.add('createService', () => {
    const category = getRandomElement(categories);
    const initOfMeasure = getRandomElement(initOfMeasures);
    const serviceName = faker.commerce.productName();
    const price = faker.commerce.price({ min: 1, max: 99999 });
    const description = faker.commerce.productDescription();
    cy.wait(5000);
    cy.get('span').contains('Послуги').click();
    cy.scrollTo('top');
    myProfile.waitFoDataLoad();
    cy.wait(5000);
    myProfile.clickOnCreateServiceOrPostIf0();
    // cy.get('button').contains('Створити послугу').click();
    serviceModal.typeNameService(serviceName);
    cy.selectDropdownOption('Обери категорію послуги*', category);
    serviceModal.typeAvailableQuantityService(1);
    cy.selectDropdownOption('Наявність*', 'Є в наявності');
    serviceModal.typePriceService(price);
    serviceModal.typeValueOfInitOfMeasureService(10);
    cy.selectDropdownOption('Од.Виміру*', initOfMeasure);
    serviceModal.typeDescriptionService(description);

    serviceModal.novaPoshtaCheckBox();
    serviceModal.povnaOplataCheckBox();
    cy.selectDropdownOption('Дні відправки*', 'Щодня');
    serviceModal.typeDaysService(1);
    serviceModal.clickOnCreateServiceBtn();
    serviceModal.assertNotification('Послугу успішно створено');

    return cy.wrap({ serviceName, category, price, description, initOfMeasure });
});

Cypress.Commands.add('orderService', () => {
    cy.get('[name="buyerNumber"]').type('959595959');
    cy.get('div[role="radiogroup"]')
        .first()
        .within(() => {
            cy.get('input[type="radio"]').eq(0).click();
        });
    cy.get('div[role="radiogroup"]')
        .eq(1)
        .first()
        .within(() => {
            cy.get('input[type="radio"]').eq(0).click();
        });
    cy.get('[role="combobox"]').eq(0).type('Київська', {force: true});
    cy.contains('Київська').click();
    cy.get('[role="combobox"]').eq(1).type('Андріївка', {force: true});
    cy.contains('Андріївка').click();
    cy.get('[name="department"]').type('2', {force: true});
    cy.get('button').contains('Замовити').click();
});
//score eq(n) - 0,1,2,3,4 (1,2,3,4,5)
Cypress.Commands.add('leaveFeedback', (textOfFeedback, score) => {
    myProfile.waitFoDataLoad();
    cy.get('button').contains('Залишити відгук').click();
    cy.get('[placeholder="Опиши більш детально свої враження. Нам дійсно важлива твоя думка!"]').type(textOfFeedback);
    cy.get('input[type="radio"]').eq(0).click({ force: true });
    cy.get('button').contains('Опублікувати відгук').click({ force: true });
});
