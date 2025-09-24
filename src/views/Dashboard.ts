export default function Dashboard() {
  return `
  <div class="min-h-screen grid md:grid-cols-[260px_1fr]">
    <aside class="bg-beige-100 border-r p-6">
      <div class="font-bold text-lg mb-6">Мій кабінет</div>
      <nav class="grid gap-2">
        <a class="rounded-xl px-3 py-2 hover:bg-beige-200" href="#/app/overview">Огляд</a>
        <a class="rounded-xl px-3 py-2 hover:bg-beige-200" href="#/app/courses">Курси</a>
        <a class="rounded-xl px-3 py-2 hover:bg-beige-200" href="#/app/my-courses">Мої курси</a>
        <a class="rounded-xl px-3 py-2 hover:bg-beige-200" href="#/app/support">Підтримка</a>
        <a class="rounded-xl px-3 py-2 hover:bg-beige-200" href="#/app/profile">Профіль</a>
        <a class="rounded-xl px-3 py-2 hover:bg-beige-200" href="#/admin">Адмінка</a>
      </nav>
      <button id="logoutBtn" class="btn-outline mt-6 rounded-xl px-4 py-2 w-full">Вийти</button>
    </aside>
    <main class="p-6"><div id="dashContent" class="container-soft grid gap-6"></div></main>
  </div>`;
}
