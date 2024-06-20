declare namespace Cypress {
    interface Chainable {
        selectDropdownOption(dropDownName: string, optionText: string): Chainable<Response<any>>;
        uploadAndSavePhoto(fileName: any) : Chainable<Response<any>>;
        createUser(id: string) : Chainable<Response<any>>;
        activateAccount(email: string) : Chainable<Response<any>>;
        deleteAccount(password: string) : Chainable<Response<any>>;
        login(email: string, password: string) : Chainable<Response<any>>;
        createService() : Chainable<Response<any>>;
        createPost() : Chainable<Response<any>>;
    }
}
