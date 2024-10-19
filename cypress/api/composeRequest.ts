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
        const cookies = {
            'GCP_IAP_UID': Cypress.env('GCP_IAP_UID'),
            '__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87': Cypress.env('__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87'),
        };
        const config: AxiosRequestConfig = {
            method: method,
            url: `${this.baseUrl}${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `${token}` }),
                ...cookies,
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
        const cookies = {
            'GCP_IAP_UID': Cypress.env('GCP_IAP_UID'),
            '__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87': Cypress.env('__Host-GCP_IAP_AUTH_TOKEN_A610B7646B59DE87'),
        };
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const myHeaders: Record<string, string> = {
            'Content-Type': 'multipart/form-data',
            ...cookies,
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
