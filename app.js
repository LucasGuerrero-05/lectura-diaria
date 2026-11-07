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
    n.append(el("button", { class: tab === k && !view ? "on" : "", "aria-label": t, onclick: () => { tab = k; view = null; render(); } }, ico(k), t)));
}
async function render() {
  nav(); const a = $("#app"); a.replaceChildren(); window.scrollTo(0, 0);
  if (view) return vLector(a);
  ({ hoy: vHoy, leer: vLeer, mapa: vMapa, ajustes: vAjustes })[tab](a);
}
const abrir = (b, c) => { view = { b, c, modo: "esencial" }; render(); };
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

function vLeer(a) {
  a.append(el("h1", {}, "Leer"), el("p", { class: "sub" }, "Elegí cualquier libro y capítulo"));
  const sb = el("select", { id: "sb" }, LIBROS.map((l, i) => el("option", { value: i }, l.n)));
  const sc = el("select", { id: "sc" });
  const fill = () => sc.replaceChildren(...Array.from({ length: LIBROS[sb.value].c }, (_, i) => el("option", { value: i + 1 }, "Capítulo " + (i + 1))));
  sb.onchange = fill; fill();
  a.append(el("div", { class: "card" }, el("label", { for: "sb" }, "Libro"), sb, el("div", { style: "height:10px" }), el("label", { for: "sc" }, "Capítulo"), sc,
    el("button", { class: "big", onclick: () => abrir(+sb.value, +sc.value) }, ico("leer", "sm"), "Abrir capítulo")));
}

function vMapa(a) {
  const { r, t } = stats();
  a.append(el("h1", {}, "Mapa de progreso"), el("p", { class: "sub" }, "Tocá un capítulo para abrirlo"));
  a.append(el("div", { class: "card" }, el("div", { class: "row sp" }, el("b", {}, ((r / t) * 100).toFixed(1) + "% de la Biblia"), el("span", { class: "mut" }, r + " / " + t)), barra(((r / t) * 100).toFixed(1))));
  const sec = (tt, d, h) => {
    a.append(el("h2", {}, tt));
    for (let b = d; b < h; b++) {
      const l = LIBROS[b], n = l.v.filter((_, i) => isRead(b, i + 1)).length;
      a.append(el("div", { class: "libro" }, el("div", { class: "n" }, el("span", {}, l.n), el("span", { class: "mut", style: "font:15px var(--ui)" }, n + "/" + l.c)),
        el("div", { class: "cells" }, l.v.map((_, i) => el("button", { class: "cell" + (isRead(b, i + 1) ? " r" : ""), "aria-label": nombre(b, i + 1) + (isRead(b, i + 1) ? ", leído" : ""), onclick: () => abrir(b, i + 1) }, i + 1)))));
    }
  };
  sec("Antiguo Testamento", 0, 39); sec("Nuevo Testamento", 39, 66);
}

// ---------- lector ----------
async function vLector(a) {
  const { b, c } = view;
  a.append(el("div", { class: "top" }, el("button", { class: "ghost", "aria-label": "Volver", onclick: () => { view = null; render(); } }, ico("atras")), el("h1", {}, nombre(b, c))));
  const cargando = el("p", { class: "mut" }, "Cargando…"); a.append(cargando);
  let rv;
  try { rv = (await get("data/b/" + b + ".json"))[c - 1]; } catch (e) { cargando.textContent = "No se pudo cargar el texto. Revisá tu conexión."; return; }
  cargando.remove();
  const tx = el("div", { class: "versos" }); rv.forEach((v, i) => tx.append(el("p", { class: "v" }, el("sup", {}, i + 1), v))); a.append(tx);
  const zona = el("div"); a.append(zona);
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
    zona.append(el("div", { class: "tabs2", role: "tablist" },
      el("button", { class: view.modo === "esencial" ? "on" : "", onclick: () => { view.modo = "esencial"; pintar(); } }, ico("luz", "sm"), "Lo esencial"),
      el("button", { class: view.modo === "completo" ? "on" : "", onclick: () => { view.modo = "completo"; pintar(); } }, ico("rollo", "sm"), "Comentario completo")));
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
      zona.append(el("button", { class: "big", onclick: () => { view.modo = "completo"; pintar(); window.scrollTo({ top: zona.offsetTop - 60 }); } }, ico("rollo", "sm"), "Leer todo el comentario completo"));
    }
    zona.append(sig());
  };
  const accion = el("div");
  if (isRead(b, c)) { a.insertBefore(el("div", { class: "row", style: "margin-top:10px" }, el("span", { class: "chip ok" }, ico("check", "sm"), "Leído")), zona); pintar(); }
  else {
    accion.append(
      el("button", { class: "big", onclick: async () => { S.read[ck(b, c)] = hoy(); save(); accion.remove(); await pintar(); } }, ico("check", "sm"), "Terminé de leer · ver comentario"),
      el("button", { class: "big sec", onclick: () => { accion.remove(); pintar(); } }, ico("rollo", "sm"), "Ver comentario sin marcar como leído"));
    a.insertBefore(accion, zona);
  }
}

// ---------- ajustes ----------
function vAjustes(a) {
  a.append(el("h1", {}, "Ajustes"));
  const tipo = el("select", { id: "tp" }, [["anio", "Biblia en 1 año"], ["seis", "Biblia en 6 meses"], ["custom", "Capítulos por día"]].map(([v, t]) => el("option", { value: v, ...(S.plan && S.plan.tipo === v ? { selected: "" } : {}) }, t)));
  const n = el("input", { id: "nn", type: "number", min: 1, max: 40, value: (S.plan && S.plan.n) || 5, style: "width:90px" });
  const ini = el("input", { id: "in", type: "date", value: (S.plan && S.plan.inicio) || hoy() });
  a.append(el("div", { class: "card" }, el("h3", {}, "Plan de lectura"),
    el("label", { for: "tp" }, "Plan"), tipo, el("div", { style: "height:10px" }),
    el("div", { class: "row" }, el("div", {}, el("label", { for: "nn" }, "Capítulos por día"), n), el("div", {}, el("label", { for: "in" }, "Empieza"), ini)),
    el("button", { class: "big", onclick: () => { S.plan = { tipo: tipo.value, n: +n.value || 5, inicio: ini.value }; PLAN_DIAS = null; save(); tab = "hoy"; render(); } }, "Guardar plan"),
    el("p", { class: "mut" }, "Lo que ya leíste no se pierde al cambiar de plan.")));
  const hh = el("input", { id: "hh", type: "time", value: S.notif.time });
  a.append(el("div", { class: "card" }, el("div", { class: "row" }, ico("campana"), el("h3", {}, "Recordatorio diario")),
    el("label", { for: "hh", style: "margin-top:10px" }, "Hora del aviso"), hh,
    el("div", { class: "row", style: "margin-top:12px" },
      el("button", { onclick: async () => { const p = await Notification.requestPermission(); if (p !== "granted") return alert("Hace falta permitir las notificaciones."); S.notif = { ...S.notif, on: true, time: hh.value }; save(); registrarPeriodico(); alert("Recordatorio activado a las " + hh.value); } }, "Activar"),
      el("button", { class: "sec", onclick: () => { S.notif.on = false; save(); alert("Recordatorio desactivado"); } }, "Desactivar")),
    el("p", { class: "mut" }, "En Android, instalá la app desde el menú de Chrome (Instalar app) para que el aviso llegue con la app cerrada.")));
  const fs = el("input", { type: "range", min: 15, max: 28, value: S.fs, style: "width:100%", "aria-label": "Tamaño de letra", oninput: () => { S.fs = +fs.value; document.documentElement.style.setProperty("--fs", S.fs + "px"); save(); } });
  a.append(el("div", { class: "card" }, el("div", { class: "row" }, ico("texto"), el("h3", {}, "Tamaño de letra")), fs, el("p", { class: "v", style: "margin-bottom:0" }, "En el principio crió Dios los cielos y la tierra.")));
  a.append(el("div", { class: "card" }, el("h3", {}, "Copia de seguridad"), el("p", { class: "mut" }, "Guardá tu progreso por si cambiás de celular."),
    el("div", { class: "row" },
      el("button", { class: "sec", onclick: () => { const u = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); el("a", { href: u, download: "lectura-progreso.json" }).click(); } }, ico("bajar", "sm"), "Exportar"),
      el("button", { class: "sec", onclick: () => { const i = el("input", { type: "file", accept: ".json" }); i.onchange = async () => { S = JSON.parse(await i.files[0].text()); PLAN_DIAS = null; save(); render(); }; i.click(); } }, ico("subir", "sm"), "Importar"))));
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

(async () => {
  document.documentElement.style.setProperty("--fs", S.fs + "px");
  LIBROS = await get("data/libros.json");
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  render(); syncCfg(); chequearRecordatorio(); setInterval(chequearRecordatorio, 60000);
})();
