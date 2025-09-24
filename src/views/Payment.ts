export default function Payment() {
  const courseId = localStorage.getItem("selected_course") ?? "невідомий курс";

  return `
    <div class="container py-8 grid gap-6 max-w-2xl">
      <h1 class="text-3xl font-bold">Оплата курсу</h1>
      <div class="card">
        <h2 class="font-semibold text-lg mb-2">Ви обрали: <span class="opacity-80">${courseId}</span></h2>
        <p class="opacity-80">Сплатіть за реквізитами та завантажте чек — адміністратор підтвердить доступ.</p>
        <div class="mt-4">
          <div class="font-semibold">Реквізити:</div>
          <ul class="list-disc ml-6 mt-2">
            <li>Картка/ФОП: <b>UA1234 5678 9012 3456</b></li>
            <li>Призначення: <b>Оплата курсу ${courseId}</b></li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h3 class="font-semibold text-lg mb-3">Завантаження чека</h3>
        <form id="receiptForm" class="grid gap-3">
          <input id="receiptFile" type="file" accept="image/*,.pdf" class="border rounded-xl px-4 py-3" required />
          <button class="btn" type="submit">Надіслати чек</button>
        </form>
        <div id="status" class="mt-3 text-sm"></div>
      </div>
    </div>
  `;
}
