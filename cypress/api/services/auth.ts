import ComposeRequest from '../composeRequest';

const serviceUrl = 'auth';

class Auth {
    private apiRequest: ComposeRequest;

    constructor() {
        this.apiRequest = new ComposeRequest();
    }

    getUser(token: string): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/user`,
                    method: 'GET',
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    subscribe(token: string, subscriptionId: string): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/subscribe?subscriptionId=${subscriptionId}`,
                    method: 'PUT',
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    updateUser(token: string, data: {}): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/user/update`,
                    method: 'PUT',
                    data: data,
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }
}

export default Auth;
