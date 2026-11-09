"use strict";
const $ = (s) => document.querySelector(s);
const el = (t, a = {}, ...k) => {
  const e = document.createElement(t);
  for (const [x, v] of Object.entries(a)) x === "class" ? (e.className = v) : x.startsWith("on") ? e.addEventListener(x.slice(2), v) : e.setAttribute(x, v);
  for (const c of k.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};

// ---------- iconos (estilo Lucide, SVG en línea) ----------
const IC = {
  hoy: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  leer: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  mapa: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  ajustes: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
  abajo: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  der: '<path d="m9 18 6-6-6-6"/>',
  izq: '<path d="m15 18-6-6 6-6"/>',
  atras: '<path d="m12 19-7-7 7-7M19 12H5"/>',
  campana: '<path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M3.3 15.3A1 1 0 0 0 4 17h16a1 1 0 0 0 .7-1.7C19.4 14 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.4 6-2.7 7.3"/>',
  bajar: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  subir: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  rollo: '<path d="M15 12h-5M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
  luz: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
  fuego: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  trofeo: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1.1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1.1 1.2 1.1.6 1.9 2 1.9 3.8M18 2H6v7a6 6 0 0 0 12 0z"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41m11.32-11.32 1.41-1.41M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41"/>',
  luna: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  pantalla: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  paleta: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>',
  calendario: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  texto: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
};
const ico = (n, c = "") => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "ico " + c); s.setAttribute("aria-hidden", "true"); s.innerHTML = IC[n]; return s; };

const KEY = "lecturaDiaria.v1";
let S = JSON.parse(localStorage.getItem(KEY) || "null") || { plan: null, read: {}, notif: { on: false, time: "07:00", last: "" }, fs: 19 };
const save = () => { localStorage.setItem(KEY, JSON.stringify(S)); syncCfg(); };
let LIBROS = [], tab = "hoy", view = null;
const cache = {};
const get = async (u) => cache[u] || (cache[u] = await (await fetch(u)).json());
const hoy = () => new Date().toISOString().slice(0, 10);
const ck = (b, c) => b + "-" + c;
const isRead = (b, c) => !!S.read[ck(b, c)];
const nombre = (b, c) => LIBROS[b].n + " " + c;

// ---------- planes ----------
function buildPlan(tipo, n) {
  const caps = [];
  LIBROS.forEach((l, b) => l.v.forEach((nv, i) => caps.push({ b, c: i + 1, w: nv })));
  const total = caps.reduce((a, x) => a + x.w, 0);
  let dias;
  if (tipo === "custom") { dias = []; for (let i = 0; i < caps.length; i += n) dias.push(caps.slice(i, i + n)); }
  else {
    const D = tipo === "anio" ? 365 : 182;
    dias = Array.from({ length: D }, () => []);
    let acc = 0;
    for (const x of caps) { dias[Math.min(D - 1, Math.floor((acc / total) * D))].push(x); acc += x.w; }
    dias = dias.filter((d) => d.length);
  }
  return dias.map((d) => d.map((x) => [x.b, x.c]));
}
let PLAN_DIAS = null;
const plan = () => { if (!S.plan) return null; if (!PLAN_DIAS) PLAN_DIAS = buildPlan(S.plan.tipo, S.plan.n); return PLAN_DIAS; };
const diaActual = () => { const p = plan(); return p ? p.findIndex((d) => d.some(([b, c]) => !isRead(b, c))) : -1; };
function stats() { let r = 0, t = 0; LIBROS.forEach((l, b) => l.v.forEach((_, i) => { t++; if (isRead(b, i + 1)) r++; })); return { r, t }; }
function racha() {
  const dias = new Set(Object.values(S.read)); let n = 0; const d = new Date();
  if (!dias.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (dias.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---------- estructura ----------
function nav() {
  const n = $("#nav"); n.replaceChildren();
  [["hoy", "Hoy"], ["leer", "Leer"], ["mapa", "Mapa"], ["ajustes", "Ajustes"]].forEach(([k, t]) =>
    n.append(el("button", { class: (k === "leer" ? (tab === "leer" && (view || elegir)) || (view && tab === "leer") : tab === k && !view) ? "on" : "", "aria-label": t, onclick: () => { tab = k; if (k === "leer") return continuar(); view = null; elegir = false; render(); } }, ico(k), t)));
}
async function render() {
  nav(); const a = $("#app"); a.replaceChildren(); window.scrollTo(0, 0);
  if (view) return vLector(a);
  ({ hoy: vHoy, leer: vLeer, mapa: vMapa, ajustes: vAjustes })[tab](a);
}
let elegir = false;
const abrir = (b, c) => { tab = "leer"; elegir = false; S.pos = { b, c, y: 0 }; save(); view = { b, c, modo: "esencial" }; render(); };
const continuar = () => { const p = S.pos || { b: 0, c: 1, y: 0 }; elegir = false; view = { b: p.b, c: p.c, modo: "esencial", y: p.y || 0 }; render(); };
const barra = (p) => el("div", { class: "bar" }, el("i", { style: "width:" + p + "%" }));

function anillo(pct) {
  const r = 40, C = 2 * Math.PI * r;
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 100 100");
  s.innerHTML = '<circle class="bg" cx="50" cy="50" r="' + r + '"/><circle class="fg" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - pct / 100)) + '"/>';
  return el("div", { class: "ring", role: "img", "aria-label": pct.toFixed(0) + " por ciento leído" }, s, el("b", {}, pct.toFixed(0) + "%"));
}

function filaCap(b, c) {
  const d = isRead(b, c);
  return el("button", { class: "cap" + (d ? " done" : ""), onclick: () => abrir(b, c) },
    el("span", { class: "st" }, d ? ico("check", "sm") : ico("leer", "sm")),
    el("span", { class: "t" }, nombre(b, c), el("small", {}, d ? "Leído" : "Por leer")), ico("der", "sm"));
}

function vHoy(a) {
  const { r, t } = stats(), pct = (r / t) * 100, rc = racha();
  a.append(el("h1", {}, "Lectura diaria"), el("p", { class: "sub" }, "Reina Valera 1909 y comentario de John Gill"));
  a.append(el("div", { class: "card hero" }, anillo(pct), el("div", {},
    el("h2", {}, r + " de " + t), el("p", {}, "capítulos leídos"),
    el("div", { style: "margin-top:8px" }, el("span", { class: "chip" }, ico("fuego", "sm"), rc + (rc === 1 ? " día seguido" : " días seguidos"))))));
  if (!S.plan) {
    a.append(el("div", { class: "card" }, el("h3", {}, "Elegí tu plan"), el("p", { class: "mut" }, "Biblia en 1 año, en 6 meses, o los capítulos que quieras por día."),
      el("button", { class: "big", onclick: () => { tab = "ajustes"; render(); } }, "Elegir plan")));
    return;
  }
  const p = plan(), i = diaActual();
  if (i < 0) { a.append(el("div", { class: "card" }, el("div", { class: "row" }, ico("trofeo", "lg"), el("h2", { style: "margin:0" }, "Plan completado")), el("p", { class: "mut" }, "Leíste toda la Biblia."))); return; }
  const esp = Math.floor((new Date(hoy()) - new Date(S.plan.inicio)) / 864e5) + 1, dif = esp - (i + 1), d = p[i];
  a.append(el("h2", {}, "Lectura de hoy"));
  a.append(el("div", { class: "row sp" }, el("span", { class: "mut" }, "Día " + (i + 1) + " de " + p.length),
    el("span", { class: "chip " + (dif > 0 ? "d" : "ok") }, dif > 0 ? dif + (dif === 1 ? " día" : " días") + " de atraso" : dif < 0 ? Math.abs(dif) + " de adelanto" : "Vas al día")));
  d.forEach(([b, c]) => a.append(filaCap(b, c)));
}

function segTestamento(valor, alCambiar, conTodo) {
  const op = [["at", "Antiguo"], ["nt", "Nuevo"]]; if (conTodo) op.unshift(["todo", "Todo"]);
  const seg = el("div", { class: "seg", style: "grid-template-columns:repeat(" + op.length + ",1fr)", role: "group", "aria-label": "Testamento" });
  op.forEach(([k, t]) => seg.append(el("button", { class: valor === k ? "on" : "", "aria-pressed": valor === k, style: "min-height:46px", onclick: () => alCambiar(k) }, t)));
  return seg;
}
let testLeer = "at", testMapa = "todo";
function vLeer(a) {
  a.append(el("h1", {}, "Elegir capítulo"), el("p", { class: "sub" }, "Elegí el testamento, el libro y el capítulo"));
  if (S.pos) a.append(el("button", { class: "sec big", style: "margin:0 0 6px", onclick: continuar }, ico("leer", "sm"), "Volver a " + nombre(S.pos.b, S.pos.c)));
  const card = el("div", { class: "card" });
  const pintar = () => {
    card.replaceChildren(segTestamento(testLeer, (k) => { testLeer = k; pintar(); }));
    const desde = testLeer === "at" ? 0 : 39, hasta = testLeer === "at" ? 39 : 66;
    const sb = el("select", { id: "sb" }, LIBROS.slice(desde, hasta).map((l, i) => el("option", { value: desde + i }, l.n)));
    const sc = el("select", { id: "sc" });
    const fill = () => sc.replaceChildren(...Array.from({ length: LIBROS[sb.value].c }, (_, i) => el("option", { value: i + 1 }, "Capítulo " + (i + 1))));
    sb.onchange = fill; fill();
    card.append(el("label", { for: "sb" }, "Libro"), sb, el("label", { for: "sc" }, "Capítulo"), sc,
      el("button", { class: "big", onclick: () => abrir(+sb.value, +sc.value) }, ico("leer", "sm"), "Abrir capítulo"));
  };
  pintar(); a.append(card);
}

function vMapa(a) {
  const { r, t } = stats();
  a.append(el("h1", {}, "Mapa de progreso"), el("p", { class: "sub" }, "Tocá un capítulo para abrirlo"));
  a.append(el("div", { class: "card" }, el("div", { class: "row sp" }, el("b", {}, ((r / t) * 100).toFixed(1) + "% de la Biblia"), el("span", { class: "mut" }, r + " / " + t)), barra(((r / t) * 100).toFixed(1))));
  a.append(segTestamento(testMapa, (k) => { testMapa = k; render(); }, true));
  const sec = (tt, d, h) => {
    a.append(el("h2", {}, tt));
    for (let b = d; b < h; b++) {
      const l = LIBROS[b], n = l.v.filter((_, i) => isRead(b, i + 1)).length;
      a.append(el("div", { class: "libro" }, el("div", { class: "n" }, el("span", {}, l.n), el("span", { class: "mut", style: "font:15px var(--ui)" }, n + "/" + l.c)),
        el("div", { class: "cells" }, l.v.map((_, i) => el("button", { class: "cell" + (isRead(b, i + 1) ? " r" : ""), "aria-label": nombre(b, i + 1) + (isRead(b, i + 1) ? ", leído" : ""), onclick: () => abrir(b, i + 1) }, i + 1)))));
    }
  };
  if (testMapa !== "nt") sec("Antiguo Testamento", 0, 39);
  if (testMapa !== "at") sec("Nuevo Testamento", 39, 66);
}

// ---------- lector ----------
const vecinos = (b, c) => ({
  prev: c > 1 ? [b, c - 1] : b > 0 ? [b - 1, LIBROS[b - 1].c] : null,
  next: c < LIBROS[b].c ? [b, c + 1] : b < 65 ? [b + 1, 1] : null,
});
async function vLector(a) {
  const { b, c } = view;
  a.append(el("div", { class: "top" }, el("button", { class: "ghost", "aria-label": "Volver", onclick: () => { view = null; render(); } }, ico("atras")), el("h1", {}, el("button", { class: "tit", "aria-label": "Elegir otro libro o capítulo", onclick: () => { elegir = true; view = null; tab = "leer"; render(); } }, nombre(b, c), ico("abajo", "sm"))),
    el("button", { class: "ghost", id: "btnPrev", "aria-label": "Capítulo anterior", onclick: () => { const v = vecinos(view.b, view.c).prev; if (v) abrir(...v); } }, ico("izq")),
    el("button", { class: "ghost", id: "btnNext", "aria-label": "Capítulo siguiente", onclick: () => { const v = vecinos(view.b, view.c).next; if (v) abrir(...v); } }, ico("der")),
    el("button", { class: "ghost", id: "btnCom", "aria-label": "Ir al comentario completo", title: "Comentario completo" }, ico("rollo"))));
  const cargando = el("p", { class: "mut" }, "Cargando…"); a.append(cargando);
  let rv;
  try { rv = (await get("data/b/" + b + ".json"))[c - 1]; } catch (e) { cargando.textContent = "No se pudo cargar el texto. Revisá tu conexión."; return; }
  cargando.remove();
  const tx = el("div", { class: "versos" }); rv.forEach((v, i) => tx.append(el("p", { class: "v" }, el("sup", {}, i + 1), v))); a.append(tx);
  if (view.y) { const y = view.y; view.y = 0; requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" })); }
  {
    const v = vecinos(b, c);
    a.append(el("div", { class: "nextbar" }, v.prev && el("button", { class: "sec", onclick: () => abrir(...v.prev) }, ico("izq", "sm"), nombre(...v.prev)),
      v.next && el("button", { class: "sec", onclick: () => abrir(...v.next) }, nombre(...v.next), ico("der", "sm"))));
  }
  const zona = el("div", { class: "zona" }); a.append(zona);
  const sig = () => {
    const prev = c > 1 ? [b, c - 1] : b > 0 ? [b - 1, LIBROS[b - 1].c] : null, n = c < LIBROS[b].c ? [b, c + 1] : b < 65 ? [b + 1, 1] : null;
    return el("div", { class: "nextbar" }, prev && el("button", { class: "sec", onclick: () => abrir(...prev) }, ico("izq", "sm"), "Anterior"), n && el("button", { onclick: () => abrir(...n) }, "Siguiente", ico("der", "sm")));
  };
  const pintar = async () => {
    zona.replaceChildren(el("p", { class: "mut" }, "Cargando comentario…"));
    let d; try { d = await get("data/c/" + b + "-" + c + ".json"); } catch (e) { zona.replaceChildren(el("p", { class: "mut" }, "No se pudo cargar el comentario.")); return; }
    zona.replaceChildren();
    const mapa = Object.fromEntries(d.versos.map((v) => [v.v, v]));
    zona.append(el("h2", {}, "Comentario de Gill"));
    if (!d.versos.length) zona.append(el("div", { class: "info" }, el("b", {}, "Comentario en bloque"), el("span", {}, "Para este capítulo el texto de Gill no trae comentario versículo por versículo; lo que hay es la introducción de abajo.")));
    zona.append(el("div", { class: "tabs2", role: "tablist" },
      el("button", { class: view.modo === "esencial" ? "on" : "", onclick: () => ir("esencial") }, ico("luz", "sm"), "Lo esencial"),
      el("button", { class: view.modo === "completo" ? "on" : "", onclick: () => ir("completo") }, ico("rollo", "sm"), "Comentario completo")));
    if (view.modo === "completo") {
      const f = el("div", { class: "full" });
      if (d.intro) { f.append(el("h3", {}, "Introducción al capítulo")); d.intro.split(/\n\s*\n/).forEach((p) => f.append(el("p", { class: "com" }, p))); }
      d.versos.forEach((v) => { f.append(el("h3", {}, "Versículo " + v.v)); v.p.forEach((p) => f.append(el("p", { class: "com" }, p))); });
      zona.append(f);
    } else {
      if (d.intro) zona.append(el("details", {}, el("summary", {}, "Introducción al capítulo"), ...d.intro.split(/\n\s*\n/).map((p) => el("p", { class: "com" }, p))));
      if (d.claves.length) {
        const e = el("div", { class: "esen" }, el("b", {}, "Versículos donde Gill más se detiene"));
        d.claves.forEach((n) => { const w = mapa[n].p[0].split(/\s+/); e.append(el("p", { class: "com" }, el("b", {}, "v." + n + "  "), w.slice(0, 55).join(" ") + (w.length > 55 ? "…" : ""))); });
        zona.append(e);
      }
      zona.append(el("h2", {}, "Por versículo"));
      d.versos.forEach((v) => zona.append(el("details", d.claves.includes(v.v) ? { open: "" } : {}, el("summary", {}, "Versículo " + v.v), ...v.p.map((p) => el("p", { class: "com" }, p)))));
      zona.append(el("button", { class: "big", onclick: () => ir("completo") }, ico("rollo", "sm"), "Leer todo el comentario completo"));
    }
    zona.append(sig());
  };
  const accion = el("div");
  const ir = async (modo) => { accion.remove(); view.modo = modo; await pintar(); window.scrollTo({ top: zona.getBoundingClientRect().top + window.scrollY - 62, behavior: "instant" }); };
  $("#btnCom").onclick = () => ir("completo");
  if (isRead(b, c)) { a.insertBefore(el("div", { class: "row", style: "margin-top:10px" }, el("span", { class: "chip ok" }, ico("check", "sm"), "Leído")), zona); pintar(); }
  else {
    accion.append(
      el("button", { class: "big", onclick: async () => { S.read[ck(b, c)] = hoy(); save(); accion.remove(); await pintar(); } }, ico("check", "sm"), "Terminé de leer · ver comentario"),
      el("button", { class: "big sec", onclick: () => ir("completo") }, ico("rollo", "sm"), "Leer comentario completo"));
    a.insertBefore(accion, zona);
  }
}

function marcarHasta(b, c) {
  LIBROS.forEach((l, i) => l.v.forEach((_, j) => { if (i < b || (i === b && j + 1 <= c)) S.read[ck(i, j + 1)] = S.read[ck(i, j + 1)] || hoy(); }));
  save();
}
// ---------- ajustes ----------
function aplicarTema() {
  const t = S.theme || "auto", r = document.documentElement;
  if (t === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", t);
  const osc = t === "oscuro" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", osc ? "#17130e" : "#7a3b1d");
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", aplicarTema);

function seccion(icono, titulo, ...hijos) {
  return el("section", { class: "card" }, el("div", { class: "sec-h" }, ico(icono), el("h3", {}, titulo)), ...hijos);
}
function vAjustes(a) {
  a.append(el("h1", {}, "Ajustes"), el("p", { class: "sub" }, "Personalizá tu lectura"));

  // --- Tema ---
  const temas = [["auto", "Automático", "pantalla"], ["claro", "Claro", "sol"], ["oscuro", "Oscuro", "luna"]];
  const seg = el("div", { class: "seg", role: "group", "aria-label": "Tema" });
  temas.forEach(([k, t, i]) => seg.append(el("button", { class: (S.theme || "auto") === k ? "on" : "", "aria-pressed": (S.theme || "auto") === k, onclick: () => { S.theme = k; save(); aplicarTema(); render(); } }, ico(i, "sm"), t)));
  a.append(seccion("paleta", "Tema", seg));

  // --- Plan ---
  let sel = S.plan ? S.plan.tipo : "anio", n = (S.plan && S.plan.n) || 5, inicio = (S.plan && S.plan.inicio) || hoy();
  const cardPlan = el("section", { class: "card" });
  const pintarPlan = () => {
    cardPlan.replaceChildren(el("div", { class: "sec-h" }, ico("calendario"), el("h3", {}, "Plan de lectura")));
    const opts = el("div", { class: "opts", role: "radiogroup", "aria-label": "Plan" });
    [["anio", "Biblia en 1 año", "Ritmo suave, todos los días"], ["seis", "Biblia en 6 meses", "Ritmo más intenso"], ["custom", "Personalizado", "Elegís cuántos capítulos por día"]].forEach(([k, t, d]) =>
      opts.append(el("button", { class: "opt" + (sel === k ? " on" : ""), role: "radio", "aria-checked": sel === k, onclick: () => { sel = k; pintarPlan(); } },
        el("span", { class: "dot" }, sel === k ? ico("check", "sm") : null), el("span", { class: "ot" }, t, el("small", {}, d)))));
    cardPlan.append(opts);
    if (sel === "custom") {
      const num = el("input", { id: "nn", type: "number", inputmode: "numeric", min: 1, max: 40, value: n, "aria-label": "Capítulos por día" });
      num.onchange = () => { n = Math.min(40, Math.max(1, +num.value || 1)); pintarPlan(); };
      cardPlan.append(el("label", { for: "nn" }, "Capítulos por día"), el("div", { class: "stepper" },
        el("button", { class: "sec", "aria-label": "Menos", onclick: () => { n = Math.max(1, n - 1); pintarPlan(); } }, "−"), num,
        el("button", { class: "sec", "aria-label": "Más", onclick: () => { n = Math.min(40, n + 1); pintarPlan(); } }, "+")));
    }
    const dias = buildPlan(sel, n), tot = dias.reduce((s2, d) => s2 + d.length, 0), prom = tot / dias.length;
    const fin = new Date(inicio + "T00:00:00"); fin.setDate(fin.getDate() + dias.length - 1);
    cardPlan.append(el("div", { class: "info" },
      el("b", {}, sel === "custom" ? n + (n === 1 ? " capítulo" : " capítulos") + " por día" : "≈ " + (Math.round(prom * 10) / 10).toString().replace(".", ",") + " capítulos por día"),
      el("span", {}, dias.length + " días · termina el " + fin.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" }))));
    const ini = el("input", { id: "in", type: "date", value: inicio, onchange: () => { inicio = ini.value || hoy(); pintarPlan(); } });
    cardPlan.append(el("label", { for: "in" }, "Fecha de inicio"), ini,
      el("button", { class: "big", onclick: () => { S.plan = { tipo: sel, n, inicio }; PLAN_DIAS = null; save(); tab = "hoy"; render(); } }, "Guardar plan"),
      el("p", { class: "mut nota" }, "Lo que ya leíste no se pierde al cambiar de plan."));
  };
  pintarPlan(); a.append(cardPlan);

  // --- Recordatorio ---
  const hh = el("input", { id: "hh", type: "time", value: S.notif.time });
  const estado = el("span", { class: "chip " + (S.notif.on ? "ok" : "d") }, S.notif.on ? "Activado a las " + S.notif.time : "Desactivado");
  a.append(seccion("campana", "Recordatorio diario", estado,
    el("label", { for: "hh" }, "Hora del aviso"), hh,
    el("div", { class: "dos" },
      el("button", { onclick: async () => { if (!("Notification" in window)) return alert("Este navegador no admite notificaciones."); const p = await Notification.requestPermission(); if (p !== "granted") return alert("Hace falta permitir las notificaciones."); S.notif = { ...S.notif, on: true, time: hh.value }; save(); registrarPeriodico(); render(); } }, "Activar"),
      el("button", { class: "sec", onclick: () => { S.notif.on = false; save(); render(); } }, "Desactivar")),
    el("p", { class: "mut nota" }, "En Android, instalá la app desde el menú de Chrome (Instalar app) para que el aviso llegue con la app cerrada.")));

  // --- Letra ---
  const fs = el("input", { type: "range", min: 15, max: 28, value: S.fs, "aria-label": "Tamaño de letra", oninput: () => { S.fs = +fs.value; document.documentElement.style.setProperty("--fs", S.fs + "px"); save(); } });
  a.append(seccion("texto", "Tamaño de letra", fs, el("p", { class: "v prueba" }, "En el principio crió Dios los cielos y la tierra.")));

  // --- Ya leí hasta ---
  {
    const sb = el("select", { id: "yb" }, LIBROS.map((l, i) => el("option", { value: i }, l.n)));
    const sc = el("select", { id: "yc" });
    const fill = () => sc.replaceChildren(...Array.from({ length: LIBROS[sb.value].c }, (_, i) => el("option", { value: i + 1 }, "Capítulo " + (i + 1))));
    sb.onchange = fill; fill();
    a.append(seccion("check", "Marcar lo ya leído", el("p", { class: "mut nota", style: "margin-top:0" }, "Elegí hasta dónde llegaste y marco como leído todo lo anterior, incluido ese capítulo."),
      el("label", { for: "yb" }, "Libro"), sb, el("label", { for: "yc" }, "Capítulo"), sc,
      el("button", { class: "big", onclick: () => { if (!confirm("¿Marcar como leído hasta " + nombre(+sb.value, +sc.value) + "?")) return; marcarHasta(+sb.value, +sc.value); render(); } }, "Marcar hasta aquí")));
  }
    // --- Copia ---
  a.append(seccion("bajar", "Copia de seguridad", el("p", { class: "mut nota", style: "margin-top:0" }, "Guardá tu progreso por si cambiás de celular."),
    el("div", { class: "dos" },
      el("button", { class: "sec", onclick: () => { const u = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); el("a", { href: u, download: "lectura-progreso.json" }).click(); } }, ico("bajar", "sm"), "Exportar"),
      el("button", { class: "sec", onclick: () => { const i = el("input", { type: "file", accept: ".json" }); i.onchange = async () => { S = JSON.parse(await i.files[0].text()); PLAN_DIAS = null; save(); aplicarTema(); render(); }; i.click(); } }, ico("subir", "sm"), "Importar"))));
}

// ---------- notificaciones ----------
function syncCfg() { if ("caches" in window) caches.open("cfg").then((c) => c.put("cfg", new Response(JSON.stringify({ ...S.notif, pendiente: diaActual() >= 0 })))); }
async function registrarPeriodico() { try { const r = await navigator.serviceWorker.ready; if (r.periodicSync) await r.periodicSync.register("recordatorio", { minInterval: 6 * 3600e3 }); } catch (e) {} }
async function chequearRecordatorio() {
  if (!S.notif.on || !("Notification" in window) || Notification.permission !== "granted") return;
  const [h, m] = S.notif.time.split(":"), t = new Date(); t.setHours(+h, +m, 0, 0);
  if (new Date() >= t && S.notif.last !== hoy() && diaActual() >= 0) {
    S.notif.last = hoy(); save();
    (await navigator.serviceWorker.ready).showNotification("Tu lectura de hoy", { body: "Es hora de leer. Un capítulo a la vez.", icon: "icon.svg", tag: "diario" });
  }
}

let _t;
addEventListener("scroll", () => { if (!view || !S.pos || S.pos.b !== view.b || S.pos.c !== view.c) return; clearTimeout(_t); _t = setTimeout(() => { S.pos.y = Math.round(scrollY); localStorage.setItem(KEY, JSON.stringify(S)); }, 500); }, { passive: true });
(async () => {
  document.documentElement.style.setProperty("--fs", S.fs + "px"); aplicarTema();
  LIBROS = await get("data/libros.json");
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  if (!S.sembrado) { marcarHasta(1, 17); S.sembrado = 1; save(); } // ya leído: Génesis completo y Éxodo hasta el 17
  render(); syncCfg(); chequearRecordatorio(); setInterval(chequearRecordatorio, 60000);
})();
