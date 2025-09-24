export default function Login() {
  return `
  <div class="container py-12 max-w-md">
    <div class="card">
      <h1 class="text-2xl font-bold mb-6">Вхід</h1>
      <form id="loginForm" class="grid gap-4">
        <input class="border rounded-xl px-4 py-3" type="email" name="email" placeholder="Email" required />
        <input class="border rounded-xl px-4 py-3" type="password" name="password" placeholder="Пароль" required />
        <button class="btn" type="submit">Увійти</button>
        <a class="text-sm" href="#/register">Ще немає акаунта?</a>
      </form>
    </div>
  </div>
  `;
}
