import ServiceModal from "../modals/ServiceModal";
import { faker } from '@faker-js/faker';
import MyProfile from "../pages/MyProfile";

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
    'Інше'
];

const initOfMeasures = ['г', 'кг', 'мл', 'л', 'см', 'м', 'шт', '-'];

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

Cypress.Commands.add('createService', () => {
    const category = getRandomElement(categories);
    const initOfMeasure = getRandomElement(initOfMeasures)
    const serviceName = faker.commerce.productName();
    const price = faker.commerce.price({min: 1, max: 99999});
    const description = faker.commerce.productDescription();

    cy.get('span').contains('Послуги').click();
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
    cy.selectDropdownOption('Дні відправки*', 'Щодня')
    serviceModal.typeDaysService(1);
    serviceModal.clickOnCreateServiceBtn();
    serviceModal.assertNotification('Послугу успішно створено')

    return cy.wrap({ serviceName, category, price, description, initOfMeasure });

});