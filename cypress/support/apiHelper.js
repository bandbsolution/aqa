const baseApiUrl = Cypress.config('baseApiUrl');

export const createCommentOrResponseAPI = (token, commentText, idPost, typeComment) => {
    return cy.request({
        method: 'POST',
        url: `${baseApiUrl}posts/comment`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`,
            'Content-Type': 'application/json',
        },
        body: {
            text: commentText,
            typeComment: typeComment, //post , response
            id: idPost,
        },
    });
};

export const createFeedbackAPI = (token, textFeedback, serviceId, rating) => {
    return cy.request({
        method: 'POST',
        url: `${baseApiUrl}posts/feedback`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        },
        body: {
            text: textFeedback,
            serviceId: serviceId,
            rating: rating,
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const createOrderAPI = (token, serviceId, qty, contact, deliveryType, paymentType, comment, price) => {
    return cy.request({
        method: 'POST',
        url: `${baseApiUrl}posts/order/create`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        },
        body: {
            serviceId: serviceId,
            qty: qty,
            contact: contact,
            deliveryType: deliveryType,
            paymentType: paymentType,
            comment: comment,
            price: price
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const getUserInfoAPI = (token) => {
    return cy.request({
        method: 'GET',
        url: `${baseApiUrl}auth/user`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const likePostAPI = (token, postId, isLikePost) => {
    return cy.request({
        method: 'PUT',
        url: `${baseApiUrl}posts/post/like?postId=${postId}&isLikePost=${isLikePost}`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const likeCommentAPI = (token, commentId, isLikeComment) => {
    return cy.request({
        method: 'PUT',
        url: `${baseApiUrl}posts/comment/like?commentId=${commentId}&isLikedComment=${isLikeComment}`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const changeOrderStatusAPI = (token, orderId, orderStatus) => {
    return cy.request({
        method: 'POST',
        url: `${baseApiUrl}posts/order/change-status?orderId=${orderId}&orderStatus=${orderStatus}`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`,
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const subscribeAPI = (token, subscriptionId) => {
    return cy.request({
        method: 'PUT',
        url: `${baseApiUrl}auth/subscribe?subscriptionId=${subscriptionId}`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const changeUserAPI = (token, name, surname, nickname, city, region, country, description, number) => {
    return cy.request({
        method: 'PUT',
        url: `${baseApiUrl}auth/user/update`,
        headers: {
            accept: '*/*',
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        },
        body: {
            name: name,
            surname: surname,
            nickname: nickname,
            city: city,
            region: region,
            country: country,
            description: description,
            number: number,


        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
};

export const getUserToken = () => {
    return new Cypress.Promise((resolve, reject) => {
        cy.window().then((win) => {
            const token = win.localStorage.getItem('accessToken');
            if (token) {
                resolve(token);
            } else {
                reject('Token not found');
            }
        });
    });
};

Cypress.Commands.add('createPostAPI', (token, description) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${token}`);

    const formData = new FormData();
    formData.append("description", description);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
    };
    console.log('Request:', JSON.stringify({
        method: requestOptions.method,
        url: `${baseApiUrl}posts/post`,
        headers: {
            Authorization: `${token}`
        },
        body: {
            description: description
        }
    }));

    return new Cypress.Promise((resolve, reject) => {
        fetch(`${baseApiUrl}posts/post`, requestOptions)
            .then((response) => {
                if (response.status !== 200) {
                    reject(new Error(`Failed with status ${response.status}`));
                }
                return response.json();
            })
            .then((result) => {
                if (!result.result) {
                    reject(new Error('Missing result property in response'));
                }
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
});

Cypress.Commands.add('createServiceAPI', (token, media, estimatedTime, price, deliveryOption, nameService, deliveryDays, valueOfInitOfMeasure, currency, availableQuantity, initOfMeasure, availability, paymentOption, description, category) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${token}`);

    const formData = new FormData();
    formData.append('media', media || '');
    formData.append('estimatedTime', estimatedTime);
    formData.append('price', price);
    formData.append('deliveryOption', deliveryOption);
    formData.append('nameService', nameService);
    formData.append('deliveryDays', deliveryDays);
    formData.append('valueOfInitOfMeasure', valueOfInitOfMeasure);
    formData.append('currency', currency);
    formData.append('availableQuantity', availableQuantity);
    formData.append('initOfMeasure', initOfMeasure);
    formData.append('availability', availability);
    formData.append('paymentOption', paymentOption);
    formData.append('description', description || '');
    formData.append('category', category);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
    };
    console.log('Request:', JSON.stringify({
        method: requestOptions.method,
        url: `${baseApiUrl}posts/service`,
        headers: {
            Authorization: `${token}`
        },
        body: {
            media: description,
            estimatedTime: estimatedTime,
            price: price,
            deliveryOption: deliveryOption,
            nameService: nameService,
            deliveryDays: deliveryDays,
            valueOfInitOfMeasure: valueOfInitOfMeasure,
            currency: currency,
            availableQuantity: availableQuantity,
            initOfMeasure: initOfMeasure,
            availability: availability,
            paymentOption: paymentOption,
            description: description,
            category: category,
        }
    }));

    return new Cypress.Promise((resolve, reject) => {
        fetch(`${baseApiUrl}posts/service`, requestOptions)
            .then((response) => {
                if (response.status !== 200) {
                    reject(new Error(`Failed with status ${response.status}`));
                }
                return response.json();
            })
            .then((result) => {
                if (!result.result) {
                    reject(new Error('Missing result property in response'));
                }
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
});