// BIONOVA — shared interactions
(function(){
  "use strict";

  // Dropdown nav menus (Решения, Врачам) open on hover via CSS. Решения's
  // trigger is a normal link to the overview page. Врачам's trigger has no
  // overview page of its own (use "Информация" inside the dropdown for
  // that), so its click is a no-op — it only ever opens via hover.
  document.addEventListener("click", function(e){
    var noNav = e.target.closest("a[data-no-nav]");
    if(noNav) e.preventDefault();
  });

  // Consultation modal
  document.addEventListener("click", function(e){
    var opener = e.target.closest("[data-open-consultation]");
    if(opener){
      e.preventDefault();
      var m = document.getElementById("consultModal");
      if(m){ m.classList.add("show"); document.body.classList.add("modal-open"); }
      return;
    }
    var closer = e.target.closest("[data-modal-close]");
    var overlay = e.target.closest(".modal-overlay");
    if(closer || (overlay && e.target === overlay)){
      document.querySelectorAll(".modal-overlay.show").forEach(function(m){ m.classList.remove("show"); });
      document.body.classList.remove("modal-open");
    }
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      document.querySelectorAll(".modal-overlay.show").forEach(function(m){ m.classList.remove("show"); });
      document.body.classList.remove("modal-open");
    }
  });

  // Mobile nav toggle
  document.addEventListener("click", function(e){
    var openBtn = e.target.closest("[data-nav-open]");
    var closeBtn = e.target.closest("[data-nav-close]");
    if(openBtn){
      var m = document.getElementById("mobileNav");
      if(m) m.classList.add("open");
    }
    if(closeBtn){
      var m2 = document.getElementById("mobileNav");
      if(m2) m2.classList.remove("open");
    }
  });

  // FAQ accordion
  document.addEventListener("click", function(e){
    var q = e.target.closest(".faq-q");
    if(!q) return;
    var item = q.closest(".faq-item");
    var wasOpen = item.classList.contains("open");
    item.parentElement.querySelectorAll(".faq-item.open").forEach(function(i){
      if(i !== item) i.classList.remove("open");
    });
    item.classList.toggle("open", !wasOpen);
  });

  // Chip filter (products / blog)
  document.addEventListener("click", function(e){
    var chip = e.target.closest(".chip[data-filter]");
    if(!chip) return;
    var row = chip.closest(".chip-row");
    row.querySelectorAll(".chip").forEach(function(c){ c.classList.remove("active"); });
    chip.classList.add("active");
    var filter = chip.getAttribute("data-filter");
    var grid = document.querySelector(chip.closest("[data-filter-target]") ? "" : "[data-filter-grid]") || document.querySelector("[data-filter-grid]");
    if(!grid) return;
    grid.querySelectorAll("[data-cat]").forEach(function(card){
      var cats = (card.getAttribute("data-cat") || "").split(",");
      card.style.display = (filter === "all" || cats.indexOf(filter) > -1) ? "" : "none";
    });
  });

  // Role toggle in forms (patient / doctor)
  document.addEventListener("click", function(e){
    var opt = e.target.closest("[data-role-opt]");
    if(!opt) return;
    var group = opt.closest(".radio-group");
    group.querySelectorAll(".radio-opt").forEach(function(o){ o.classList.remove("sel"); });
    opt.classList.add("sel");
    var hidden = group.parentElement.querySelector("input[name='role']");
    if(hidden) hidden.value = opt.getAttribute("data-role-opt");
  });

  // Fake form submit -> success state
  document.addEventListener("submit", function(e){
    var form = e.target.closest("form[data-fake-submit]");
    if(!form) return;
    e.preventDefault();
    var successId = form.getAttribute("data-success-target");
    var success = successId ? document.getElementById(successId) : form.nextElementSibling;
    form.style.display = "none";
    if(success) success.classList.add("show");
    showToast("Заявка отправлена");
  });

  function showToast(msg){
    var t = document.getElementById("toast");
    if(!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(window.__bnvToastTimer);
    window.__bnvToastTimer = setTimeout(function(){ t.classList.remove("show"); }, 2600);
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  // Carousel prev/next
  document.addEventListener("click", function(e){
    var btn = e.target.closest("[data-carousel-prev], [data-carousel-next]");
    if(!btn) return;
    var wrap = btn.closest(".carousel");
    var track = wrap && wrap.querySelector(".carousel-track");
    if(!track) return;
    var card = track.querySelector(":scope > *");
    var step = card ? (card.getBoundingClientRect().width + 20) : 320;
    track.scrollBy({ left: btn.hasAttribute("data-carousel-next") ? step : -step, behavior: "smooth" });
  });

})();
