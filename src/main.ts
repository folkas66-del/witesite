import "./styles.css";
import { Router } from "./router";

import Landing from "./views/Landing";
import Login from "./views/Login";
import Register from "./views/Register";

import Dashboard from "./views/Dashboard";
import Overview from "./views/Overview";
import Courses from "./views/Courses";
import MyCourses from "./views/MyCourses";
import Profile from "./views/Profile";
import Support from "./views/Support";
import Payment from "./views/Payment";
import Admin from "./views/Admin";

import { Auth } from "./auth";

// Публічні сторінки (уважно до РЕГІСТРУ!)
import ZnoNmt from "./views/ZnoNmt";
import VideoCourses from "./views/VideoCourses";
import Lifehacks from "./views/Lifehacks";
import Tests from "./views/Tests";
import AboutCourse from "./views/AboutCourse";
import UsefulLinks from "./views/UsefulLinks";
import AboutMe from "./views/AboutMe";

import { mountFooter } from "./footer";
import Privacy from "./views/Privacy";
import Terms from "./views/Terms";

window.addEventListener("error", (e) => console.error("[window.error]", e.error || e.message));

const app = document.getElementById("app")!;
const router = new Router(app);

// --- public ---
router.register({ path: "/", view: Landing });
router.register({ path: "/login", view: Login });
router.register({ path: "/register", view: Register });

router.register({ path: "/zno-nmt",       view: ZnoNmt });
router.register({ path: "/video-courses", view: VideoCourses });
router.register({ path: "/lifehacks",     view: Lifehacks });
router.register({ path: "/tests",         view: Tests });
router.register({ path: "/about-course",  view: AboutCourse });
router.register({ path: "/links",         view: UsefulLinks });
router.register({ path: "/about-me",      view: AboutMe });

router.register({ path: "/privacy", view: Privacy });
router.register({ path: "/terms",   view: Terms });

// --- app ---
router.register({ path: "/app",            view: Dashboard,  protected: true });
router.register({ path: "/app/overview",   view: Overview,   protected: true });
router.register({ path: "/app/courses",    view: Courses,    protected: true });
router.register({ path: "/app/my-courses", view: MyCourses,  protected: true });
router.register({ path: "/app/profile",    view: Profile,    protected: true });
router.register({ path: "/app/support",    view: Support,    protected: true });
router.register({ path: "/app/pay",        view: Payment,    protected: true });

// --- admin ---
router.register({ path: "/admin", view: Admin, adminOnly: true });

// 404
router.register({ path: "404", view: () => `<div class="container-soft py-10">404</div>` });

// 1 раз рендеримо і одразу монтуємо нижній бар
router.navigate();
mountFooter();

// --- events ---
document.addEventListener("view:mounted", (e: Event) => {
  const detail = (e as CustomEvent<string>).detail;

  // Burger (на публічних сторінках, де є header)
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    const setOpen = (flag: boolean) => {
      burger.classList.toggle("burger-open", flag);
      mobileMenu.setAttribute("data-open", flag ? "true" : "false");
    };
    setOpen(false);
    (burger as HTMLButtonElement).onclick = () => setOpen(!burger.classList.contains("burger-open"));
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
  }

  // LOGIN
  if (detail === "/login") {
    const form = document.getElementById("loginForm") as HTMLFormElement | null;
    form?.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      await Auth.login(String(fd.get("email")), String(fd.get("password")));
      location.hash = "/app/overview";
    });
  }

  // REGISTER
  if (detail === "/register") {
    const form = document.getElementById("regForm") as HTMLFormElement | null;
    form?.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const id = await Auth.register(Object.fromEntries(fd.entries()));
      alert(`Ваш тимчасовий ID: ${id}. Після оплати доступ підтвердить адміністратор.`);
      location.hash = "/login";
    });
  }

  // LOGOUT (shell)
  if (detail === "/app") {
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      Auth.logout();
      location.hash = "/login";
    });
  }

  // COURSES
  if (detail === "/app/courses") {
    document.querySelectorAll<HTMLButtonElement>("[data-buy]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-buy")!;
        const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
        if (!purchases.find((p: any) => p.id === id)) {
          purchases.push({ id, status: "pending" });
          localStorage.setItem("purchases", JSON.stringify(purchases));
        }
        localStorage.setItem("selected_course", id);
        location.hash = "/app/pay";
      });
    });
  }

  // PAYMENT
  if (detail === "/app/pay") {
    const form = document.getElementById("receiptForm") as HTMLFormElement | null;
    const status = document.getElementById("status")!;
    form?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      status.textContent = "Чек завантажено. Статус: очікує підтвердження адміністратором.";
      alert("Дякуємо! Очікуйте підтвердження.");
      location.hash = "/app/overview";
    });
  }

  // PROFILE
  if (detail === "/app/profile") {
    const form = document.getElementById("profileForm") as HTMLFormElement | null;
    form?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(form!);
      localStorage.setItem("profile", JSON.stringify(Object.fromEntries(fd.entries())));
      alert("Профіль збережено.");
    });
  }

  // SUPPORT
  if (detail === "/app/support") {
    const form = document.getElementById("chatForm") as HTMLFormElement | null;
    const input = document.getElementById("chatInput") as HTMLInputElement | null;
    const box = document.getElementById("chat")!;
    form?.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const text = (input?.value || "").trim();
      if (!text) return;
      const msgs = JSON.parse(localStorage.getItem("support_msgs") || "[]");
      msgs.push({ from:"user", text, ts: Date.now() });
      localStorage.setItem("support_msgs", JSON.stringify(msgs));
      box.insertAdjacentHTML("beforeend",
        `<div class="flex justify-end"><div class="rounded-2xl px-4 py-2 bg-brown-700 text-white max-w-[80%]"><div class="text-sm">${text}</div></div></div>`
      );
      input!.value = "";
      box.scrollTop = box.scrollHeight;
    });
  }

  // ADMIN
  if (detail === "/admin") {
    document.querySelectorAll<HTMLButtonElement>("[data-approve]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-approve"));
        const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
        if (purchases[idx]) {
          purchases[idx].status = "approved";
          localStorage.setItem("purchases", JSON.stringify(purchases));
          alert("Підтверджено ✅");
          location.reload();
        }
      });
    });
  }

  // Active link у кабінеті
  document.querySelectorAll('aside a[href^="#/app"], aside a[href="#/admin"]').forEach(a => {
    const el = a as HTMLAnchorElement;
    if (location.hash.startsWith(el.getAttribute("href")!)) el.classList.add("bg-beige-200");
    else el.classList.remove("bg-beige-200");
  });

  // скрол-анімації (reveal/reveal-up)
  document.querySelectorAll<HTMLElement>(".reveal, .reveal-up").forEach(el => io.observe(el));
});

// один спостерігач на все SPA
const io = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) (e.target as HTMLElement).classList.add("is-visible");
  }),
  { threshold: 0.15 }
);
