declare namespace Cypress {
    interface Chainable {
        selectDropdownOption(dropDownName: string, optionText: string): Chainable<Response<any>>;
        uploadAndSavePhoto(fileName: any): Chainable<Response<any>>;
        createUser(id: string): Chainable<Response<any>>;
        activateAccount(email: string): Chainable<Response<any>>;
        deleteAccount(password: string): Chainable<Response<any>>;
        login(email: string, password: string): Chainable<Response<any>>;
        createService(): Chainable<Response<any>>;
        createPost(): Chainable<Response<any>>;
        checkCopyLink(): Chainable<Response<any>>;

        editPost(): Chainable<Response<any>>;
        deletePost(): Chainable<Response<any>>;
        commentPost(): Chainable<Response<any>>;
        replyOnComment(): Chainable<Response<any>>;
        like(): Chainable<Response<any>>;
        turnOffComments(): Chainable<Response<any>>;
        turnOnComments(): Chainable<Response<any>>;
        deleteComment(): Chainable<Response<any>>;
        deleteResponseOnComment(): Chainable<Response<any>>;
        editResponseOnComment(): Chainable<Response<any>>;
        orderService(): Chainable<Response<any>>;
        leaveFeedback(textOfFeedback: string): Chainable<Response<any>>;

        createInbox(): Chainable<Response<any>>;
        waitForLatestEmail(inboxId: string): Chainable<Response<any>>;
        emailCount(inboxId: string): Chainable<Response<any>>;
        deleteAllEmails(): Chainable<Response<any>>;
    }
}
