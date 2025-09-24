// src/router.ts
export type View = () => string | Promise<string>;
type Route = { path: string; view: View; protected?: boolean; adminOnly?: boolean };

export class Router {
  private routes: Route[] = [];
  private outlet: HTMLElement;
  private appSubRoutes: Record<string, View> = {};

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;

    // 1) Рендеримось на перше завантаження
    window.addEventListener("load", () => this.navigate());

    // 2) Рендеримось на зміну хеша
    window.addEventListener("hashchange", () => this.navigate());

    // 3) Делегуємо кліки на <a> всередині SPA (href="#/.." або href="/..")
    document.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      // Підтримка посилань виду "#/login" або "/login"
      if (href.startsWith("#/")) {
        e.preventDefault();
        this.go(href.substring(1)); // відкидаємо #
      } else if (href.startsWith("/")) {
        e.preventDefault();
        this.go(href);
      }
    });
  }

  /** Зареєструвати звичайний маршрут */
  register(route: Route) { this.routes.push(route); }

  /** Зареєструвати підмаршрут для /app/... */
  registerAppSub(path: string, view: View) {
    // нормалізуємо без зайвого слеша в кінці
    const key = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
    this.appSubRoutes[key] = view;
  }

  /** Навігація програмно */
  go(path: string) {
    // нормалізуємо шлях щоб завжди був з початковим слешем
    const norm = path.startsWith("/") ? path : `/${path}`;
    if (location.hash !== `#${norm}`) {
      location.hash = norm;
    } else {
      // якщо той самий маршрут – все одно перемалюємо
      this.navigate();
    }
  }

  /** Поточний шлях із хеша */
  private currentPath(): string {
    const raw = (location.hash || "").replace(/^#/, "");
    // порожній -> "/"
    return raw === "" ? "/" : raw;
  }

  /** Основна логіка маршрутизації */
  async navigate() {
    const raw = this.currentPath();
    const authed = !!localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    // 1) /app/*
    if (raw === "/app" || raw.startsWith("/app/")) {
      if (!authed) { this.go("/login"); return; }

      // шукаємо "оболонку" для /app
      const shell = this.routes.find(r => r.path === "/app");
      if (!shell) return;

      // рендеримо оболонку
      const shellHtml = await shell.view();
      this.outlet.innerHTML = shellHtml;

      // визначаємо підмаршрут (повний збіг або без фінального слеша)
      const key = raw.endsWith("/") && raw !== "/" ? raw.slice(0, -1) : raw;
      const sub = this.appSubRoutes[key];

      const target = document.getElementById("dashContent");
      if (sub && target) {
        target.innerHTML = await sub();
      }

      document.dispatchEvent(new CustomEvent("view:mounted", { detail: raw }));
      return;
    }

    // 2) Звичайні маршрути
    const route =
      this.routes.find(r => r.path === raw) ??
      this.routes.find(r => r.path === "/404"); // <-- виправлено

    if (!route) return;

    // гейткипінг доступу
    if (route.protected && !authed) { this.go("/login"); return; }
    if (route.adminOnly && role !== "admin") { this.go("/"); return; }

    // рендеримо
    const html = await route.view();
    this.outlet.innerHTML = html;

    document.dispatchEvent(new CustomEvent("view:mounted", { detail: raw }));
  }
}
