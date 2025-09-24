// src/auth.ts
export const Auth = {
  login: async (_email: string, _password: string) => {
    // TODO: замінити викликом бекенду
    const fakeToken = crypto.randomUUID();
    localStorage.setItem("auth_token", fakeToken);  // <-- потрібно
    localStorage.setItem("role", "user");
    return true;
  },

  register: async (_data: Record<string, FormDataEntryValue>) => {
    // TODO: бекенд + генерація унікального ID на сервері
    const id = "U-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem("pending_user_id", id);
    return id;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
  },
};
