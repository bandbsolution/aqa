import AuthModals from '../../support/modals/AuthModals';

const authModals = new AuthModals();

describe('search page', () => {

    it('open search page', () => {
            authModals.visit();
            authModals.openSearchPage();
        });
    });
