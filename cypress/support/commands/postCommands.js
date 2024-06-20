import { faker } from '@faker-js/faker';
import MyProfile from "../pages/MyProfile";
import PostModal from "../modals/PostModal";

const postModal = new PostModal;
const myProfile = new MyProfile;

Cypress.Commands.add('createPost', () => {
    const randomPostText = faker.lorem.paragraph({min: 3, max: 10});

    myProfile.clickOnCreateServiceOrPostIf0();
    postModal.typeTextPost(randomPostText);
    postModal.clickOnCreatePostBtn();
    postModal.assertNotification('Пост успішно створено');
});