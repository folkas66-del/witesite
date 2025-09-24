
export type View = () => string | Promise<string>;
type Route = { path: string; view: View; protected?: boolean; adminOnly?: boolean };

export class Router {
  private routes: Route[] = [];
  private outlet: HTMLElement;
  private appSubRoutes: Record<string, View> = {};

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;

    window.addEventListener("load", () => this.navigate());

    window.addEventListener("hashchange", () => this.navigate());

    document.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#/")) {
        e.preventDefault();
        this.go(href.substring(1)); 
      } else if (href.startsWith("/")) {
        e.preventDefault();
        this.go(href);
      }
    });
  }


  register(route: Route) { this.routes.push(route); }


  registerAppSub(path: string, view: View) {
  
    const key = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
    this.appSubRoutes[key] = view;
  }

  go(path: string) {
   
    const norm = path.startsWith("/") ? path : `/${path}`;
    if (location.hash !== `#${norm}`) {
      location.hash = norm;
    } else {
   
      this.navigate();
    }
  }

  private currentPath(): string {
    const raw = (location.hash || "").replace(/^#/, "");

    return raw === "" ? "/" : raw;
  }


  async navigate() {
    const raw = this.currentPath();
    const authed = !!localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");


    if (raw === "/app" || raw.startsWith("/app/")) {
      if (!authed) { this.go("/login"); return; }

      const shell = this.routes.find(r => r.path === "/app");
      if (!shell) return;

      
      const shellHtml = await shell.view();
      this.outlet.innerHTML = shellHtml;

      const key = raw.endsWith("/") && raw !== "/" ? raw.slice(0, -1) : raw;
      const sub = this.appSubRoutes[key];

      const target = document.getElementById("dashContent");
      if (sub && target) {
        target.innerHTML = await sub();
      }

      document.dispatchEvent(new CustomEvent("view:mounted", { detail: raw }));
      return;
    }

    
    const route =
      this.routes.find(r => r.path === raw) ??
      this.routes.find(r => r.path === "/404"); 

    if (!route) return;

    
    if (route.protected && !authed) { this.go("/login"); return; }
    if (route.adminOnly && role !== "admin") { this.go("/"); return; }

    
    const html = await route.view();
    this.outlet.innerHTML = html;

    document.dispatchEvent(new CustomEvent("view:mounted", { detail: raw }));
  }
}
