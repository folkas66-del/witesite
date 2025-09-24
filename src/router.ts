export type View = () => string | Promise<string>;
type Route = { path: string; view: View; protected?: boolean; adminOnly?: boolean };

export class Router {
  private routes: Route[] = [];
  private outlet: HTMLElement;

  // реєстр саб-в’юшок для /app/*
  private appSubRoutes: Record<string, View> = {};

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;
    window.addEventListener("hashchange", () => this.navigate());
  }

  register(route: Route) { this.routes.push(route); }

  // реєструємо підсторінки для кабінету
  registerAppSub(path: string, view: View) {
    // path типу "/app/overview", "/app/courses" і т.д.
    this.appSubRoutes[path] = view;
  }

  async navigate() {
    const raw = location.hash.replace("#", "") || "/";
    const authed = !!localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    // /app/*
    if (raw.startsWith("/app/")) {
      if (!authed) { location.hash = "/login"; return; }
      const shell = this.routes.find(r => r.path === "/app");
      if (!shell) return;
      const html = await shell.view();
      this.outlet.innerHTML = html;

      // підвантажуємо контент підсторінки
      const sub = this.appSubRoutes[raw];
      const target = document.getElementById("dashContent");
      if (sub && target) target.innerHTML = await sub();

      document.dispatchEvent(new CustomEvent("view:mounted", { detail: raw }));
      return;
    }

    // звичайні маршрути
    const route = this.routes.find(r => r.path === raw) ?? this.routes.find(r => r.path === "404");
    if (!route) return;

    if (route.protected && !authed) { location.hash = "/login"; return; }
    if (route.adminOnly && role !== "admin") { location.hash = "/"; return; }

    const html = await route.view();
    this.outlet.innerHTML = html;
    document.dispatchEvent(new CustomEvent("view:mounted", { detail: raw }));
  }
}
