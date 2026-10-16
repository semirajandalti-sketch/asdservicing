// ASD Installation — site behaviour
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var CONTACT_EMAIL = "contact@asinstallation.store";

  // ---------- Mobile navigation ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setNav(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setNav(false);
      toggle.focus();
    }
  });

  // ---------- Header shadow on scroll ----------
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Scroll reveal ----------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---------- Hero facade: windows "fitted" one by one ----------
  var panes = document.querySelectorAll(".facade span");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (panes.length) {
    if (reduceMotion) {
      panes.forEach(function (p) { p.classList.add("fitted"); });
    } else {
      var i = 0;
      setInterval(function () {
        if (i < panes.length) {
          panes[i].classList.add("fitted");
          i++;
        } else {
          panes.forEach(function (p) { p.classList.remove("fitted"); });
          i = 0;
        }
      }, 450);
    }
  }

  // ---------- Contact form (opens the visitor's email client) ----------
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "form-status" + (type ? " " + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var required = ["name", "email", "message"];
    var firstInvalid = null;

    required.forEach(function (id) {
      var input = document.getElementById(id);
      var valid = input.value.trim() !== "" && (input.type !== "email" || input.checkValidity());
      input.closest(".field").classList.toggle("invalid", !valid);
      if (!valid && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      setStatus("Please fill in your name, a valid email address and your project details.", "error");
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var subject = "Project enquiry – " + data.get("project-type") + " (" + data.get("country") + ")";
    var body = [
      "Name: " + data.get("name"),
      "Company: " + (data.get("company") || "-"),
      "Email: " + data.get("email"),
      "Phone: " + (data.get("phone") || "-"),
      "Project type: " + data.get("project-type"),
      "Country: " + data.get("country"),
      "",
      "Project details:",
      data.get("message")
    ].join("\n");

    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    setStatus("Your email app should now open with your enquiry ready to send.", "success");
  });

  form.querySelectorAll("input, textarea").forEach(function (input) {
    input.addEventListener("input", function () {
      input.closest(".field").classList.remove("invalid");
    });
  });

  // ---------- Footer year ----------
  document.getElementById("year").textContent = new Date().getFullYear();
})();
