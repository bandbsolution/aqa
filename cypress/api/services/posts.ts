import ComposeRequest from '../composeRequest';

const serviceUrl = 'posts';

class Posts {
    private apiRequest: ComposeRequest;

    constructor() {
        this.apiRequest = new ComposeRequest();
    }

    createPost(token: string, description: string): Cypress.Chainable {
        const postData = {
            description: description,
        };

        return this.apiRequest.composeRequestMultiPart({
            token,
            url: `${serviceUrl}/post`,
            method: 'POST',
            data: postData,
        });
    }

    createService(token: string, postData: any): Cypress.Chainable {
        return this.apiRequest.composeRequestMultiPart({
            token,
            url: `${serviceUrl}/service`,
            method: 'POST',
            data: postData,
        });
    }

    createComment(token: string, commentText: string, idPost: string): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/comment`,
                    method: 'POST',
                    data: {
                        text: commentText,
                        typeComment: 'post',
                        id: idPost,
                    },
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    createResponse(token: string, responseText: string, idComment: string): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/comment`,
                    method: 'POST',
                    data: {
                        text: responseText,
                        typeComment: 'response',
                        id: idComment,
                    },
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    changeStatusOrder(token: string, orderId: string, orderStatus: string): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/order/change-status?orderId=${orderId}&orderStatus=${orderStatus}`,
                    method: 'POST',
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    likeComment(token: string, commentId: string, isLikeComment: boolean): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/comment/like?commentId=${commentId}&isLikedComment=${isLikeComment}`,
                    method: 'PUT',
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    likePost(token: string, postId: string, isLikePost: boolean): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/post/like?postId=${postId}&isLikePost=${isLikePost}`,
                    method: 'PUT',
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    createFeedback(token: string, textFeedback: string, serviceId: string, rating: number): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/feedback`,
                    method: 'POST',
                    data: {
                        text: textFeedback,
                        serviceId: serviceId,
                        rating: rating,
                    },
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }

    createOrder(token: string, data: {}): Cypress.Chainable {
        return cy
            .wrap(null)
            .then(() => {
                return this.apiRequest.composeRequest({
                    token,
                    url: `${serviceUrl}/order/create`,
                    method: 'POST',
                    data: data,
                });
            })
            .then((response) => {
                return cy.wrap(response);
            });
    }
}

export default Posts;
