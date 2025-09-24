export default function Admin() {
  const purchases = JSON.parse(localStorage.getItem("purchases") || "[]") as Array<{id:string; status:string}>;
  const rows = purchases.map((p, i) => `
    <tr class="border-b last:border-0">
      <td class="py-2">${p.id}</td>
      <td class="py-2">${p.status}</td>
      <td class="py-2"><button class="btn-outline rounded-xl px-3 py-1" data-approve="${i}">Підтвердити</button></td>
    </tr>
  `).join("");

  return `
  <div class="container-soft py-8">
    <h1 class="text-2xl font-bold mb-4">Адмін-панель (мок)</h1>
    <div class="card overflow-auto">
      <table class="w-full text-sm">
        <thead><tr class="text-left"><th class="py-2">Курс</th><th class="py-2">Статус</th><th class="py-2">Дія</th></tr></thead>
        <tbody>${rows || `<tr><td class="py-3 muted" colspan="3">Немає платежів</td></tr>`}</tbody>
      </table>
    </div>
  </div>`;
}
