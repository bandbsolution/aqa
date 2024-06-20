import PageObject from '../PageObject';

class ServiceModal extends PageObject {

    get nameServiceField() {
        return cy.get('[name="nameService"]');
    }

    get availableQuantityField() {
        return cy.get('[name="availableQuantity"]');
    }

    get priceField() {
        return cy.get('[name="price"]');
    }

    get valueOfInitOfMeasureField() {
        return cy.get('[name="valueOfInitOfMeasure"]');
    }

    get descriptionTextArea() {
        return cy.get('textarea[name="description"]');
    }

    get daysField() {
        return cy.get('[name="estimatedTime"]');
    }

    clickOnCreateServiceBtn() {
        cy.get('button').filter(`:contains("Створити")`).filter(function() {
            return Cypress.$(this).text().trim() === 'Створити';
        }).click();
    }

    typeNameService(nameService) {
        this.nameServiceField.type(nameService, {force: true});
    }

    typeAvailableQuantityService(availableQuantityService) {
        this.availableQuantityField.type(availableQuantityService, {force: true});
    }

    typePriceService(priceService) {
        this.priceField.type(priceService, {force: true});
    }

    typeValueOfInitOfMeasureService(valueOfInitOfMeasureService) {
        this.valueOfInitOfMeasureField.type(valueOfInitOfMeasureService, {force: true});
    }

    typeDescriptionService(descriptionService) {
        this.descriptionTextArea.type(descriptionService);
    }

    typeDaysService(daysService) {
        this.daysField.type(daysService, {force: true});
    }

    novaPoshtaCheckBox() {
        cy.get('span').contains('Нова Пошта').click();
    }

    uaPoshtaCheckBox() {
        cy.get('span').contains('УкрПошта').click();
    }

    courierDeliveryCheckBox() {
        cy.get('span').contains('Кур\'єрська доставка').click();
    }

    povnaOplataCheckBox() {
        cy.get('span').contains('Повна оплата').click();
    }

    chastkovaOplataCheckBox() {
        cy.get('span').contains('Часткова передоплата').click();
    }

    oplataPriOtrimaniCheckBox() {
        cy.get('span').contains('Оплата при отриманні').click();
    }

}

export default ServiceModal;
