"use strict";
const $ = (s) => document.querySelector(s);
const el = (t, a = {}, ...k) => {
  const e = document.createElement(t);
  for (const [x, v] of Object.entries(a)) x === "class" ? (e.className = v) : x.startsWith("on") ? e.addEventListener(x.slice(2), v) : e.setAttribute(x, v);
  for (const c of k.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};
const KEY = "lecturaDiaria.v1";
let S = JSON.parse(localStorage.getItem(KEY) || "null") || { plan: null, read: {}, notif: { on: false, time: "07:00", last: "" }, fs: 19 };
const save = () => { localStorage.setItem(KEY, JSON.stringify(S)); syncCfg(); };
let LIBROS = [], tab = "hoy", view = null; // view = {b,c}
const cache = {};
const get = async (u) => cache[u] || (cache[u] = await (await fetch(u)).json());
const hoy = () => new Date().toISOString().slice(0, 10);
const ck = (b, c) => b + "-" + c;
const isRead = (b, c) => !!S.read[ck(b, c)];

// ---------- planes ----------
function buildPlan(tipo, n) {
  const caps = [];
  LIBROS.forEach((l, b) => l.v.forEach((nv, i) => caps.push({ b, c: i + 1, w: nv })));
  const total = caps.reduce((a, x) => a + x.w, 0);
  let dias;
  if (tipo === "custom") {
    dias = [];
    for (let i = 0; i < caps.length; i += n) dias.push(caps.slice(i, i + n));
  } else {
    const D = tipo === "anio" ? 365 : 182;
    dias = Array.from({ length: D }, () => []);
    let acc = 0;
    for (const x of caps) { dias[Math.min(D - 1, Math.floor((acc / total) * D))].push(x); acc += x.w; }
    dias = dias.filter((d) => d.length);
  }
  return dias.map((d) => d.map((x) => [x.b, x.c]));
}
let PLAN_DIAS = null;
function plan() {
  if (!S.plan) return null;
  if (!PLAN_DIAS) PLAN_DIAS = buildPlan(S.plan.tipo, S.plan.n);
  return PLAN_DIAS;
}
function diaActual() {
  const p = plan(); if (!p) return -1;
  const i = p.findIndex((d) => d.some(([b, c]) => !isRead(b, c)));
  return i;
}
function stats() {
  let r = 0, t = 0;
  LIBROS.forEach((l, b) => l.v.forEach((_, i) => { t++; if (isRead(b, i + 1)) r++; }));
  return { r, t };
}

// ---------- vistas ----------
function nav() {
  const n = $("#nav"); n.replaceChildren();
  [["hoy", "📅", "Hoy"], ["leer", "📖", "Leer"], ["mapa", "🗺️", "Mapa"], ["ajustes", "⚙️", "Ajustes"]].forEach(([k, i, t]) =>
    n.append(el("button", { class: tab === k && !view ? "on" : "", onclick: () => { tab = k; view = null; render(); } }, i + " " + t)));
}
async function render() {
  nav();
  const a = $("#app"); a.replaceChildren();
  window.scrollTo(0, 0);
  if (view) return vLector(a);
  ({ hoy: vHoy, leer: vLeer, mapa: vMapa, ajustes: vAjustes })[tab](a);
}
function abrir(b, c) { view = { b, c }; render(); }
const nombre = (b, c) => LIBROS[b].n + " " + c;

function barra(p) { return el("div", { class: "bar" }, el("i", { style: "width:" + p + "%" })); }

function vHoy(a) {
  const { r, t } = stats();
  a.append(el("h1", {}, "Lectura diaria"));
  if (!S.plan) {
    a.append(el("div", { class: "card" }, el("p", {}, "Elegí un plan de lectura para empezar."),
      el("button", { class: "big", onclick: () => { tab = "ajustes"; render(); } }, "Elegir plan")));
  } else {
    const p = plan(), i = diaActual();
    const esp = Math.floor((new Date(hoy()) - new Date(S.plan.inicio)) / 864e5) + 1;
    if (i < 0) a.append(el("div", { class: "card" }, el("h2", {}, "🎉 ¡Plan completado!"), el("p", {}, "Leíste toda la Biblia.")));
    else {
      const d = p[i], dif = esp - (i + 1);
      a.append(el("div", { class: "card" },
        el("div", { class: "row" }, el("b", {}, "Día " + (i + 1) + " de " + p.length),
          el("span", { class: "tag" }, dif > 0 ? dif + " días de atraso" : dif < 0 ? Math.abs(dif) + " de adelanto" : "al día")),
        el("div", { class: "mut" }, d.map(([b, c]) => nombre(b, c)).join(" · "))));
      d.forEach(([b, c]) => a.append(el("div", { class: "cap" + (isRead(b, c) ? " done" : ""), onclick: () => abrir(b, c) },
        el("b", {}, nombre(b, c)), el("span", {}, isRead(b, c) ? "✅" : "›"))));
    }
  }
  a.append(el("div", { class: "card" }, el("b", {}, "Progreso total"), barra(((r / t) * 100).toFixed(1)),
    el("div", { class: "mut" }, r + " de " + t + " capítulos (" + ((r / t) * 100).toFixed(1) + "%)")));
}

function vLeer(a) {
  a.append(el("h1", {}, "Leer"));
  const sb = el("select", {}, LIBROS.map((l, i) => el("option", { value: i }, l.n)));
  const sc = el("select");
  const fill = () => { sc.replaceChildren(...Array.from({ length: LIBROS[sb.value].c }, (_, i) => el("option", { value: i + 1 }, "Capítulo " + (i + 1)))); };
  sb.onchange = fill; fill();
  a.append(el("div", { class: "card" }, el("div", { class: "row" }, sb, sc),
    el("button", { class: "big", onclick: () => abrir(+sb.value, +sc.value) }, "Abrir")));
}

function vMapa(a) {
  const { r, t } = stats();
  a.append(el("h1", {}, "Mapa de progreso"), el("div", { class: "card" }, barra(((r / t) * 100).toFixed(1)),
    el("div", { class: "mut" }, r + " / " + t + " capítulos · " + ((r / t) * 100).toFixed(1) + "%")));
  const sec = (t, desde, hasta) => {
    a.append(el("h2", {}, t));
    for (let b = desde; b < hasta; b++) {
      const l = LIBROS[b], n = l.v.filter((_, i) => isRead(b, i + 1)).length;
      a.append(el("div", { class: "libro" }, el("div", { class: "n" }, l.n + " ", el("span", { class: "mut" }, n + "/" + l.c)),
        el("div", { class: "cells" }, l.v.map((_, i) => el("div", { class: "cell" + (isRead(b, i + 1) ? " r" : ""), onclick: () => abrir(b, i + 1) }, i + 1)))));
    }
  };
  sec("Antiguo Testamento", 0, 39); sec("Nuevo Testamento", 39, 66);
}

async function vLector(a) {
  const { b, c } = view;
  a.append(el("button", { class: "sec", onclick: () => { view = null; render(); } }, "‹ Volver"), el("h1", {}, nombre(b, c)));
  const cargando = el("p", { class: "mut" }, "Cargando…"); a.append(cargando);
  let rv;
  try { rv = (await get("data/b/" + b + ".json"))[c - 1]; } catch (e) { cargando.textContent = "No se pudo cargar el texto (¿sin conexión?)."; return; }
  cargando.remove();
  const tx = el("div"); rv.forEach((v, i) => tx.append(el("p", { class: "v" }, el("sup", {}, i + 1), v))); a.append(tx);
  const zona = el("div"); a.append(zona);
  const mostrarCom = async () => {
    zona.replaceChildren(el("p", { class: "mut" }, "Cargando comentario…"));
    let d; try { d = await get("data/c/" + b + "-" + c + ".json"); } catch (e) { zona.replaceChildren(el("p", {}, "No se pudo cargar el comentario.")); return; }
    zona.replaceChildren();
    zona.append(el("h2", {}, "Comentario de Gill"));
    if (d.intro) zona.append(el("details", {}, el("summary", {}, "Introducción al capítulo"), ...d.intro.split(/\n\s*\n/).map((p) => el("p", { class: "com" }, p))));
    const mapa = Object.fromEntries(d.versos.map((v) => [v.v, v]));
    if (d.claves.length) {
      zona.append(el("div", { class: "card" }, el("b", {}, "Lo esencial"), el("div", { class: "mut" }, "Versículos donde Gill más se detiene:"),
        ...d.claves.map((n) => { const w = mapa[n].p[0].split(/\s+/); return el("p", { class: "com" }, el("b", {}, "v." + n + " "), w.slice(0, 60).join(" ") + (w.length > 60 ? "…" : "")); })));
    }
    zona.append(el("h2", {}, "Comentario completo, por versículo"));
    d.versos.forEach((v) => zona.append(el("details", d.claves.includes(v.v) ? { open: "" } : {}, el("summary", {}, "Versículo " + v.v), ...v.p.map((p) => el("p", { class: "com" }, p)))));
    sig(zona);
  };
  const sig = (z) => {
    const n = c < LIBROS[b].c ? [b, c + 1] : b < 65 ? [b + 1, 1] : null;
    if (n) z.append(el("button", { class: "big", onclick: () => abrir(n[0], n[1]) }, "Siguiente: " + nombre(n[0], n[1]) + " ›"));
  };
  const btn = el("button", { class: "big", onclick: async () => { S.read[ck(b, c)] = hoy(); save(); btn.remove(); await mostrarCom(); } }, "✅ Terminé de leer · ver comentario");
  if (isRead(b, c)) { a.append(el("div", { class: "mut" }, "✅ Leído")); mostrarCom(); }
  else { a.append(btn, el("button", { class: "big sec", onclick: () => { btn.remove(); mostrarCom(); } }, "Ver comentario sin marcar")); }
}

function vAjustes(a) {
  a.append(el("h1", {}, "Ajustes"));
  const tipo = el("select", {}, [["anio", "Biblia en 1 año"], ["seis", "Biblia en 6 meses"], ["custom", "Capítulos por día"]].map(([v, t]) => el("option", { value: v, ...(S.plan && S.plan.tipo === v ? { selected: "" } : {}) }, t)));
  const n = el("input", { type: "number", min: 1, max: 40, value: (S.plan && S.plan.n) || 5, style: "width:70px" });
  const ini = el("input", { type: "date", value: (S.plan && S.plan.inicio) || hoy() });
  a.append(el("div", { class: "card" }, el("b", {}, "Plan de lectura"),
    el("div", { class: "row", style: "margin:8px 0" }, tipo, el("span", { class: "mut" }, "cap/día:"), n),
    el("div", { class: "row" }, el("span", { class: "mut" }, "Empieza:"), ini),
    el("button", { class: "big", onclick: () => { S.plan = { tipo: tipo.value, n: +n.value || 5, inicio: ini.value }; PLAN_DIAS = null; save(); tab = "hoy"; render(); } }, "Guardar plan"),
    el("p", { class: "mut" }, "El progreso no se pierde al cambiar de plan.")));
  const hh = el("input", { type: "time", value: S.notif.time });
  a.append(el("div", { class: "card" }, el("b", {}, "Recordatorio diario"),
    el("div", { class: "row", style: "margin:8px 0" }, hh,
      el("button", { onclick: async () => { const p = await Notification.requestPermission(); if (p !== "granted") return alert("Hace falta permitir las notificaciones."); S.notif = { ...S.notif, on: true, time: hh.value }; save(); registrarPeriodico(); alert("Recordatorio activado a las " + hh.value); } }, "Activar"),
      el("button", { class: "sec", onclick: () => { S.notif.on = false; save(); alert("Recordatorio desactivado"); } }, "Desactivar")),
    el("p", { class: "mut" }, "En Android, instalá la app (menú ⋮ de Chrome → Instalar app) para que el aviso llegue con la app cerrada.")));
  const fs = el("input", { type: "range", min: 15, max: 28, value: S.fs, oninput: () => { S.fs = +fs.value; document.documentElement.style.setProperty("--fs", S.fs + "px"); save(); } });
  a.append(el("div", { class: "card" }, el("b", {}, "Tamaño de letra"), el("div", {}, fs)));
  a.append(el("div", { class: "card" }, el("b", {}, "Copia de seguridad"),
    el("div", { class: "row", style: "margin-top:8px" },
      el("button", { class: "sec", onclick: () => { const u = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); el("a", { href: u, download: "lectura-progreso.json" }).click(); } }, "Exportar"),
      el("button", { class: "sec", onclick: () => { const i = el("input", { type: "file", accept: ".json" }); i.onchange = async () => { S = JSON.parse(await i.files[0].text()); PLAN_DIAS = null; save(); render(); }; i.click(); } }, "Importar"))));
}

// ---------- notificaciones ----------
function syncCfg() {
  if (!("caches" in window)) return;
  caches.open("cfg").then((c) => c.put("cfg", new Response(JSON.stringify({ ...S.notif, pendiente: diaActual() >= 0 }))));
}
async function registrarPeriodico() {
  try { const r = await navigator.serviceWorker.ready; if (r.periodicSync) await r.periodicSync.register("recordatorio", { minInterval: 6 * 3600e3 }); } catch (e) {}
}
async function chequearRecordatorio() {
  if (!S.notif.on || Notification.permission !== "granted") return;
  const ahora = new Date(), [h, m] = S.notif.time.split(":");
  const hora = new Date(); hora.setHours(+h, +m, 0, 0);
  if (ahora >= hora && S.notif.last !== hoy() && diaActual() >= 0) {
    S.notif.last = hoy(); save();
    const r = await navigator.serviceWorker.ready;
    r.showNotification("📖 Tu lectura de hoy", { body: "Es hora de leer. ¡Un capítulo a la vez!", icon: "icon.svg", tag: "diario" });
  }
}

// ---------- inicio ----------
(async () => {
  document.documentElement.style.setProperty("--fs", S.fs + "px");
  LIBROS = await get("data/libros.json");
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  render(); syncCfg();
  chequearRecordatorio(); setInterval(chequearRecordatorio, 60000);
})();
