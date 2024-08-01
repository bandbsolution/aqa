import { AxiosRequestConfig } from 'axios';

interface RequestConfig {
    token?: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
}

class ComposeRequest {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = Cypress.env('baseApiUrl');
    }

    composeRequest({ token, url, method, data }: RequestConfig): Cypress.Chainable {
        const config: AxiosRequestConfig = {
            method: method,
            url: `${this.baseUrl}${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `${token}` }),
            },
            ...(data && { data: data }),
        };

        cy.log('Request:', JSON.stringify(config));

        return cy
            .request({
                method: config.method as Cypress.HttpMethod,
                url: config.url,
                headers: config.headers,
                body: config.data,
            })
            .then((response) => {
                cy.log('Response:', JSON.stringify(response.body));
                return cy.wrap(response.body);
            });
    }

    composeRequestMultiPart({ token, url, method, data }: RequestConfig): Cypress.Chainable {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const myHeaders: Record<string, string> = {
            'Content-Type': 'multipart/form-data',
        };
        if (token) {
            myHeaders['Authorization'] = token;
        }

        const boundary = '----CypressFormDataBoundary';
        myHeaders['Content-Type'] = `multipart/form-data; boundary=${boundary}`;

        const serializedDataParts: string[] = [];
        formData.forEach((value, key) => {
            serializedDataParts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`);
        });
        const serializedData = serializedDataParts.join('') + `--${boundary}--`;

        cy.log(
            'Request:',
            JSON.stringify({
                method: method,
                url: `${this.baseUrl}${url}`,
                headers: myHeaders,
                body: data,
            })
        );

        return cy.wrap(null).then(() => {
            return cy
                .request({
                    method: method as Cypress.HttpMethod,
                    url: `${this.baseUrl}${url}`,
                    headers: myHeaders,
                    body: serializedData,
                    encoding: 'binary',
                })
                .then((response) => {
                    cy.log('Response:', JSON.stringify(response.body));
                    return cy.wrap(response.body);
                });
        });
    }
}

export default ComposeRequest;
