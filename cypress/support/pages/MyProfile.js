import PageObject from '../PageObject';

class MyProfile extends PageObject {

    clickOnCreateServiceOrPostIf0() {
        cy.get('button').contains('Нумо створювати!').click();
    }

}

export default MyProfile;