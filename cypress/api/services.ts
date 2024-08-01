import Auth from './services/auth';
import Posts from './services/posts';

const authService = new Auth();
const postsService = new Posts();

export { authService, postsService };
