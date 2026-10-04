// js/components/chat.js: floating AI assistant. Talks to POST /api/chat (Workers AI) or a scripted demo.
import { h } from "../core/dom.js";
import { api } from "../data/api.js";
import { ENV } from "../data/env.js";
export const mountChat = () => {
  if (!ENV.CHAT || document.getElementById("chat")) return;
  const msgs = [],
    log = h("div", { class: "clog", "aria-live": "polite" }),
    inp = h("input", {
      type: "text",
      placeholder: "Ask about L.I.G.O. SPACE\u2026",
      "aria-label": "Your message",
      maxlength: "400"
    });
  const add = (r, t) => {
    log.append(h("div", { class: "cm " + r }, t));
    log.scrollTop = log.scrollHeight;
  };
  const send = async (t) => {
    t = t.trim();
    if (!t) return;
    inp.value = "";
    add("u", t);
    msgs.push({ role: "user", content: t });
    try {
      const r = await api.chat(msgs.slice(-8));
      msgs.push({ role: "assistant", content: r.reply });
      add("a", r.reply);
    } catch (e) {
      add("a", "Sorry, I could not answer just now. Please use the Contact page.");
    }
  };
  const toggle = () => {
    panel.hidden = !panel.hidden;
    fab.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) inp.focus();
  };
  const panel = h(
    "div",
    {
      class: "cpanel",
      role: "dialog",
      "aria-label": "L.I.G.O. assistant",
      onkeydown: (e) => e.key === "Escape" && toggle()
    },
    h(
      "div",
      { class: "chead" },
      h("b", {}, "Ask L.I.G.O."),
      h("button", { "aria-label": "Close chat", onclick: toggle }, "\u00D7")
    ),
    log,
    h(
      "div",
      { class: "csug" },
      ["Where do I fit?", "Is the SACCO open?", "When is the launch?"].map((t) =>
        h("button", { class: "chip", onclick: () => send(t) }, t)
      )
    ),
    h(
      "form",
      {
        class: "cform",
        onsubmit: (e) => {
          e.preventDefault();
          send(inp.value);
        }
      },
      inp,
      h("button", { class: "btn sm", type: "submit" }, "Send")
    ),
    h(
      "p",
      { class: "cnote" },
      "AI assistant. It can be wrong, so please check important details with the team. Do not share sensitive personal information."
    )
  );
  panel.hidden = true;
  const fab = h("button", { class: "cfab", "aria-expanded": "false", onclick: toggle }, "Ask L.I.G.O.");
  document.body.append(h("div", { id: "chat" }, panel, fab));
  add(
    "a",
    "Hello! I can help you find where you fit, explain our programs, or tell you about the 5 December 2026 launch."
  );
};