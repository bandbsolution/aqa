const PostActions = {
    EDIT: 'Редагувати',
    COPY_LINK: 'Скопіювати посилання на пост',
    DISABLE_COMMENTS: 'Вимкнути коментарі',
    ENABLE_COMMENTS: 'Увімкнути коментарі',
    DELETE: 'Видалити пост',
};

const ProfileActions = {
    MY_PROFILE: 'Мій профіль',
    SUPPORT: 'Підтримка',
    SETTINGS: 'Налаштування',
    SAVED: 'Збережені',
    LOGOUT: 'Вийти',
};

const Switcher = {
    SERVICES: 'Послуги',
    POSTS: 'Пости',
    PEOPLE: 'Люди',
};

const Statuses = {
    NEW: 'Нове',
    IN_PROGRESS: 'В обробці',
    SENT: 'Відправлено',
    DELIVERED: 'Отримано',
    CANCELED: 'Скасовано',
};

const CommentActions = {
    Edit: 'Редагувати',
    Delete: 'Видалити коментар',
    DeleteReply: 'Видалити відповідь',
};

const SettingsMenu = {
    SettingsAccount: 'Налаштування акаунту',

    Notifications: 'Управління сповіщеннями',

    Security: 'Безпека',

    BlockedUsers: 'Заблоковані користувачі',
};

const SettingsMenuBlocks = {
    Privacy: 'Приватність',
    Marketing: 'Маркетинг',
    Sub: 'Підписки',
    DeleteAccount: 'Повне видалення акаунту',

    AccountNotifications: 'Сповіщення аккаунту',
    EmailSubscription: 'Розсилка на пошту',

    TwoFactorAuth: 'Двофакторна аутентифікація',
    ChangePassword: 'Зміна пароля',
    ChangeEmail: 'Зміна пошти',

    BlockedUsers: 'Заблоковані користувачі',
};

export { PostActions, ProfileActions, Switcher, CommentActions, SettingsMenu, SettingsMenuBlocks, Statuses };
