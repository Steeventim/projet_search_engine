export const authService = {
  /**
   * Fonction pour se connecter
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise}
   */
  login(email, password) {
    // Simule un appel à une API pour vérifier les informations de connexion
    return new Promise((resolve, reject) => {
      // Vous pouvez remplacer cette logique par un véritable appel à une API backend
      if (email === "test@example.com" && password === "password") {
        // Simuler une réponse d'API
        const user = {
          email: email,
          token: "fake-jwt-token", // Un jeton JWT ou autre donné par votre API
        };
        localStorage.setItem("user", JSON.stringify(user)); // Stocker les informations utilisateur
        resolve(user);
      } else {
        reject("Email ou mot de passe incorrect.");
      }
    });
  },

  /**
   * Fonction pour s'inscrire (vous pouvez ajuster cela pour inclure d'autres champs)
   * @param {string} firstName - Prénom de l'utilisateur
   * @param {string} lastName - Nom de l'utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise}
   */
  register(firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
      // Simule un appel d'inscription à une API
      if (email && password) {
        const user = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          token: "fake-jwt-token",
        };
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      } else {
        reject("Veuillez remplir tous les champs.");
      }
    });
  },

  /**
   * Fonction pour se déconnecter
   */
  logout() {
    // Supprimer l'utilisateur du localStorage pour déconnecter
    localStorage.removeItem("user");
  },

  /**
   * Fonction pour obtenir les informations de l'utilisateur connecté
   * @returns {Object|null} - Retourne les informations utilisateur si elles existent
   */
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  },

  /**
   * Fonction pour vérifier si l'utilisateur est connecté
   * @returns {boolean} - Retourne true si l'utilisateur est connecté, sinon false
   */
  isAuthenticated() {
    return !!localStorage.getItem("user"); // Si un utilisateur est présent dans localStorage
  },
};
