/* 
    Pages:
        - Home
        - Upload
        - Album
        - Auto-login

    Components:
        - Router
        - Nav
        - ThemeSwitcher
        - Inscription /Login / Logout
        - HomePicture => img for homepage
        - CustomPicture => img
        - PictureContainer
        - Filters for pictures
        - Carousel =>  starting from clicked picture
        - Single file upload
        - Multiple file upload
        - AuthContext
        - Toasts:
            - Error
            - Success
        - ErrorBoundary (404)


    Hooks:
        - useAuth (userData, token, login, logout, autoLogin)

    Données utilisateur stockées dans le authcontexte et donc récupérables pour rendu conditionnel (validé ou non)
    Utilisation de react-query pour la gestion des données et invalidation de celles ci lors de nouveaux upload
*/