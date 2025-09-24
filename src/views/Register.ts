export default function Register() {
  return `
  <div class="container py-12 max-w-xl">
    <div class="card">
      <h1 class="text-2xl font-bold mb-6">Реєстрація</h1>
      <form id="regForm" class="grid md:grid-cols-2 gap-4">
        <input class="border rounded-xl px-4 py-3" name="lastName" placeholder="Прізвище" required />
        <input class="border rounded-xl px-4 py-3" name="firstName" placeholder="Ім'я" required />
        <input class="border rounded-xl px-4 py-3" name="middleName" placeholder="По батькові" />
        <input class="border rounded-xl px-4 py-3" name="phone" placeholder="Телефон" />
        <input class="border rounded-xl px-4 py-3" type="email" name="email" placeholder="Email" required />
        <input class="border rounded-xl px-4 py-3" type="date" name="dob" placeholder="Дата народження" />
        <input class="border rounded-xl px-4 py-3 md:col-span-2" type="password" name="password" placeholder="Пароль" required />
        <button class="btn md:col-span-2" type="submit">Зареєструватися</button>
      </form>
    </div>
  </div>
  `;
}
