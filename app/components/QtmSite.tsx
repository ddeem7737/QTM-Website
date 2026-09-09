"use client";
/* eslint-disable @next/next/no-html-link-for-pages, react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import worldMap from "@svg-maps/world";
import { industries, industryDetails, news, productFamilies, products, suppliers, timingBeltTypes, findIndustry, findProduct, findSupplier, slugify, type Product } from "../data";

const Arrow = () => (
  <span className="interface-arrow" aria-hidden="true">
    <svg viewBox="0 0 16 16" focusable="false">
      <path d="M3.5 12.5 12.5 3.5M5.5 3.5h7v7" />
    </svg>
  </span>
);
const Chevron = () => <span aria-hidden="true">⌄</span>;
const CascadeChevron = () => (
  <svg className="cascade-chevron" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="m4 2 4 4-4 4" />
  </svg>
);

type Language = "en" | "ru";
const originalText = new WeakMap<Text, string>();
const russianCopy: Record<string, string> = {
  "Home":"Главная", "About Us":"О нас", "Products":"Продукция", "Industries":"Отрасли", "Suppliers":"Партнёры", "Our Network":"Наша сеть", "Contact Us":"Контакты", "News":"Новости",
  "Request a Quote":"Запросить предложение", "B2B Login":"Вход B2B", "Check Our Products":"Посмотреть продукцию", "Explore":"Подробнее", "Contact QTM":"Связаться с QTM",
  "Industrial Solutions.":"Промышленные решения.", "Delivered Regionally.":"Региональная поставка.",
  "QTM Group is a leading regional supplier of, industrial, agricultural and conveyor belts. In addition to belting solutions, we provide roller chains, sprockets, bearings, and a comprehensive range of industrial spare parts.":"QTM Group — ведущий региональный поставщик промышленных, сельскохозяйственных и конвейерных ремней. Помимо ременных решений, мы поставляем роликовые цепи, звёздочки, подшипники и широкий ассортимент промышленных запасных частей.",
  "MegaPartner":"МегаПартнёр", "STRATEGIC PARTNERSHIPS":"СТРАТЕГИЧЕСКИЕ ПАРТНЁРСТВА", "MEGAPARTNER":"МЕГАПАРТНЁР", "Our partnership":"Наше партнёрство", "Product solutions":"Продуктовые решения",
  "In addition to Megadyne, QTM Group represents other leading brands within the":"Помимо Megadyne, QTM Group представляет другие ведущие бренды группы",
  "including...":"включая...",
  "Our Partners":"Наши партнёры",
  "Global Products. Regional Market Knowledge.":"Мировые продукты. Региональная экспертиза.", "A Network Built Around the Markets We Serve":"Сеть, созданная вокруг рынков, которые мы обслуживаем", "REGIONAL COVERAGE":"РЕГИОНАЛЬНОЕ ПОКРЫТИЕ", "Hover over a highlighted region to explore QTM’s regional reach.":"Наведите курсор на выделенный регион, чтобы увидеть географию работы QTM.",
  "Central Asia":"Центральная Азия", "Middle East":"Ближний Восток", "Caucasus & Moldova":"Кавказ и Молдова", "Mongolia":"Монголия", "Regional Distribution":"Региональная дистрибуция", "OEM & End-User Support":"Поддержка OEM и конечных клиентов", "Cross-Border Coordination":"Международная координация",
  "START A CONVERSATION":"НАЧНИТЕ ДИАЛОГ", "Need a Product, Replacement or Technical Solution?":"Нужен продукт, замена или техническое решение?", "Send Product Details":"Отправить данные продукта",
  "Contact":"Контакты", "Support":"Поддержка", "Privacy Policy":"Политика конфиденциальности", "Cookie Policy":"Политика cookie", "Terms":"Условия использования",
  "QTM Group is proud to be a Megadyne MegaPartner and a trusted regional distributor of Megadyne power transmission solutions.":"QTM Group гордится статусом MegaPartner Megadyne и является надёжным региональным дистрибьютором решений Megadyne для передачи мощности.",
  "Our partnership connects Megadyne’s broad industrial portfolio with regional distributors, OEMs, maintenance teams and end users. QTM supports product identification, technical selection, commercial coordination and dependable follow-up for demanding power transmission applications.":"Наше партнёрство делает широкий промышленный ассортимент Megadyne доступным региональным дистрибьюторам, OEM-производителям, сервисным службам и конечным пользователям. QTM помогает с идентификацией, техническим подбором и коммерческой координацией.",
  "Visit Megadyne":"Посетить Megadyne",
  "MEGASYNC™ Rubber belts":"Резиновые ремни MEGASYNC™", "Polyurethane timing belts":"Полиуретановые зубчатые ремни", "V-belt":"Клиновой ремень",
  "Official Megadyne product page":"Официальная страница продукта Megadyne",
  "High-performance synchronous solutions for precision and demanding industrial drives.":"Высокоэффективные синхронные решения для точных и нагруженных промышленных приводов.",
  "Wear-resistant belt technology for accurate, clean and efficient power transmission.":"Износостойкие ременные технологии для точной, чистой и эффективной передачи мощности.",
  "Reliable, versatile power transmission for industrial drives across a broad range of applications.":"Надёжная и универсальная передача мощности для широкого спектра промышленных приводов.",
  "Configurable solutions for linear motion, positioning and transport applications.":"Конфигурируемые решения для линейного движения, позиционирования и транспортировки.",
  "QTM Group represents Ammeraal Beltech, connecting customers with advanced conveyor, process and high-performance flat-belt solutions for demanding industrial applications.":"QTM Group представляет Ammeraal Beltech и предлагает передовые конвейерные, технологические и высокоэффективные плоские ремни для сложных промышленных применений.",
  "Through Sampla, QTM Group provides reliable conveyor and process belting for food, logistics, packaging and general manufacturing, supported by practical regional product selection.":"Благодаря Sampla QTM Group поставляет надёжные конвейерные и технологические ленты для пищевой промышленности, логистики, упаковки и общего производства.",
  "QTM Group supplies UNI modular belts, sprockets and accessories for hygienic, configurable and efficient conveying systems across food and industrial production.":"QTM Group поставляет модульные ленты UNI, звёздочки и комплектующие для гигиеничных, гибких и эффективных конвейерных систем.",
  "QTM Group represents Challenge Power Transmission with an extensive portfolio of roller chains, sprockets and mechanical power transmission components for industrial maintenance and OEM requirements.":"QTM Group представляет Challenge Power Transmission с широким ассортиментом роликовых цепей, звёздочек и механических компонентов для промышленного обслуживания и OEM.",
  "Customers benefit from QTM’s regional communication, product identification, application review and commercial coordination.":"Клиенты получают региональную поддержку QTM, помощь в идентификации продукции, анализе применения и коммерческой координации.",
  "Conveyor & process belts":"Конвейерные и технологические ленты", "RAPPLON® flat belts":"Плоские ремни RAPPLON®", "Specialty belt solutions":"Специализированные ременные решения", "Light-duty conveyor belts":"Лёгкие конвейерные ленты", "Specialized process belts":"Специализированные технологические ленты", "Flat-belt solutions":"Решения с плоскими ремнями", "Modular conveyor belts":"Модульные конвейерные ленты", "Matched sprockets & accessories":"Подходящие звёздочки и комплектующие", "Complete conveying systems":"Комплексные конвейерные системы", "Roller chains":"Роликовые цепи", "Precision sprockets":"Прецизионные звёздочки", "Mechanical components":"Механические компоненты",
  "Since 2023, QTM Group has served as a regional representative of ContiTech, a leading manufacturer of high-quality industrial power transmission belts.":"С 2023 года QTM Group является региональным представителем ContiTech — ведущего производителя высококачественных промышленных приводных ремней.",
  "QTM gives customers responsive regional access to Continental’s extensive drive-belt portfolio, supporting application review, belt identification and product selection for industrial, agricultural and OEM requirements.":"QTM предоставляет клиентам оперативный региональный доступ к широкому ассортименту приводных ремней Continental и помогает с анализом применения, идентификацией и подбором продукции.",
  "Visit ContiTech":"Посетить ContiTech", "Industrial V-belts":"Промышленные клиновые ремни", "Rubber synchronous belts":"Резиновые синхронные ремни", "Polyurethane timing belts":"Полиуретановые зубчатые ремни",
  "Wrapped, raw-edge and heavy-duty solutions for smooth, reliable power transmission.":"Обёрнутые, формованные и усиленные решения для плавной и надёжной передачи мощности.", "Precision timing belts engineered for durability and accuracy.":"Прецизионные зубчатые ремни, рассчитанные на долговечность и точность.", "Maintenance-free, abrasion-resistant solutions for precise drives.":"Не требующие обслуживания, износостойкие решения для точных приводов.",
  "Since 2026 we are proud to announce QTM Group received authorization from Wilhelm Herm. Müller Group to represent their interests in the region.":"С 2026 года QTM Group с гордостью представляет интересы Wilhelm Herm. Müller Group в регионе на основании официальной авторизации.",
  "Since 2026, QTM Group has been officially authorized by the Wilhelm Herm. Müller Group to represent its products and business interests across the region.":"С 2026 года QTM Group официально уполномочена Wilhelm Herm. Müller Group представлять её продукцию и деловые интересы в регионе.",
  "In 2026, QTM Group was officially authorized by the Wilhelm Herm. Müller Group (WHM) to represent its products and business interests across the region. We are proud to begin this partnership and bring WHM’s advanced drive-technology solutions closer to our customers.":"В 2026 году QTM Group получила официальную авторизацию Wilhelm Herm. Müller Group (WHM) на представление её продукции и деловых интересов в регионе. Мы гордимся этим партнёрством и делаем передовые приводные технологии WHM ближе к нашим клиентам.",
  "Visit WHM":"Посетить WHM", "PU timing-belt systems":"Системы полиуретановых зубчатых ремней", "Synchronous pulleys":"Синхронные шкивы", "Endless drive belts":"Бесконечные приводные ремни",
  "BRECO® and BRECOFLEX® solutions for precision drives and transport.":"Решения BRECO® и BRECOFLEX® для точных приводов и транспортировки.", "Standard and tailor-made components matched to the belt system.":"Стандартные и индивидуальные компоненты, согласованные с ременной системой.", "Homogeneous endless belts with excellent running characteristics.":"Однородные бесконечные ремни с превосходными ходовыми характеристиками.",
  "Industrial solutions across CIS, Central Asia and the Middle East":"Промышленные решения в СНГ, Центральной Азии и на Ближнем Востоке",
  "QUALITY TEAM MANAGEMENT":"QUALITY TEAM MANAGEMENT", "AMMEGA GROUP":"ГРУППА AMMEGA", "AMMEGA GROUP PARTNERS":"ПАРТНЁРЫ ГРУППЫ AMMEGA", "Explore the partnership":"Подробнее о партнёрстве", "Official website":"Официальный сайт", "Global industrial technology. Regional expertise and dependable support.":"Мировые промышленные технологии. Региональная экспертиза и надёжная поддержка.", "Explore":"Разделы"
};

function AutoTranslate({ language }: { language: Language }) {
  useEffect(() => {
    const translate = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      nodes.forEach((node) => {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION"].includes(parent.tagName)) return;
        if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
        const source = originalText.get(node) || "";
        const trimmed = source.trim();
        const translated = language === "ru" ? russianCopy[trimmed] : undefined;
        node.nodeValue = translated ? source.replace(trimmed, translated) : source;
      });
    };
    const apply = (root: Node) => { observer?.disconnect(); translate(root); observer?.observe(document.body, { childList: true, subtree: true, characterData: true }); };
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => apply(mutation.target)));
    translate(document.body);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.documentElement.lang = language;
    return () => observer.disconnect();
  }, [language]);
  return null;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className={`logo ${light ? "logo-light" : ""}`} href="/" aria-label="QTM Group home" data-asset="QTM_LOGO_DARK">
      <img className="header-logo-image" src="/assets/qtm-group-logo-transparent.png" alt="QTM Group" />
    </a>
  );
}

function Button({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <a className={`button ${secondary ? "button-secondary" : ""} ${className}`} href={href}>{children}<Arrow /></a>;
}

function SectionHeading({ number, eyebrow, title, copy, inverse = false }: { number?: string; eyebrow?: string; title: string; copy?: string; inverse?: boolean }) {
  return (
    <div className={`section-heading ${inverse ? "inverse" : ""}`}>
      {(number || eyebrow) && <p className="eyebrow">{number && <b>{number}</b>}{eyebrow}</p>}
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

function Breadcrumbs({ parts, plain=false }: { parts: { label: string; href?: string }[]; plain?: boolean }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{plain?<span>Home</span>:<a href="/">Home</a>}{parts.map((part) => <span key={part.label}><i>/</i>{plain?<strong>{part.label}</strong>:part.href ? <a href={part.href}>{part.label}</a> : <strong>{part.label}</strong>}</span>)}</nav>;
}

function Header({ path, language, onLanguageChange }: { path: string; language: Language; onLanguageChange: (language: Language) => void }) {
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  const [search, setSearch] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [flagTooltip, setFlagTooltip] = useState<{ country: string; x: number; y: number } | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const nav = [
    ["Home", "/"], ["About Us", "/about-us"], ["Products", "/products"], ["Industries", "/industries"],
    ["Suppliers", "/suppliers"], ["Our Network", "/our-network"], ["B2B", "/b2b"], ["Contact Us", "/contact-us"], ["News", "/news"],
  ];
  const regionalFlags = [
    ["am","Armenia"],["ge","Georgia"],["md","Moldova"],
    ["kz","Kazakhstan"],["kg","Kyrgyzstan"],["uz","Uzbekistan"],["tj","Tajikistan"],["tm","Turkmenistan"],["mn","Mongolia"],
    ["sa","Saudi Arabia"],["ae","United Arab Emirates"],["bh","Bahrain"],["om","Oman"],["qa","Qatar"],["eg","Egypt"],["lb","Lebanon"],
  ];

  useEffect(() => {
    const close = (event: MouseEvent) => { if (megaRef.current && !megaRef.current.contains(event.target as Node)) setMega(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => { setMega(false); setMobile(false); setHeaderHidden(false); }, [path]);

  useEffect(() => {
    let previousScroll = Math.max(window.scrollY, 0);
    let frame = 0;

    const updateHeader = () => {
      const currentScroll = Math.max(window.scrollY, 0);
      const difference = currentScroll - previousScroll;

      if (mobile || search || mega || currentScroll < 80) {
        setHeaderHidden(false);
      } else if (difference > 6) {
        setHeaderHidden(true);
      } else if (difference < -6) {
        setHeaderHidden(false);
      }

      previousScroll = currentScroll;
      frame = 0;
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mobile, search, mega]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header${headerHidden ? " header-hidden" : ""}`}>
        <div className="utility"><div className="container utility-inner"><div className="utility-region"><span>Industrial solutions across CIS, Central Asia and the Middle East</span><span className="utility-flags" aria-label="Countries served by QTM Group">{regionalFlags.map(([code,country])=><img className="utility-flag" src={code === "eg" ? "/assets/flags/egypt.svg" : code === "lb" ? "/assets/flags/lebanon.svg" : `https://flagcdn.com/w40/${code}.png`} alt={`${country} flag`} key={country} onMouseEnter={(event)=>setFlagTooltip({country,x:event.clientX,y:event.clientY})} onMouseMove={(event)=>setFlagTooltip({country,x:event.clientX,y:event.clientY})} onMouseLeave={()=>setFlagTooltip(null)}/>)}</span></div><div><a href="mailto:info@qtm-group.com">info@qtm-group.com</a><a href="tel:+37443552522">+374 43 552522</a><label className="language-select"><span className="sr-only">Select language</span><select aria-label="Select language" value={language} onChange={(event)=>onLanguageChange(event.target.value as Language)}><option value="en">EN</option><option value="ru">RU</option></select></label><a href="/b2b">B2B Login</a></div></div></div>
        {flagTooltip && <span className="flag-tooltip" role="tooltip" style={{left:flagTooltip.x+12,top:flagTooltip.y+14}}>{flagTooltip.country}</span>}
        <div className="main-nav" ref={megaRef}>
          <div className="container nav-inner">
            <Logo />
            <nav className="desktop-nav" aria-label="Main navigation">
              {nav.map(([label, href]) => label === "Products" ? (
                <div className="desktop-products" key={label} onMouseLeave={() => setMega(false)}>
                  <button type="button" className={`${path.startsWith("/products") ? "active" : ""}`} aria-expanded={mega} aria-controls="product-mega-menu" onClick={() => setMega(!mega)} onMouseEnter={() => setMega(true)}>{label}<Chevron /></button>
                  {mega && (
                    <nav id="product-mega-menu" className="cascade-menu" aria-label="Product categories">
                      <ul className="cascade-level cascade-level-root">
                        {productFamilies.map((familyItem) => (
                          <li className="cascade-item" key={familyItem.name}>
                            <a href={`/products?category=${slugify(familyItem.name)}`}>{familyItem.name}<CascadeChevron /></a>
                            <ul className="cascade-level cascade-submenu">
                              {familyItem.name === "Power Transmission Belts" ? <>
                                <li className="cascade-item">
                                  <a href="/products/timing-belts">Timing Belts<CascadeChevron /></a>
                                  <ul className="cascade-level cascade-submenu">
                                    {timingBeltTypes.map((item) => <li key={item}><a href={`/products/timing-belts/${slugify(item)}`}>{item}</a></li>)}
                                  </ul>
                                </li>
                                <li className="cascade-item">
                                  <a href="/products/v-belts">V-Belts<CascadeChevron /></a>
                                  <ul className="cascade-level cascade-submenu">
                                    {vBeltFamilies.map((item) => <li key={item.name}><a href={item.href}>{item.name}</a></li>)}
                                  </ul>
                                </li>
                                <li><a href="/products?category=specialty-belts">Specialty Belts</a></li>
                              </> : familyItem.items.map((item) => {
                                const linked = products.find((product) => product.name === item || product.name.replace(" & Components", "") === item);
                                return <li key={item}><a href={linked ? `/products/${linked.slug}` : `/products?category=${slugify(item)}`}>{item}</a></li>;
                              })}
                            </ul>
                          </li>
                        ))}
                        <li className="cascade-all-products"><a href="/products">View all products</a></li>
                      </ul>
                    </nav>
                  )}
                </div>
              ) : <a key={label} className={(href === "/" ? path === "/" : path.startsWith(href)) ? "active" : ""} href={href}>{label}</a>)}
            </nav>
            <div className="nav-actions"><button type="button" className="search-button" aria-label="Open search" onClick={() => setSearch(!search)}>⌕</button><Button href="/request-a-quote" className="header-quote-button">Request a Quote</Button><button className="menu-button" type="button" onClick={() => setMobile(true)} aria-label="Open navigation"><span/><span/><span/></button></div>
          </div>
          {search && <form className="header-search" action="/search"><div className="container"><label htmlFor="header-search">Search products, suppliers and industries</label><input id="header-search" name="q" autoFocus placeholder="Try “timing belt” or “packaging”"/><button type="submit">Search <Arrow /></button><button type="button" aria-label="Close search" onClick={() => setSearch(false)}>×</button></div></form>}
        </div>
      </header>
      <div className={`mobile-drawer ${mobile ? "open" : ""}`} aria-hidden={!mobile}>
        <div className="drawer-head"><Logo/><button onClick={() => setMobile(false)} aria-label="Close navigation">×</button></div>
        <nav aria-label="Mobile navigation">{nav.map(([label, href]) => label === "Products" ? <div className="mobile-accordion" key={label}>
          <button type="button" onClick={() => setMobileProducts(!mobileProducts)} aria-expanded={mobileProducts} aria-controls="mobile-products-tree">Products <Chevron/></button>
          {mobileProducts && <div className="mobile-product-tree" id="mobile-products-tree">
            {productFamilies.map((familyItem) => <details className="mobile-product-family" key={familyItem.name}>
              <summary>{familyItem.name}<CascadeChevron/></summary>
              <div className="mobile-product-children">
                {familyItem.name !== "Power Transmission Belts" && <a className="mobile-view-all" href={`/products?category=${slugify(familyItem.name)}`}>View all {familyItem.name}</a>}
                {familyItem.name === "Power Transmission Belts" ? <>
                  <details className="mobile-product-family mobile-product-subfamily">
                    <summary>Timing Belts<CascadeChevron/></summary>
                    <div className="mobile-product-children">
                      {timingBeltTypes.map((item) => <a key={item} href={`/products/timing-belts/${slugify(item)}`}>{item}</a>)}
                    </div>
                  </details>
                  <details className="mobile-product-family mobile-product-subfamily">
                    <summary>V-Belts<CascadeChevron/></summary>
                    <div className="mobile-product-children">
                      {vBeltFamilies.map((item) => <a key={item.name} href={item.href}>{item.name}</a>)}
                    </div>
                  </details>
                  <a href="/products?category=specialty-belts">Specialty Belts</a>
                </> : familyItem.items.map((item) => {
                  const linked = products.find((product) => product.name === item || product.name.replace(" & Components", "") === item);
                  return <a key={item} href={linked ? `/products/${linked.slug}` : `/products?category=${slugify(item)}`}>{item}</a>;
                })}
              </div>
            </details>)}
            <a className="mobile-all-products" href="/products">View all products</a>
          </div>}
        </div> : <a key={label} href={href}>{label}</a>)}</nav>
        <div className="drawer-language" aria-label="Language"><button className={language === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>English</button><button className={language === "ru" ? "active" : ""} onClick={() => onLanguageChange("ru")}>Русский</button></div>
        <Button href="/request-a-quote">Request a Quote</Button><a className="drawer-login" href="/b2b">B2B Customer Login</a>
      </div>
      {mobile && <button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setMobile(false)}/>} 
    </>
  );
}

function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-clean">
    <div className="footer-brand"><Logo/><p>Global industrial technology. Regional expertise and dependable support.</p></div>
    <div><h3>Contact</h3><a href="mailto:info@qtm-group.com">info@qtm-group.com</a><a href="tel:+37443552522">+374 43 552522</a></div>
    <div><h3>Explore</h3><a href="/products">Products</a><a href="/industries">Industries</a><a href="/our-network">Our Network</a><a href="/suppliers">Suppliers</a></div>
    <div><h3>Support</h3><a href="/request-a-quote">Request a Quote</a><a href="/contact-us">Contact Us</a><a href="/b2b">B2B Login</a></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Quality Team Management</span><div><a href="/privacy-policy">Privacy Policy</a><a href="/cookie-policy">Cookie Policy</a><a href="/terms">Terms</a></div></div></div></footer>;
}

function HomePage() {
  const [videoOpen,setVideoOpen]=useState(false);
  useEffect(()=>{
    const elements=Array.from(document.querySelectorAll<HTMLElement>("[data-home-reveal]"));
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){
      elements.forEach(element=>element.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -9%"});
    elements.forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!videoOpen)return;
    const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==="Escape")setVideoOpen(false)};
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",closeOnEscape);
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener("keydown",closeOnEscape)};
  },[videoOpen]);
  const homePartners = [
    { name: "Megadyne", logo: "/assets/partners/megadyne.svg" },
    { name: "Ammeraal Beltech", logo: "/assets/partners/ammeraal-beltech.svg" },
    { name: "Sampla", logo: "/assets/partners/sampla.svg" },
    { name: "UNI Modular", logo: "/assets/partners/uni.png" },
    { name: "Challenge Power Transmission", logo: "/assets/partners/challenge.png" },
    { name: "Continental / ContiTech", logo: "/assets/partners/continental.png" },
    { name: "Wilhelm Herm. Müller", logo: "/assets/partners/whm.png" },
  ];
  const ammegaBrands = [
    {slug:"ammeraal",name:"Ammeraal Beltech",logo:"/assets/partners/trimmed/ammeraal-beltech.webp",url:"https://ammeraalbeltech.com/",copy:"QTM Group represents Ammeraal Beltech, connecting customers with advanced conveyor, process and high-performance flat-belt solutions for demanding industrial applications.",images:[["/assets/partner-products/ammeraal-synthetic.webp","Synthetic conveyor belts","https://ammeraalbeltech.com/en/products/synthetic-belts/"],["/assets/partner-products/ammeraal-surface.webp","Specialty belt surfaces","https://ammeraalbeltech.com/en/products/synthetic-belts/coating-materials/"]]},
    {slug:"sampla",name:"Sampla",logo:"/assets/partners/trimmed/sampla.webp",url:"https://sampla.com/",copy:"Through Sampla, QTM Group provides reliable conveyor and process belting for food, logistics, packaging and general manufacturing, supported by practical regional product selection.",images:[["/assets/partner-products/sampla-fabcon-r.webp","FABCON fabric conveyor belts","https://sampla.com/item/fabcon/"],["/assets/partner-products/sampla-fabcon-b.webp","FABCON process belts","https://sampla.com/item/fabcon/"]]},
    {slug:"uni",name:"UNI Modular Belts",logo:"/assets/partners/trimmed/uni.webp",url:"https://ammeraalbeltech.com/en/products/modular-belts/",copy:"QTM Group supplies UNI modular belts, sprockets and accessories for hygienic, configurable and efficient conveying systems across food and industrial production.",images:[["/assets/partner-products/uni-straight.webp","Straight-running modular belts","https://ammeraalbeltech.com/en/products/modular-belts/straight-running/"],["/assets/partner-products/uni-flex.webp","Side-flexing modular belts","https://ammeraalbeltech.com/en/products/modular-belts/side-flexing-belts/"]]},
    {slug:"challenge",name:"Challenge Power Transmission",logo:"/assets/partners/trimmed/challenge.webp",url:"https://www.challengept.com/",copy:"QTM Group represents Challenge Power Transmission with an extensive portfolio of roller chains, sprockets and mechanical power transmission components for industrial maintenance and OEM requirements.",images:[["/assets/partner-products/challenge-chain.webp","Industrial roller chains","https://www.challengept.com/products/rollerChain.php"],["/assets/partner-products/challenge-sprocket.webp","Precision sprockets","https://www.challengept.com/products/bsSprockets.php"]]},
  ];
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow"><b>QTM GROUP</b>QUALITY TEAM MANAGEMENT</p><h1>Industrial Solutions. <em>Delivered Regionally.</em></h1><p>QTM Group is a leading regional supplier of, industrial, agricultural and conveyor belts. In addition to belting solutions, we provide roller chains, sprockets, bearings, and a comprehensive range of industrial spare parts.</p><div className="button-row"><Button href="/products">Check Our Products</Button></div></div>
      <div className="hero-media" role="img" aria-label="Industrial power transmission belts operating inside a factory" />
    </section>
    <section className="section partnership-story"><div className="container"><div className="section-heading megapartner-heading"><img src="/assets/megapartner-heading.png" alt="MegaPartner" /></div><div className="principal-partnership-stack">
      <article className="principal-partnership megadyne-partnership" data-home-reveal>
        <div className="principal-brand-head reversed"><div className="brand-head-copy"><p className="megadyne-partnership-statement">QTM Group is proud to be MegaPartner and trusted regional distributor of Megadyne power transmission products.</p><p>Our partnership connects Megadyne’s broad industrial portfolio with regional distributors, OEMs, maintenance teams and end users. QTM supports product identification, technical selection, commercial coordination and dependable follow-up for demanding power transmission applications.</p><a className="text-link" href="https://megadynegroup.com/en/" target="_blank" rel="noreferrer">Visit Megadyne <Arrow/></a></div><div className="principal-logo-stage megapartner-stage"><iframe className="megapartner-animation-frame" src="/megapartner-drive.html" title="MegaPartner and QTM belt-driven gear animation" loading="eager"/></div></div>
        <div className="megadyne-logo-stage-swapped"><a className="megadyne-logo-link" href="https://megadynegroup.com/en/" target="_blank" rel="noreferrer" aria-label="Visit Megadyne official website"><img src="/assets/partners/megadyne.svg" alt="Megadyne logo"/></a></div>
        <div className="principal-products">
          <figure><a className="principal-product-link" href="https://megadynegroup.com/en/products/timing-belts/rubber-endless/" target="_blank" rel="noreferrer" aria-label="View MEGASYNC Rubber belts on the official Megadyne website"><div className="product-visual"><img src="/assets/partnership-megadyne-rubber-new.png" alt="Megadyne MEGASYNC Rubber timing belts"/></div></a><figcaption><b>MEGASYNC™ Rubber belts</b><span>High-performance synchronous solutions for precision and demanding industrial drives.</span></figcaption></figure>
          <figure><a className="principal-product-link" href="https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/" target="_blank" rel="noreferrer" aria-label="View polyurethane timing belts on the official Megadyne website"><div className="product-visual"><img src="/assets/partnership-megadyne-pu-new.png" alt="Megadyne polyurethane timing belts"/></div></a><figcaption><b>Polyurethane timing belts</b><span>Wear-resistant belt technology for accurate, clean and efficient power transmission.</span></figcaption></figure>
          <figure><a className="principal-product-link" href="https://megadynegroup.com/en/products/v-belts/" target="_blank" rel="noreferrer" aria-label="View V-belts on the official Megadyne website"><div className="product-visual"><img src="/assets/partnership-megadyne-vbelts-extra.png" alt="Megadyne EXTRA V-belts"/></div></a><figcaption><b>V-belt</b><span>Reliable, versatile power transmission for industrial drives across a broad range of applications.</span></figcaption></figure>
        </div>
        <figure className="megadyne-launch-banner"><a className="megadyne-launch-link" href="https://megadynegroup.com/en/products/v-belts/rubber-raw-edge/megav-dynamic-max/" target="_blank" rel="noreferrer" aria-label="View MEGAV Dynamic-MAX on the official Megadyne website"><img src="/assets/megadyne-dynamic-max-feature.png" alt="New Megadyne MEGAV Dynamic-MAX belts" /></a></figure>
        <div className="megadyne-video-feature">
          <button className="megadyne-video-preview" type="button" onClick={()=>setVideoOpen(true)} aria-label="Play the MEGAV Dynamic-MAX product video">
            <img src="https://i.ytimg.com/vi/IylNg8HXlbs/maxresdefault.jpg" alt="MEGAV Dynamic-MAX product video preview"/>
            <span className="megadyne-video-play" aria-hidden="true"><span className="play-triangle"/></span>
          </button>
        </div>
      </article>
      <div className="ammega-introduction" data-home-reveal>
        <h3>In addition to Megadyne, QTM Group represents other leading brands within the <a className="ammega-inline-link" href="https://ammega.com/" target="_blank" rel="noreferrer">AMMEGA Group</a>, including...</h3>
      </div>
      {ammegaBrands.map((brand)=><article className={`principal-partnership ammega-partnership ammega-${brand.slug}`} key={brand.name} data-home-reveal>
        <div className="ammega-brand-logo"><a href={brand.url} target="_blank" rel="noreferrer" aria-label={`Visit ${brand.name}`}><img src={brand.logo} alt={`${brand.name} logo`}/></a></div>
        <div className="ammega-brand-content"><div><p>{brand.copy}</p><p>Customers benefit from QTM’s regional communication, product identification, application review and commercial coordination.</p><a className="text-link" href={brand.url} target="_blank" rel="noreferrer">Visit {brand.name} <Arrow/></a></div><div className="ammega-products">{brand.images.map(([image,label,productUrl])=><figure key={label}><a className="ammega-product-link" href={productUrl} target="_blank" rel="noreferrer" aria-label={`View ${label} on the official ${brand.name} website`}><img src={image} alt={`${brand.name} ${label}`}/></a><figcaption>{label}</figcaption></figure>)}</div></div>
      </article>)}
      <article className="principal-partnership contitech-partnership" data-home-reveal>
        <div className="principal-logo-stage"><a className="principal-logo-link" href="https://www.continental-industry.com/global/en" target="_blank" rel="noreferrer" aria-label="Visit ContiTech official website"><img src="/assets/partners/continental.png" alt="Continental ContiTech logo"/></a></div>
        <div className="principal-copy single-copy"><div><p>Since 2023, QTM Group has served as a regional representative of ContiTech, a leading manufacturer of high-quality industrial power transmission belts.</p><p>QTM gives customers responsive regional access to Continental’s extensive drive-belt portfolio, supporting application review, belt identification and product selection for industrial, agricultural and OEM requirements.</p><a className="text-link" href="https://www.continental-industry.com/global/en" target="_blank" rel="noreferrer">Visit ContiTech <Arrow/></a></div></div>
        <div className="principal-products"><figure><a className="principal-product-link" href="https://www.continental-industry.com/global/en/products-solutions/power-transmission/v-belts" target="_blank" rel="noreferrer" aria-label="View industrial V-belts on the official Continental website"><div className="product-visual"><img src="/assets/partnership-conti-v.jpg" alt="Continental industrial V-belt construction"/></div></a><figcaption><b>Industrial V-belts</b><span>Wrapped, raw-edge and heavy-duty solutions for smooth, reliable power transmission.</span></figcaption></figure><figure><a className="principal-product-link" href="https://www.continental-industry.com/global/en/products-solutions/power-transmission/synchronous-belts-rubber" target="_blank" rel="noreferrer" aria-label="View rubber synchronous belts on the official Continental website"><div className="product-visual"><img src="/assets/partnership-conti-rubber.jpg" alt="Continental rubber synchronous belt construction"/></div></a><figcaption><b>Rubber synchronous belts</b><span>Precision timing belts engineered for durability and accuracy.</span></figcaption></figure><figure><a className="principal-product-link" href="https://www.continental-industry.com/global/en/products-solutions/power-transmission/synchronous-belts-pu" target="_blank" rel="noreferrer" aria-label="View polyurethane timing belts on the official Continental website"><div className="product-visual"><img src="/assets/partnership-conti-pu.jpg" alt="Continental polyurethane synchronous belts"/></div></a><figcaption><b>Polyurethane timing belts</b><span>Maintenance-free, abrasion-resistant solutions for precise drives.</span></figcaption></figure></div>
      </article>
      <article className="principal-partnership whm-partnership" data-home-reveal>
        <div className="principal-logo-stage"><a className="principal-logo-link" href="https://whm.net/en/" target="_blank" rel="noreferrer" aria-label="Visit Wilhelm Herm. Müller official website"><img src="/assets/partners/whm.png" alt="Wilhelm Herm. Müller logo"/></a></div>
        <div className="whm-content-grid">
          <div className="principal-copy whm-copy"><div><p>Since 2026 we are proud to announce QTM Group received authorization from Wilhelm Herm. Müller Group to represent their interests in the region.</p><p>In 2026, QTM Group was officially authorized by the Wilhelm Herm. Müller Group (WHM) to represent its products and business interests across the region. We are proud to begin this partnership and bring WHM’s advanced drive-technology solutions closer to our customers.</p><a className="text-link" href="https://whm.net/en/" target="_blank" rel="noreferrer">Visit WHM <Arrow/></a></div></div>
          <figure className="whm-product-showcase">
            <div className="whm-product-art">
              <img src="/assets/whm-breco-timing-belts.png" alt="BRECOFLEX and BRECO polyurethane timing belts"/>
              <a className="whm-logo-hit whm-logo-hit-brecoflex" href="https://www.brecoflex.com/" target="_blank" rel="noreferrer" aria-label="Visit the official BRECOFLEX website"/>
              <a className="whm-logo-hit whm-logo-hit-breco" href="https://www.breco.de/" target="_blank" rel="noreferrer" aria-label="Visit the official BRECO website"/>
            </div>
          </figure>
        </div>
      </article>
    </div></div></section>
    <section className="home-partners" aria-labelledby="partners-title" data-home-reveal><div className="container"><p className="partners-title" id="partners-title">Our Partners</p></div><div className="partner-marquee" aria-label="QTM partner brands"><div className="partner-marquee-track">{[...homePartners, ...homePartners].map((partner,index) => <div className="partner-logo-item" key={`${partner.name}-${index}`} aria-hidden={index >= homePartners.length}><img src={partner.logo} alt={index < homePartners.length ? `${partner.name} logo` : ""}/></div>)}</div></div></section>
    <div className="home-final-reveal" data-home-reveal><FinalCta/></div>
    {videoOpen&&<div className="video-modal" role="dialog" aria-modal="true" aria-label="MEGAV Dynamic-MAX product video" onMouseDown={(event)=>{if(event.target===event.currentTarget)setVideoOpen(false)}}>
      <div className="video-modal-content">
        <button className="video-modal-close" type="button" onClick={()=>setVideoOpen(false)} aria-label="Close video" autoFocus>×</button>
        <div className="video-modal-frame"><iframe src="https://www.youtube-nocookie.com/embed/IylNg8HXlbs?autoplay=1&rel=0" title="MEGAV Dynamic-MAX product video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
      </div>
    </div>}
  </>;
}

function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return <article className={`product-card ${featured ? "featured" : ""}`}><div className="product-image-frame"><a className="product-image" href={`/products/${product.slug}`} style={{backgroundImage:`url(${product.image})`}} aria-label={`View ${product.name}`}/></div><div className="product-card-body"><p className="mono-label">{product.family}</p><h3><a href={`/products/${product.slug}`}>{product.name}</a></h3><p>{product.description}</p><div className="product-meta"><span>{product.subcategories.length} subcategories</span><span>{product.suppliers.slice(0,2).join(" · ")}</span></div><a className="text-link" href={`/products/${product.slug}`}>Explore <Arrow/></a></div></article>;
}

function FinalCta() { return <section className="final-cta"><div className="container"><p className="eyebrow"><b>START A CONVERSATION</b></p><h2>Need a Product, Replacement or Technical Solution?</h2><div className="button-row"><Button href="/request-a-quote">Request a Quote</Button><Button href="/product-identification" secondary>Send Product Details</Button><a className="text-link light" href="/contact-us">Contact QTM <Arrow/></a></div></div></section>; }

function SupportBlock(){return <article className="about-story-closing"><div><p className="eyebrow"><b>RESPONSIVE SUPPORT</b></p><p>With a strong commitment to quality, reliability, and customer satisfaction, the QTM Group team provides responsive technical and commercial assistance 24/7.</p></div><Button href="/contact-us">Contact QTM</Button></article>}

function PageHero({ eyebrow, title, copy, parts, plainBreadcrumbs=false }: { eyebrow: string; title: string; copy: string; parts: {label:string;href?:string}[]; plainBreadcrumbs?:boolean }) { return <section className="page-hero"><div className="container"><Breadcrumbs parts={parts} plain={plainBreadcrumbs}/><p className="eyebrow"><b>{eyebrow}</b></p><h1>{title}</h1><p>{copy}</p></div></section>; }

function AboutPage() {
  const aboutIndustries = ["Oil & Gas","Packaging","Tobacco","Food & Beverage","Paper & Printing","Agriculture","Automotive & Tire","Mining","Stone & Ceramics","Glass","Wood Processing","Material Handling & Logistics","Elevators","Textile","Recycling","Airports & Baggage Handling","Robotics & Automation"];
  useEffect(()=>{
    const elements=Array.from(document.querySelectorAll<HTMLElement>("[data-about-reveal]"));
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){
      elements.forEach(element=>element.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -9%"});
    elements.forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[]);
  return <>
    <section className="about-intro">
      <div className="about-hero-copy"><Breadcrumbs parts={[{label:"About Us"}]}/><h1>Welcome to QTM</h1><p>Established in 2020, QTM Group (Quality Team Management) is a trusted provider of industrial power transmission and conveying solutions across Central Asia, the Middle East, and the CIS region.</p></div>
      <div className="about-hero-media"><img src="/assets/about-qtm-warehouse.png" alt="QTM industrial belt warehouse" /></div>
    </section>
    <section className="section about-story-section">
      <div className="container about-story-grid">
        <header className="about-story-masthead" data-about-reveal>
          <h2 className="about-story-title">About Us</h2>
        </header>
        <article className="about-story-feature" data-about-reveal>
          <figure className="about-story-image"><img src="/assets/about-team-working.webp" alt="Technical specialists inspect an industrial belt" /></figure>
          <div className="about-story-copy"><p className="eyebrow"><b>WHAT WE SUPPLY</b></p><h3>Proven products for demanding industries.</h3><p>We specialize in supplying high-quality industrial and agricultural belts, industrial spare parts, and tailored technical solutions. Through strategic partnerships with leading global manufacturers, we deliver proven products to regional distributors, resellers, OEMs, and end users across a broad range of industries.</p><a className="text-link about-products-link" href="/products">View Our Products <Arrow/></a></div>
        </article>
        <article className="about-story-feature about-industries-feature" data-about-reveal>
          <div className="about-industries-gallery" aria-label="QTM Group industries and factory applications">
            <figure className="about-industries-tile about-industries-overview"><img src="/assets/about-industries-overview-cool-v1.webp" alt="Overview of industrial applications supported by QTM Group" /></figure>
            <figure className="about-industries-tile"><img src="/assets/about-qtm-bobst-safety-cool-v1.webp" alt="QTM Group specialists wearing protective hard hats at a BOBST packaging and printing line" /></figure>
            <figure className="about-industries-tile"><img src="/assets/about-industry-paper-cool-v1.webp" alt="QTM Group team at a paper production line" /></figure>
            <figure className="about-industries-tile"><img src="/assets/about-industry-tobacco-cool-v1.webp" alt="QTM Group team at a HUANI tobacco production line" /></figure>
            <figure className="about-industries-tile"><img src="/assets/about-industry-ceramics-cool-v1.webp" alt="QTM Group team at a BMR ceramics production line" /></figure>
            <figure className="about-industries-tile"><img src="/assets/about-industry-beverage-v1.webp" alt="QTM Group team at a KHS beverage production line" /></figure>
          </div>
          <div className="about-story-copy about-industries-copy">
            <p className="eyebrow"><b>INDUSTRIES WE SERVE</b></p>
            <h3>Belting solutions across critical industries.</h3>
            <p>QTM Group’s core business is supplying industrial, power transmission, and conveyor belt solutions across a wide range of industries:</p>
            <ul className="about-industry-list">{aboutIndustries.map(industry=><li key={industry}><a href={`/industries/${slugify(industry)}`}>{industry}</a></li>)}</ul>
            <p>We support these industries with reliable solutions for power transmission, conveying, processing, production lines, automated systems, and material handling applications, working with leading international belt manufacturers and industrial partners.</p>
            <a className="text-link about-industries-link" href="/industries">View All Industries <Arrow/></a>
          </div>
        </article>
        <article className="about-story-feature about-story-feature-reverse about-support-feature" data-about-reveal>
          <figure className="about-story-image"><img src="/assets/about-business-meeting.webp" alt="Business professionals discussing technical plans around a conference table" /></figure>
          <div className="about-story-copy"><p className="eyebrow"><b>HOW WE SUPPORT</b></p><h3>International quality, delivered with regional confidence.</h3><p>Our strength lies in combining international product quality with regional market expertise, dependable logistics, and professional technical support. We work closely with our customers to identify the right solutions, ensure timely delivery, reduce operational downtime, and support long-term business success.</p></div>
        </article>
        <article className="about-story-closing" data-about-reveal><div><p className="eyebrow"><b>RESPONSIVE SUPPORT</b></p><p>With a strong commitment to quality, reliability, and customer satisfaction, the QTM Group team provides responsive technical and commercial assistance 24/7.</p></div><Button href="/contact-us">Contact QTM</Button></article>
      </div>
    </section>
  </>;
}

function ProductCatalogue() {
  const params = useSearchParams();
  const requestedCategory = params.get("category") || "";
  const categoryFamily = productFamilies.find((entry) =>
    slugify(entry.name) === requestedCategory || entry.items.some((item) => slugify(item) === requestedCategory)
  );
  const categoryProduct = products.find((product) =>
    product.slug === requestedCategory || slugify(product.name) === requestedCategory
  );
  const initialFamily = categoryFamily?.name || categoryProduct?.family || "All categories";
  const [query,setQuery]=useState(""); const [family,setFamily]=useState(initialFamily); const [supplier,setSupplier]=useState("All suppliers"); const [industry,setIndustry]=useState("All industries"); const [material,setMaterial]=useState("All materials"); const [application,setApplication]=useState("");

  useEffect(() => { setFamily(initialFamily); }, [initialFamily]);

  const changeFamily = (value: string) => {
    setFamily(value);
    const url = new URL(window.location.href);
    if (value === "All categories") url.searchParams.delete("category");
    else url.searchParams.set("category", slugify(value));
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const filtered=products.filter(p => p.family!=="Mechanical Power Transmission" && (!query || `${p.name} ${p.description} ${p.subcategories.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && (family==="All categories" || p.family===family) && (supplier==="All suppliers" || p.suppliers.some(s=>s.includes(supplier))) && (industry==="All industries" || p.industries.includes(industry)) && (material==="All materials" || p.materials.includes(material)) && (!application || `${p.industries.join(" ")} ${p.description}`.toLowerCase().includes(application.toLowerCase())));
  const materials=[...new Set(products.flatMap(p=>p.materials))].sort();
  return <><div className="catalogue-controls"><label className="catalogue-search"><span>Search catalogue</span><input name="catalogue-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Product, profile or subcategory"/></label><label><span>Product category</span><select name="family-filter" value={family} onChange={e=>changeFamily(e.target.value)}><option>All categories</option>{productFamilies.map(f=><option key={f.name}>{f.name}</option>)}</select></label><label><span>Supplier</span><select name="supplier-filter" value={supplier} onChange={e=>setSupplier(e.target.value)}><option>All suppliers</option>{["Megadyne","Continental","Ammeraal Beltech","Sampla","Challenge Power Transmission","Wilhelm Herm. Müller"].map(s=><option key={s}>{s}</option>)}</select></label><label><span>Industry</span><select name="industry-filter" value={industry} onChange={e=>setIndustry(e.target.value)}><option>All industries</option>{industries.map(i=><option key={i.slug}>{i.name}</option>)}</select></label><label><span>Belt material</span><select name="material-filter" value={material} onChange={e=>setMaterial(e.target.value)}><option>All materials</option>{materials.map(m=><option key={m}>{m}</option>)}</select></label><label><span>Application</span><input name="application-filter" value={application} onChange={e=>setApplication(e.target.value)} placeholder="e.g. packaging"/></label></div><div className="catalogue-results-head"><p className="results-count">{filtered.length} product categories</p>{family!=="All categories"&&<button type="button" onClick={()=>changeFamily("All categories")}>Clear {family} filter</button>}</div><div className="catalogue-grid">{filtered.map(p=><ProductCard key={p.slug} product={p}/>)}</div>{filtered.length===0&&<div className="empty-state"><h3>No exact match found</h3><p>Try a broader term, or send the product details to QTM for identification.</p><Button href="/product-identification">Ask QTM</Button></div>}</>;
}

function ProductsPage() { return <><PageHero eyebrow="PRODUCT PORTFOLIO" title="Industrial Solutions, Organized Around Your Application" copy="Search and filter QTM’s multi-brand portfolio by product, supplier or industry. Exact specifications are confirmed for each inquiry." parts={[{label:"Products"}]}/><section className="section"><div className="container"><ProductCatalogue/></div></section><FinalCta/></>; }

const timingOverviewFamilies=[
  {name:"Polyurethane Open End",href:"/products/timing-belts/polyurethane-open-end",image:"/assets/partnership-megadyne-open.png",copy:"Open-length polyurethane belts for linear motion, positioning and synchronized conveying."},
  {name:"Polyurethane Endless",href:"/products/timing-belts/polyurethane-endless",image:"/assets/products/polyurethane-endless-hero-red-synchroflex.png",copy:"Moulded, truly endless and high-performance PU belts for precise power transmission."},
  {name:"Rubber Open End",href:"/products/timing-belts/rubber-open-end",image:"/assets/partnership-megadyne-open.png",copy:"Rubber open-length belts for reversing drives, accurate movement and controlled linear systems."},
  {name:"Rubber Endless",href:"/products/timing-belts/rubber-endless",image:"/assets/partnership-megadyne-rubber-new.png",copy:"Classic and high-power synchronous rubber belts for industrial drive applications."},
] as const;

const vBeltFamilies=[
  {name:"Rubber Wrapped",href:"/products/v-belts/rubber-wrapped",image:"/assets/partnership-megadyne-vbelts-new.png",copy:"Traditional wrapped-construction V-belts for established machinery and broad industrial drive applications."},
  {name:"Rubber Banded",href:"/products/v-belts/rubber-banded",image:"/assets/partnership-megadyne-vbelts-extra.png",copy:"Multiple V-belts bonded together for synchronized multi-row power transmission."},
] as const;

function useTimingReveal(){useEffect(()=>{const elements=Array.from(document.querySelectorAll<HTMLElement>("[data-timing-reveal]"));if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){elements.forEach(element=>element.classList.add("is-visible"));return}const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:"0px 0px -9%"});elements.forEach(element=>observer.observe(element));return()=>observer.disconnect()},[])}

function TimingBeltsPage(){
  const product=findProduct("timing-belts"); useTimingReveal(); if(!product)return <NotFound/>;
  return <>
    <section className="timing-overview-hero"><div className="container timing-overview-hero-grid">
      <div className="timing-overview-copy" data-timing-reveal><Breadcrumbs parts={[{label:"Products",href:"/products"},{label:"Power Transmission Belts",href:"/products?category=power-transmission-belts"},{label:"Timing Belts"}]}/><p className="eyebrow"><b>POWER TRANSMISSION BELTS</b></p><h1>Timing Belts</h1><p>Rubber and polyurethane synchronous belts selected for precise motion, reliable engagement and clean power transmission across industrial machinery.</p><div className="button-row"><Button href="/request-a-quote?product=timing-belts">Request a Quote</Button><Button href="/product-identification?product=timing-belts" secondary>Identify a Belt</Button></div></div>
      <div className="timing-hero-stage" aria-label="Timing belt product families"><div className="timing-hero-rings" aria-hidden="true"><span/><span/></div><figure className="timing-hero-main"><img src="/assets/hero.png" alt="Industrial timing belt range"/></figure><a className="timing-floating-card timing-floating-card-red" href="/products/timing-belts/rubber-endless"><span>Rubber Endless</span><img src="/assets/partnership-megadyne-rubber-new.png" alt="Rubber endless timing belt"/></a><a className="timing-floating-card timing-floating-card-light" href="/products/timing-belts/polyurethane-endless"><span>PU Endless</span><img src="/assets/products/polyurethane-endless-hero-red-synchroflex.png" alt="Polyurethane endless timing belt"/></a><div className="timing-hero-stat"><strong>4</strong><span>Timing belt groups</span></div><div className="timing-profile-pulse" aria-hidden="true"><span>AT</span><span>T</span><span>HTD</span><span>RPP</span></div></div>
    </div></section>
    <section className="section timing-overview-types" data-timing-reveal><div className="container"><div className="openend-section-head"><p className="eyebrow"><b>PRODUCT RANGE</b></p><h2>Choose the timing belt construction.</h2><p>QTM connects customers with open-length, endless, polyurethane and rubber timing-belt solutions from leading manufacturers.</p></div><div className="timing-type-grid">{timingOverviewFamilies.map(item=><a className="timing-type-card" href={item.href} key={item.name}><figure><img src={item.image} alt={`${item.name} timing belt range`} loading="lazy" decoding="async"/></figure><div><h3>{item.name}</h3><p>{item.copy}</p></div><Arrow/></a>)}</div></div></section>
    <section className="timing-overview-dark" data-timing-reveal><div className="container timing-overview-dark-grid"><div><p className="eyebrow"><b>SELECTION SUPPORT</b></p><h2>Matched around the machine, load and operating environment.</h2><p>QTM helps compare material, profile, tension member, backing and surface options before final product selection.</p></div><div className="timing-support-list">{["Application review","Belt identification","Profile matching","Coatings and cleats","Pulley compatibility","Regional supply support"].map(item=><span key={item}>{item}</span>)}</div></div></section>
    <section className="section timing-profile-strip" data-timing-reveal><div className="container"><div className="openend-section-head"><p className="eyebrow"><b>COMMON PROFILES</b></p><h2>Broad profile coverage for industrial drives.</h2><p>Availability covers compact pitch belts, metric profiles, double-sided constructions and high-performance tooth forms.</p></div><div className="profile-grid">{product.profiles?.map(profile=><code key={profile}>{profile}</code>)}</div></div></section>
    <section className="section timing-overview-support"><div className="container"><SupportBlock/></div></section>
  </>;
}

function VBeltsPage(){useTimingReveal();return <>
  <section className="timing-overview-hero"><div className="container timing-overview-hero-grid"><div className="timing-overview-copy" data-timing-reveal><Breadcrumbs parts={[{label:"Products",href:"/products"},{label:"Power Transmission Belts",href:"/products?category=power-transmission-belts"},{label:"V-Belts"}]}/><p className="eyebrow"><b>POWER TRANSMISSION BELTS</b></p><h1>V-Belts</h1><p>Classical, narrow and specialized V-belt profiles for reliable power transmission across industrial machinery, agricultural equipment and adjustable-speed drives.</p><div className="button-row"><Button href="/request-a-quote?product=v-belts">Request a Quote</Button><Button href="/product-identification?product=v-belts" secondary>Identify a Belt</Button></div></div><div className="timing-hero-stage" aria-label="V-belt product families"><div className="timing-hero-rings" aria-hidden="true"><span/><span/></div><figure className="timing-hero-main"><img src="/assets/partnership-megadyne-vbelts-new.png" alt="V-belt product portfolio"/></figure></div></div></section>
  <section className="section"><div className="container"><SectionHeading eyebrow="V-BELT CATEGORIES" title="Select a V-Belt Type"/><div className="catalogue-grid">{vBeltFamilies.map(item=><a href={item.href} className="product-card" key={item.href}><div className="product-card-visual" style={{backgroundImage:`url(${item.image})`}} role="img" aria-label={item.name}/><div className="product-card-copy"><h3>{item.name}</h3><p>{item.copy}</p></div><span className="product-card-arrow"><Arrow/></span></a>)}</div></div></section><FinalCta/>
</>}

const vBeltImage="/assets/partnership-megadyne-vbelts-new.png";
const vBeltDetailPages={
  "rubber-wrapped":{titleTop:"Rubber",titleBottom:"Wrapped V-Belts",eyebrow:"",quote:"v-belts",heroImage:"/assets/partnership-megadyne-vbelts-new.png",heroCopy:["Time-Proven Wrapped V-Belts - Sourced Through QTM","Rubber wrapped V-belts remain the standard choice for industrial power transmission worldwide, delivering consistent and dependable performance across thousands of established applications.","A textile wrap cover protects the rubber body against abrasion, oil and heat, while the internal cord provides reliable tensile strength across classical and narrow sections alike.","Through QTM, customers can access the Megadyne wrapped range: Oleostatic Gold, Oleostatic, Extra, Esaflex and XDV2/MXV."],profileTitle:"Rubber Wrapped Profile Range",profileCopy:"Standard wrapped sections covering light-duty to heavy industrial drives.",families:[{family:"Oleostatic Gold",official:"https://megadynegroup.com/en/products/v-belts/rubber-wrapped/oleostatic-gold/",linkImage:"/assets/partnership-megadyne-vbelts-new.png",description:"Premium classical wrapped V-belt with oil- and heat-resistant compounds for demanding industrial drives.",profiles:["Z","A","B","C","D"]},{family:"Oleostatic",official:"https://megadynegroup.com/en/products/v-belts/rubber-wrapped/oleostatic/",linkImage:"/assets/partnership-megadyne-vbelts-new.png",description:"Standard classical wrapped V-belt offering reliable oil- and heat-resistant performance for general industrial use.",profiles:["Z","A","B","C","D","E"]},{family:"Extra",official:"https://megadynegroup.com/en/products/v-belts/rubber-wrapped/extra/",linkImage:"/assets/partnership-megadyne-vbelts-extra.png",description:"Wrapped narrow-section V-belt built for higher power density in compact industrial and agricultural drives.",profiles:["SPZ","SPA","SPB","SPC"]},{family:"Esaflex",official:"https://megadynegroup.com/en/products/v-belts/rubber-wrapped/esaflex/",linkImage:"/assets/partnership-megadyne-vbelts-new.png",description:"Flexible wrapped narrow V-belt engineered for smooth running and dependable service life on standard drives.",profiles:["SPZ","SPA","SPB","SPC"]},{family:"XDV2/MXV",official:"https://megadynegroup.com/en/products/v-belts/rubber-wrapped/xdv2-mxv/",linkImage:"/assets/partnership-megadyne-vbelts-new.png",description:"Wrapped variable-speed V-belt for adjustable-pulley transmission systems requiring smooth, continuous speed control.",profiles:["XDV2","MXV"]}],benefits:["Proven reliability in industrial equipment","Protective textile cover","Cost-effective operation","Easy maintenance and replacement","Wide pulley compatibility"]},
  "rubber-banded":{titleTop:"Rubber",titleBottom:"Banded V-Belts",eyebrow:"",quote:"v-belts",heroImage:"/assets/partnership-megadyne-vbelts-extra.png",heroCopy:["Synchronized Multi-Belt Drives - Sourced Through QTM","Rubber banded V-belts consist of multiple individual belts rigidly bonded together along their length, keeping the strands aligned through demanding multi-pulley drive systems.","Factory-bonded construction helps the belts share load evenly, reducing slippage and uneven wear compared with loose multi-belt sets.","Through QTM, customers can access the Megadyne Rubber Pluriband range for heavy-duty machinery and industrial power transmission."],profileTitle:"Rubber Banded Profile Range",profileCopy:"Bonded multi-belt sections available across classical and narrow profiles.",families:[{family:"Rubber Pluriband",official:"https://megadynegroup.com/en/products/v-belts/rubber-banded/pluriband/",linkImage:"/assets/partnership-megadyne-vbelts-extra.png",description:"Factory-bonded multi-belt construction for synchronized power transmission across heavy-duty, multi-pulley drive systems.",profiles:["Banded A","Banded B","Banded C","Banded SPA","Banded SPB","Banded SPC"]}],benefits:["Perfect synchronization","Even load distribution","No belt slippage","Consistent power transmission","Reduced maintenance"]},
} as const;

type VBeltDetailSlug=keyof typeof vBeltDetailPages;
function VBeltDetailPage({slug}:{slug:VBeltDetailSlug}){const page=vBeltDetailPages[slug];useEffect(()=>{const elements=Array.from(document.querySelectorAll<HTMLElement>("[data-openend-reveal]"));if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){elements.forEach(element=>element.classList.add("is-visible"));return}const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:"0px 0px -8%"});elements.forEach(element=>observer.observe(element));return()=>observer.disconnect()},[]);return <>
  <section className="openend-hero openend-hero--brand-split"><div className="openend-hero-copy"><Breadcrumbs plain parts={[{label:"Products",href:"/products"},{label:"V-Belts",href:"/products/v-belts"},{label:`${page.titleTop} ${page.titleBottom}`}]}/>{page.eyebrow&&<p className="eyebrow"><b>{page.eyebrow}</b></p>}<h1>{page.titleTop}<br/>{page.titleBottom}</h1><figure className="openend-mobile-hero-media"><img src={page.heroImage} alt={`${page.titleTop} ${page.titleBottom} belt portfolio`}/></figure><div className="openend-hero-description">{page.heroCopy.map((paragraph,index)=><p className={index===0?"lead":undefined} key={paragraph}>{paragraph}</p>)}</div><details className="openend-mobile-overview"><summary>More about this range <Chevron/></summary><div>{page.heroCopy.slice(2).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></details><div className="button-row"><a className="hero-quote-link" href={`/request-a-quote?product=${page.quote}`}>Request a Quote <Arrow/></a></div></div><figure className="openend-hero-media"><img src={page.heroImage} alt={`${page.titleTop} ${page.titleBottom} by Megadyne`}/></figure></section>
  <section className="section openend-profiles" data-openend-reveal><div className="container"><div className="openend-section-head"><p className="eyebrow"><b>PROFILE RANGE</b></p><h2>{page.profileTitle}</h2><p>{page.profileCopy}</p></div><div className="openend-profiles-intro"><h2>Profiles</h2><p>With our extensive selection of <strong>V-belts</strong>, QTM covers most of the profiles commonly used across the <strong>belting industry</strong>, providing solutions for a wide range of industrial applications.</p></div><div className="openend-profile-catalog">{page.families.map(family=>"sectionHeader" in family?<div className={`vbelt-megav-heading${family.sectionHeader.toLowerCase().includes("continental")?" vbelt-conti-heading":""}`} key={family.sectionHeader}><span>{family.sectionHeader.toLowerCase().includes("continental")?"Continental Raw Edge Range":"Premium Raw Edge Platform"}</span><h3>{family.sectionHeader}</h3><p>{family.sectionCopy}</p></div>:<section className="openend-profile-family" key={family.family}><div className="openend-profile-family-head"><h3>{family.family}</h3>{family.badge&&<span className="vbelt-new-badge">{family.badge}</span>}</div><a className={`openend-profile-official openend-profile-official--media${family.badge?" vbelt-new-product-link":""}`} href={family.official} target="_blank" rel="noreferrer"><span className="openend-profile-link-image"><img src={family.linkImage} alt="" loading="lazy" decoding="async"/></span><span className="openend-profile-link-copy"><strong>{family.family}</strong><span>{family.description}</span></span><Arrow/></a><div className="openend-profile-picture-grid">{family.profiles.map(profile=>{const profileName=Array.isArray(profile)?profile[0]:profile;const profileImage=Array.isArray(profile)?profile[1]:family.linkImage;return <figure key={`${family.family}-${profileName}`}><img src={profileImage} alt={`${family.family} ${profileName} V-belt profile`} loading="lazy" decoding="async"/><figcaption>{profileName}</figcaption></figure>})}</div></section>)}</div></div></section>
  <section className="dark-feature" data-openend-reveal><div className="container detail-columns"><div><SectionHeading eyebrow="KEY ADVANTAGES" title="Why Choose These V-Belts" inverse/><p>Each V-belt type is engineered for specific performance requirements and operating conditions.</p></div><div className="dark-list">{page.benefits.map(item=><span key={item}>{item}</span>)}</div></div></section>
  <section className="section" data-openend-reveal><div className="container detail-columns"><div><SectionHeading eyebrow="CONSTRUCTION & MATERIALS" title="Technical Selection Support"/><p>Share your machinery, duty cycle and performance requirements with QTM. Our team will identify the optimal V-belt solution.</p></div><div><h3>Standard constructions</h3><ul className="check-list dark-check">{["Natural rubber compounds","Synthetic rubber options","Reinforced core configurations","Wrapped and raw-edge designs","Cogged or smooth surfaces"].map(item=><li key={item}>{item}</li>)}</ul><h3>QTM Support</h3><ul className="check-list dark-check">{["Belt selection guidance","Pulley matching","Application review","Technical documentation","Regional availability"].map(item=><li key={item}>{item}</li>)}</ul></div></div></section>
  <section className="section light-section" data-openend-reveal><div className="container"><SectionHeading eyebrow="TECHNICAL INQUIRY" title="Tell Us About Your V-Belt Application"/><InquiryForm kind="product" product="V-Belts"/></div></section><section className="section openend-support" data-openend-reveal><div className="container"><SupportBlock/></div></section>
</>}

const megalinearProfiles = [
  { group:"Inch trapezoidal", profiles:["MXL","XL","L","H","XH"] },
  { group:"Metric trapezoidal", profiles:["T2.5","T5","T10","T20"] },
  { group:"AT high-performance", profiles:["AT3","AT5","AT10","AT20"] },
  { group:"RPP", profiles:["RPP5","RPP8","RPP14","RPP14 XHP"] },
  { group:"STD", profiles:["STD5","STD8"] },
  { group:"MTD", profiles:["MTD3","MTD5","MTD8","MTD14"] },
  { group:"Special profiles", profiles:["HG","TG5","TG10K6","TG10K13","TG20","ATG5","ATG10K6","ATG10K13","ATG20","P1","P2","P3","P4"] },
];

const megalinearStyles = [
  ["MEGALINEAR","Standard open-length polyurethane range for precision linear motion and conveying.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear/"],
  ["MEGALINEAR FC","Food-contact construction for food processing and packaging applications.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-fc/"],
  ["MEGALINEAR FC-S","Sealed-edge, encapsulated-cord construction for hygienic and wash-down duties.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-fc-s/"],
  ["MEGALINEAR XMD","Blue metal- and X-ray-detectable belt construction for enhanced food safety.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-xmd/"],
  ["MegaEco Biobased","A lower-impact range using polyurethane sourced partly from vegetable-based raw materials.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-megaeco-biobased/"],
  ["MEGALINEAR QST","Quiet self-tracking offset-tooth design for reduced noise and controlled positioning.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-qst/"],
  ["MEGALINEAR GW","High-load construction with high-tension steel cords for lifting and material handling.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-gw/"],
  ["MEGALINEAR XHP2","Reinforced RPP14 and MTD14 options developed for demanding heavy-load systems.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-xhp2/"],
  ["MEGAC4T","Adaptable open-ended belt platform designed for interchangeable conveying profiles.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megac4t/"],
  ["MEGALINEAR P3.3","Traction-belt construction developed for elevator applications.","https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/traction-belt-megalinear-p3-3/"],
];

const megalinearImages = {
  hero:"https://dam.ammega.com/api/file/redirect/8b6b3c4f-b6ac-4f38-bfa5-2f6c2f75cb74",
  overview:"https://dam.ammega.com/api/file/redirect/e2e77231-2c11-4fce-a661-002e4241dabe",
  components:"https://dam.ammega.com/api/file/redirect/0e83362b-3d45-44d7-a8b6-7d46c5490484",
  mxl:"https://dam.ammega.com/api/file/redirect/87d66649-5d45-4889-b59a-b59526ef2140",
  t5:"https://dam.ammega.com/api/file/redirect/65b1bad5-b12a-46d9-9541-5061221a34e0",
  at10:"https://dam.ammega.com/api/file/redirect/de76a9ef-8fe4-43df-bf3f-b3569d93e954",
};

function PolyurethaneOpenEndPage(){
  useEffect(()=>{
    const elements=Array.from(document.querySelectorAll<HTMLElement>("[data-openend-reveal]"));
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){
      elements.forEach(element=>element.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
    }),{threshold:0,rootMargin:"0px 0px -8%"});
    elements.forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[]);

  return <>
    <section className="openend-hero">
      <div className="openend-hero-copy">
        <Breadcrumbs parts={[{label:"Products",href:"/products"},{label:"Timing Belts",href:"/products/timing-belts"},{label:"Polyurethane Open End"}]}/>
        <p className="eyebrow"><b>MEGADYNE · MEGALINEAR</b></p>
        <h1>Polyurethane<br/>Open End Belts</h1>
        <p>Precision open-length timing belts for linear motion, positioning and synchronous conveying—configured around the machine and application.</p>
        <div className="button-row"><a className="hero-quote-link" href="/request-a-quote?product=polyurethane-open-end">Request a Quote <Arrow/></a><a className="text-link light" href="https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear/" target="_blank" rel="noreferrer">Official MEGALINEAR page <Arrow/></a></div>
      </div>
      <figure className="openend-hero-media"><img src={megalinearImages.hero} alt="Megadyne MEGALINEAR polyurethane open-ended timing belt"/></figure>
    </section>

    <section className="section openend-introduction" data-openend-reveal>
      <div className="container openend-intro-grid">
        <div className="openend-intro-image"><img src={megalinearImages.overview} alt="MEGALINEAR open-ended polyurethane timing belt overview"/></div>
        <div className="openend-intro-copy">
          <p className="eyebrow"><b>MEGALINEAR OPEN LENGTH</b></p>
          <h2>Stable, precise movement over long travel.</h2>
          <p>MEGALINEAR open-length timing belts use thermoplastic polyurethane for wear and abrasion resistance. Parallel zinc-coated steel tension members provide high breaking load and very low elongation, supporting dependable motion under high tractive effort.</p>
          <p>Tight manufacturing tolerances provide dimensional stability. Nylon fabric can be added on the teeth and/or belt back, while an extra polyurethane backing can protect the belt when moving aggressive or heavy products.</p>
        </div>
      </div>
    </section>

    <section className="openend-technical" data-openend-reveal>
      <div className="container">
        <div className="openend-section-head"><p className="eyebrow"><b>TECHNICAL PREVIEW</b></p><h2>Inside the belt construction.</h2><p>A concise view of the standard MEGALINEAR construction and available running-surface options.</p></div>
        <div className="openend-technical-grid">
          <figure><img src={megalinearImages.components} alt="Technical preview of MEGALINEAR belt body and steel cord construction"/></figure>
          <div className="openend-component-list">
            <article><span>01</span><div><h3>Polyurethane body</h3><p>White thermoplastic polyurethane, 92 ShA, selected for flexibility and resistance to wear, shock and surge loading.</p></div></article>
            <article><span>02</span><div><h3>Tension members</h3><p>High-strength S and Z parallel zinc-coated steel cords provide load capacity, dimensional stability and extremely low elongation.</p></div></article>
            <article><span>03</span><div><h3>Running surfaces</h3><p>Nylon fabric is available on the teeth and/or back to refine friction, noise and running behaviour for the application.</p></div></article>
          </div>
        </div>
      </div>
    </section>

    <section className="section openend-profiles" data-openend-reveal>
      <div className="container">
        <div className="openend-section-head"><p className="eyebrow"><b>PROFILE RANGE</b></p><h2>From compact positioning to heavy-duty linear motion.</h2><p>Profile availability covers classic trapezoidal, metric, curvilinear and application-specific tooth forms.</p></div>
        <div className="openend-profile-visuals">
          <figure><img src={megalinearImages.mxl} alt="MEGALINEAR MXL tooth profile"/><figcaption>MXL · Compact precision</figcaption></figure>
          <figure><img src={megalinearImages.t5} alt="MEGALINEAR T5 tooth profile"/><figcaption>T5 · Metric trapezoidal</figcaption></figure>
          <figure><img src={megalinearImages.at10} alt="MEGALINEAR AT10 tooth profile"/><figcaption>AT10 · High-performance positioning</figcaption></figure>
        </div>
        <div className="openend-profile-groups">{megalinearProfiles.map(group=><article key={group.group}><h3>{group.group}</h3><div>{group.profiles.map(profile=><code key={profile}>{profile}</code>)}</div></article>)}</div>
      </div>
    </section>

    <section className="section openend-family" data-openend-reveal>
      <div className="container">
        <div className="openend-section-head"><p className="eyebrow"><b>MEGALINEAR FAMILY</b></p><h2>Specialized constructions for different duties.</h2><p>Beyond the standard belt, the open-end family includes dedicated solutions for hygiene, detection, noise, tracking, sustainability and heavy loading.</p></div>
        <div className="openend-family-grid">{megalinearStyles.map(([name,description,url],index)=><a key={name} href={url} target="_blank" rel="noreferrer" aria-label={`View ${name} on the official Megadyne website`}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{name}</h3><p>{description}</p></div><Arrow/></a>)}</div>
      </div>
    </section>
  </>;
}

const timingBeltDetailPages = {
  "polyurethane-endless": {
    titleTop:"Polyurethane", titleBottom:"Endless Belts", eyebrow:"",
    heroCopy:[
      "Precision Polyurethane Timing Belts — Sourced Through QTM",
      "QTM brings together some of the most advanced polyurethane timing belt technologies available today.",
      "Our portfolio includes premium sleeved and cut-to-length timing belts, engineered for precision, reliability, and demanding industrial applications.",
      "Through QTM, customers can access a comprehensive range of Megaflex, Brecoflex, Synchroflex, Megapower, and carbon-corded Synchrochain belts.",
      "Whether you require a standard timing belt, a customized cut belt, or a high-performance carbon-corded solution, QTM provides access to proven belt technologies designed to deliver accurate power transmission, long service life, and consistent performance.",
    ],
    heroFullVisible:true,
    quote:"polyurethane-endless", official:"https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/",
    hero:"/assets/products/polyurethane-endless-hero-red-synchroflex.png", overview:"https://dam.ammega.com/api/file/redirect/5c433035-f42d-4dd2-bd46-c143c976c8da", components:"https://dam.ammega.com/api/file/redirect/2906f96f-35f9-4417-b424-2e78546f729a",
    introEyebrow:"MOULDED & TRULY ENDLESS", introTitle:"Continuous construction for controlled, reliable motion.",
    intro:["Megadyne polyurethane endless belts combine accurate tooth geometry with strong tensile members for synchronous transmission and positioning. MEGAPOWER belts are moulded endless, while MEGAFLEX belts use continuous spiral steel cords and are manufactured to the required length.","The range supports light precision drives through high-load and high-speed transmission. Tooth fabrics, back coatings and application-specific compounds extend the construction for conveying, food contact and demanding operating environments."],
    technicalIntro:"A concise view of the polyurethane body and continuous tensile reinforcement used across the endless range.",
    componentsList:[
      ["Polyurethane body","Thermoset polyurethane is used for MEGAPOWER; MEGAFLEX uses wear-resistant thermoplastic polyurethane for flexibility and dependable tooth engagement."],
      ["Continuous tensile members","Helically wound steel cords provide high breaking load, low elongation and stable belt length. Alternative cord materials are available for specific duties."],
      ["Application surfaces","Optional tooth fabric and special back coatings can refine friction, noise, grip and protection when conveying demanding products."],
    ],
    profileTitle:"Moulded profiles and a broad truly endless range.", profileCopy:"The combined MEGAPOWER and MEGAFLEX portfolio covers compact pitches, classic profiles, double-sided constructions and high-performance tooth forms.",
    visuals:[
      ["https://dam.ammega.com/api/file/redirect/be201cda-547e-4b22-8058-df9ba10debb5","XL · Compact imperial"],
      ["https://dam.ammega.com/api/file/redirect/7a0d97b3-fdd3-477d-98bd-dddc1f17a338","T5 · Metric precision"],
      ["https://dam.ammega.com/api/file/redirect/55490a8d-9ff5-471f-a9eb-a4d08869fcfe","AT10 · High-performance drive"],
    ],
    profiles:[
      {group:"MEGAPOWER 2",profiles:["T5","T5 DD","T10","T10 DD","AT5","AT10"]},
      {group:"MEGAFLEX",profiles:["XL","XL DD","L","L DD","H","H DD","XH","XH DD","T5","T5 DD","T10","T10 DD","T20","T20 DD","AT5","AT5 DD","AT10","AT10 DD","AT15","AT20","AT20 DD","MTD8","RPP5","RPP8","RPP8 DD","RPP14","RPP14 DD","ATG10","P2"]},
    ],
    familyEyebrow:"POLYURETHANE ENDLESS PORTFOLIO", familyTitle:"A further range for precision drives.", familyCopy:"Explore the BRECOflex polyurethane endless range through its official product source.",
    families:[],
  },
  "rubber-open-end": {
    titleTop:"Rubber", titleBottom:"Open End Belts", eyebrow:"",
    heroCopy:"Open-length rubber timing belts for reversing drives, accurate positioning and controlled linear movement.",
    quote:"rubber-open-end", official:"https://megadynegroup.com/en/products/timing-belts/rubber-open-end/",
    hero:"/assets/rubber-open-end-hero-full-scene.png", overview:"https://dam.ammega.com/api/file/redirect/4b8286e1-2540-48d2-8d0d-748d7b420adb", components:"https://dam.ammega.com/api/file/redirect/63f5a361-c15b-49b4-ba82-9a35df183090",
    introEyebrow:"MEGASYNC™ OPEN LENGTH", introTitle:"Accurate reversing motion without chain or cable.",
    intro:["Megadyne rubber open-ended timing belts are designed for reversing drives where rotational movement must be converted into linear motion with dependable positioning accuracy.","The range combines rubber belt bodies with fiberglass or steel tensile members. Its synchronous tooth engagement provides a clean alternative to chain or cable for lifting, machine tools and material-handling systems."],
    technicalIntro:"A practical view of the belt body, reinforcement and tooth-facing construction used for linear drives.",
    componentsList:[
      ["Rubber body","Special polychloroprene-based or EPDM rubber compounds form the belt body and support accurate tooth engagement."],
      ["Tensile members","High-modulus fiberglass or steel cords carry the load. RPP STEEL uses high-strength S and Z steel reinforcement for very limited elongation."],
      ["Back & tooth fabric","The back cushion protects the tensile members and permits backside idlers; treated nylon fabric protects the teeth and supports torque capacity."],
    ],
    profileTitle:"Open-end RPP profiles for controlled linear motion.", profileCopy:"RPP open-length rubber profiles support accurate reversing movement, stable tooth engagement and dependable traction in long-travel applications.",
    visuals:[
      ["https://dam.ammega.com/api/file/redirect/143d56d6-4736-4e6c-8cce-fcdeb3cbe4b0","MXL · Compact positioning"],
      ["https://dam.ammega.com/api/file/redirect/6fa696de-94d7-4ffd-b33f-c049de2ba44e","RPP3 · Curvilinear profile"],
      ["https://dam.ammega.com/api/file/redirect/39b477fc-73cc-441e-8052-decee2dad456","SLV5 · Linear drive profile"],
    ],
    profiles:[
      {group:"Inch profiles",profiles:["MXL","XL","L","H"]},
      {group:"RPP profiles",profiles:["RPP3","RPP5","RPP8"]},
      {group:"SLV / STD profiles",profiles:["SLV5","SLV8","STD8"]},
      {group:"RPP STEEL",profiles:["RPP 8M","RPP 14M"]},
    ],
    familyEyebrow:"RUBBER OPEN END FAMILY", familyTitle:"Two constructions for controlled linear motion.", familyCopy:"Choose the standard open-ended family or steel-cord RPP construction according to load and elongation requirements.",
    families:[],
  },
  "rubber-endless": {
    titleTop:"Rubber Endless", titleBottom:"Timing Belts", eyebrow:"",
    heroCopy:["With our extensive selection of timing belts, QTM covers virtually all profiles commonly used across the belting industry, providing reliable solutions for a wide range of industrial applications.","Through the comprehensive Megadyne and Continental ContiTech rubber timing belt ranges, QTM can supply a complete selection of profiles and sizes required by customers worldwide. Our portfolio includes RPP, HTD, STD, and RPC profiles, along with other standard and application-specific configurations.","From high-precision power transmission to demanding industrial drive systems, QTM provides timing belt solutions engineered for reliability, efficiency, accurate synchronization, and long service life."],
    heroFullVisible:true,
    quote:"rubber-endless", official:"https://megadynegroup.com/en/products/timing-belts/rubber-endless/",
    hero:"/assets/megadyne-conti-colab.jpg", overview:"https://dam.ammega.com/api/file/redirect/a36c89f0-a936-4fd6-adc3-598b9302583b", components:"https://dam.ammega.com/api/file/redirect/d48dd440-0ada-4e6c-a4b8-61e3782efef2",
    introEyebrow:"MEGASYNC™ ENDLESS", introTitle:"Synchronous power transmission from standard to extreme duty.",
    intro:["The MEGASYNC™ rubber endless range combines accurate tooth meshing with reinforced rubber compounds and continuous tensile cords. It covers traditional machinery, compact drive upgrades and high-power applications across a broad spectrum of industries.","Classic RPP and Imperial constructions sit alongside Silver3, Gold2 and Titanium performance families. Dedicated variants extend the range for paint systems and very high-speed operation."],
    technicalIntro:"The classic MEGASYNC™ construction combines a reinforced rubber body, continuous cords and a protected tooth surface.",
    componentsList:[
      ["Reinforced rubber body","Application-specific chloroprene, NBR or HNBR compounds provide tooth rigidity, flexibility and resistance for the selected duty."],
      ["Continuous cords","Helically wound fiberglass, high-performance glass or carbon cords provide tensile strength and stable synchronous engagement."],
      ["Tooth-facing fabric","Wear-resistant, low-friction fabric protects the tooth surface, supports torque transfer and reduces pulley wear."],
    ],
    profileTitle:"", profileCopy:"",
    pillarTitle:"Megadyne Endless Timing Belts", pillarImage:"/assets/megadyne-pillar.png",
    pillarCopy:["QTM's endless timing belt program is built around the Megadyne MEGASYNC™ portfolio, giving customers one dependable regional source for classic, upgraded and high-performance rubber constructions.","Each family shares a common reinforced rubber body and continuous tensile cord construction, so pulleys, mounting dimensions and installation practices carry across the range as duty requirements change."],
    rangeTitle:"Profiles", rangeImage:"/assets/standart-range.png",
    rangeCopy:["The standard range covers everything from light-duty positioning belts to heavy industrial drives, manufactured as continuous, joint-free loops for smooth, vibration-free running.","RPP, Imperial, Silver3, Gold2 and Titanium sections are all available off the shelf, with QTM's technical team on hand to confirm the exact pitch, width and length for your machine."],
    comparisonIndexImage:"/assets/comparison-index.png",
    comparisonIndexCopy:"Compare power ratings, tooth engagement and service life at a glance. The performance index shows how Silver3, Gold2 and Titanium scale up from standard duty to extreme, high-torque applications on the same pitch.",
    visuals:[
      ["https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff","RPP3 · Compact synchronous drive"],
      ["https://dam.ammega.com/api/file/redirect/18941fb2-21c5-4b02-abf7-3ed7dae2f059","RPP8 · Industrial transmission"],
      ["https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2","RPP14 DD · Double-sided duty"],
    ],
    profiles:[
      {group:"RPP single-sided",profiles:["RPP3","RPP5","RPP8","RPP14"]},
      {group:"RPP double-sided",profiles:["RPP5 DD","RPP8 DD","RPP14 DD"]},
      {group:"Imperial",profiles:["MXL","XL","XL DD","L","L DD","H","H DD","XH","XXH"]},
      {group:"Silver3",profiles:["5M","8M","14M","8M DD","14M DD"]},
      {group:"Gold2",profiles:["5M","8M","14M","8M DD","14M DD"]},
      {group:"High-performance",profiles:["Titanium","Titanium Speed","MEGAPAINT"]},
    ],
    familyEyebrow:"MEGASYNC™ FAMILY", familyTitle:"A rubber timing belt for every performance level.", familyCopy:"Each family row links directly to its official Megadyne product page.",
    families:[],
  },
} as const;

const polyurethaneEndlessProfilePictures = [
  {
    family:"MEGAPOWER 2",
    official:"https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/megapower/megapower2/",
    linkImage:"/assets/polyurethane-profile-belts.png",
    description:"Moulded endless polyurethane belt for light synchronized drives and precise power transmission.",
    profiles:[
      ["T5","https://dam.ammega.com/api/file/redirect/95971488-58bb-4554-adc2-99c68f672520"],
      ["T5 DD","https://dam.ammega.com/api/file/redirect/b402fe43-5372-4066-93c4-d0092a70e060"],
      ["T10","https://dam.ammega.com/api/file/redirect/a5f7866f-d0be-49a1-84b9-8ef17386f928"],
      ["T10 DD","https://dam.ammega.com/api/file/redirect/2663ae30-5be8-41f1-bb7e-17dcac13febf"],
      ["AT5","https://dam.ammega.com/api/file/redirect/c945402f-1769-4cc8-b334-e607ea0b66c5"],
      ["AT10","https://dam.ammega.com/api/file/redirect/de76a9ef-8fe4-43df-bf3f-b3569d93e954"],
    ],
  },
  {
    family:"MEGAFLEX",
    official:"https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/megaflex/megaflex/",
    linkImage:"/assets/megapower-white-background.png",
    description:"Truly endless thermoplastic polyurethane belt for high-load, high-speed transmission and conveying.",
    profiles:[
      ["XL","https://dam.ammega.com/api/file/redirect/be201cda-547e-4b22-8058-df9ba10debb5"],
      ["XL DD","https://dam.ammega.com/api/file/redirect/f82c988c-8049-48cb-aef1-d7e07eb4bfc1"],
      ["L","https://dam.ammega.com/api/file/redirect/0ccfcfcd-ab69-48f1-929f-4e47859e1e6b"],
      ["L DD","https://dam.ammega.com/api/file/redirect/e85fb589-0a74-48c8-bd01-3435e121c2ed"],
      ["H","https://dam.ammega.com/api/file/redirect/00c58aa0-1656-4f05-93a7-3ba63835342d"],
      ["H DD","https://dam.ammega.com/api/file/redirect/a4e27cf2-43c8-4e3d-9855-ac8b080d7926"],
      ["XH","https://dam.ammega.com/api/file/redirect/90514e76-ac86-4eb4-b1bd-1c8ebd91462f"],
      ["XH DD","https://dam.ammega.com/api/file/redirect/3539d45e-63a8-473b-8ae0-618b99ace1f6"],
      ["T5","https://dam.ammega.com/api/file/redirect/7a0d97b3-fdd3-477d-98bd-dddc1f17a338"],
      ["T5 DD","https://dam.ammega.com/api/file/redirect/9820aba9-c435-4045-83ae-3b92089d1b64"],
      ["T10","https://dam.ammega.com/api/file/redirect/c5f9e775-720b-4fdc-8f4c-a56058ac3cf6"],
      ["T10 DD","https://dam.ammega.com/api/file/redirect/424aef2e-c843-4e00-a147-8858e3e16500"],
      ["T20","https://dam.ammega.com/api/file/redirect/d7f0eccc-c1b3-4585-87e2-6c385903b0f5"],
      ["T20 DD","https://dam.ammega.com/api/file/redirect/0c4ef2ed-09d7-441d-a070-044968bb3185"],
      ["AT5","https://dam.ammega.com/api/file/redirect/7546f965-0886-4a81-a849-dd8bb122c618"],
      ["AT5 DD","https://dam.ammega.com/api/file/redirect/2a24ad88-d40b-44dd-9c0a-31a80e6fd85a"],
      ["AT10","https://dam.ammega.com/api/file/redirect/55490a8d-9ff5-471f-a9eb-a4d08869fcfe"],
      ["AT10 DD","https://dam.ammega.com/api/file/redirect/190a4a27-95f8-4986-ae7a-254e59866126"],
      ["AT15","https://dam.ammega.com/api/file/redirect/d65863bf-169f-4efd-b2bd-3ddf178e16d0"],
      ["AT20","https://dam.ammega.com/api/file/redirect/7d48353c-3395-4c6c-8c16-08e58d0403df"],
      ["AT20 DD","https://dam.ammega.com/api/file/redirect/3161cf49-d93a-400c-8d55-21d59f46b5eb"],
      ["MTD8","https://dam.ammega.com/api/file/redirect/6657ef96-47de-40df-800d-0043bdc40693"],
      ["RPP5","https://dam.ammega.com/api/file/redirect/148fc75e-0f9e-48eb-a3c1-a10da8cf7bcc"],
      ["RPP8","https://dam.ammega.com/api/file/redirect/60c1b5a4-d1a4-4db3-a40c-8337c018a624"],
      ["RPP8 DD","https://dam.ammega.com/api/file/redirect/c51bd336-9997-495d-bbe3-b9283e7aeb85"],
      ["RPP14","https://dam.ammega.com/api/file/redirect/8ba368e3-5ffb-42c9-b92e-ff21b42678c4"],
      ["RPP14 DD","https://dam.ammega.com/api/file/redirect/9e12ada8-4bbb-4501-8697-a8dd96990e11"],
      ["ATG10","https://dam.ammega.com/api/file/redirect/e58d5262-9a6c-4e3e-af31-c4d2bef2b62c"],
      ["P2","https://dam.ammega.com/api/file/redirect/84ddd4a5-298f-4fc4-9423-041306be40e6"],
    ],
  },
  {
    family:"CONTI® SYNCHROFLEX",
    official:"https://www.continental-industry.com/getattachment/a7bf8704-bcc7-4995-bde4-407ca5f45353/Datasheet_CONTI_SYNCHROFLEX_EN.pdf",
    linkImage:"/assets/conti-synchroflex-link.png",
    description:"CONTI® SYNCHROFLEX polyurethane timing belts are designed for precise, reliable power transmission across a wide range of industrial applications. The range includes single-sided and double-sided (DL) configurations, providing flexibility for precision drive and conveying applications.",
    profiles:[
      ["AT3","/assets/conti-synchroflex-profiles/at3.png"],
      ["AT5","/assets/conti-synchroflex-profiles/at5.png"],
      ["AT10","/assets/conti-synchroflex-profiles/at10.png"],
      ["AT20","/assets/conti-synchroflex-profiles/at20.png"],
      ["T2","/assets/conti-synchroflex-profiles/t2.png"],
      ["T2.5","/assets/conti-synchroflex-profiles/t2-5.png"],
      ["T2.5-DL","/assets/conti-synchroflex-profiles/t2-5-dl.png"],
      ["T5","/assets/conti-synchroflex-profiles/t5.png"],
      ["T5-DL","/assets/conti-synchroflex-profiles/t5-dl.png"],
      ["T10","/assets/conti-synchroflex-profiles/t10.png"],
      ["T10-DL","/assets/conti-synchroflex-profiles/t10-dl.png"],
      ["T20","/assets/conti-synchroflex-profiles/t20.png"],
      ["M (MXL)","/assets/conti-synchroflex-profiles/m-mxl.png"],
      ["K1","/assets/conti-synchroflex-profiles/k1.png"],
      ["K1.5","/assets/conti-synchroflex-profiles/k1-5.png"],
    ],
  },
  {
    family:"CONTI® SYNCHROFLEX GEN III",
    official:"https://www.continental-industry.com/getattachment/a7bf8704-bcc7-4995-bde4-407ca5f45353/Datasheet_CONTI_SYNCHROFLEX_EN.pdf",
    linkImage:"/assets/conti-synchroflex-gen3.png",
    description:"CONTI® SYNCHROFLEX GEN III polyurethane timing belts provide accurate, reliable power transmission for demanding industrial positioning and conveying applications.",
    profiles:[
      ["AT3","/assets/conti-synchroflex-profiles/at3.png"],
      ["AT5","/assets/conti-synchroflex-profiles/at5.png"],
      ["AT10","/assets/conti-synchroflex-profiles/at10.png"],
      ["AT20","/assets/conti-synchroflex-profiles/at20.png"],
    ],
  },
  {
    family:"CONTI® SYNCHROCHAIN Carbon",
    official:"https://www.continental-industry.com/in/en/products-solutions/power-transmission/synchronous-belts-pu",
    linkImage:"/assets/conti-synchrochain-carbon-link.png",
    description:"Heavy-duty polyurethane timing belt with carbon tension members, engineered for high torque, high dynamic loads and reliable power transmission in demanding industrial drives.",
    profiles:[
      ["CTD C8M","/assets/ctd-c8m-profile.jpg"],
      ["CTD C14M","/assets/ctd-c14m-profile.jpg"],
    ],
  },
  {
    family:"BRECOFLEX®",
    official:"https://www.brecoflex.com/product-category/timing-belts",
    linkImage:"/assets/brecoflex-link.png",
    description:"Truly endless polyurethane timing belts for precision power transmission, positioning and high-performance industrial drives.",
    profiles:[
      ["AT3","/assets/brecoflex-profiles/at3.svg"],["AT5","/assets/brecoflex-profiles/at5.svg"],["AT10","/assets/brecoflex-profiles/at10.svg"],["AT20","/assets/brecoflex-profiles/at20.svg"],["ATL10","/assets/brecoflex-profiles/atl10.svg"],["T5","/assets/brecoflex-profiles/t5.svg"],["T10","/assets/brecoflex-profiles/t10.svg"],["T10 DL","/assets/brecoflex-profiles/t10-dl.svg"],["T20","/assets/brecoflex-profiles/t20.svg"],["XL","/assets/brecoflex-profiles/xl.svg"],["L","/assets/brecoflex-profiles/l.svg"],["H","/assets/brecoflex-profiles/h.svg"],["ATN10","/assets/brecoflex-profiles/atn10.svg"],["BAT10","/assets/brecoflex-profiles/bat10.svg"],["SAT10","/assets/brecoflex-profiles/sat10.svg"],["BATK10","/assets/brecoflex-profiles/batk10.svg"],["SFAT10","/assets/brecoflex-profiles/sfat10.svg"],["ATK10","/assets/brecoflex-profiles/atk10.svg"],
    ],
  },
] as const;

const rubberOpenEndProfilePictures=[
  {family:"MEGASYNC™ Rubber Open End RPP",official:"https://megadynegroup.com/en/products/timing-belts/rubber-open-end/rubber-open-end/",linkImage:"/assets/rubber-open-end-rpp-hero.png",description:"Open-ended RPP rubber timing belts for linear drives, positioning systems, lifting applications and controlled reciprocating movement.",profiles:[["RPP3","https://dam.ammega.com/api/file/redirect/6fa696de-94d7-4ffd-b33f-c049de2ba44e"],["RPP5","https://dam.ammega.com/api/file/redirect/148fc75e-0f9e-48eb-a3c1-a10da8cf7bcc"],["RPP8","https://dam.ammega.com/api/file/redirect/60c1b5a4-d1a4-4db3-a40c-8337c018a624"]]},
  {family:"MEGASYNC™ RPP STEEL",official:"https://megadynegroup.com/en/products/timing-belts/rubber-open-end/rpp-steel/",linkImage:"/assets/megasync-rpp-steel-link.png",description:"Steel-cord open-ended RPP construction for higher traction loads, reduced elongation and demanding industrial linear-motion systems.",profiles:[["RPP 8M","https://dam.ammega.com/api/file/redirect/60c1b5a4-d1a4-4db3-a40c-8337c018a624"],["RPP 14M","https://dam.ammega.com/api/file/redirect/8ba368e3-5ffb-42c9-b92e-ff21b42678c4"]]},
] as const;

const rubberEndlessProfilePictures=[
  {family:"MEGASYNC™ Imperial",official:"https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-imperial-imperial-dd/",linkImage:"/assets/megasync-imperial-link.png",description:"Classic imperial rubber timing belts for established machinery and replacement drives.",profiles:[["MXL","https://dam.ammega.com/api/file/redirect/143d56d6-4736-4e6c-8cce-fcdeb3cbe4b0"],["XL","https://dam.ammega.com/api/file/redirect/be201cda-547e-4b22-8058-df9ba10debb5"],["L","https://dam.ammega.com/api/file/redirect/0ccfcfcd-ab69-48f1-929f-4e47859e1e6b"],["H","https://dam.ammega.com/api/file/redirect/00c58aa0-1656-4f05-93a7-3ba63835342d"],["XH","https://dam.ammega.com/api/file/redirect/90514e76-ac86-4eb4-b1bd-1c8ebd91462f"]]},
  {family:"MEGASYNC™ RPP",official:"https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-rpp-and-rpp-dd/",linkImage:"/assets/megasync-rpp-link.png",description:"Classic parabolic-profile rubber timing belts for a broad range of synchronous drives.",profiles:[["RPP3, RPP5, RPP8, RPP14","https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff"],["RPP5 DD, RPP8 DD, RPP14 DD","https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]},
  {family:"MEGASYNC™ Silver3",official:"https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-silver3-silver3-dd/",linkImage:"/assets/megasync-silver3-link.png",description:"The new SILVER3 belt is made from high-quality, innovative materials. After extensive research and development, a synchronous belt was created that offers excellent performance and reliability.",profiles:[["SLV3 5M, SLV3 8M, SLV3 14M","https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff"],["SLV3 5M DD, SLV3 8M DD, SLV3 14M DD","https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]},
  {family:"MEGASYNC™ Gold2",official:"https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-gold2-and-gold2-dd/",linkImage:"/assets/megasync-gold2-link.png",description:"High-performance RPC construction for increased torque capacity and compact drive upgrades.",profiles:[["GLD 5M, GLD 8M, GLD 14M","https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff"],["GLD 5M DD, GLD 8M DD, GLD 14M DD","https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]},
  {family:"MEGASYNC™ Titanium",official:"https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-titanium/",linkImage:"/assets/megasync-titanium-link.png",description:"Megadyne Titanium is a high-performance carbon-cord timing belt engineered for increased specific power, lower weight, reduced noise and maintenance-free operation.",profiles:[["TTM 8M, TTM 14M","https://dam.ammega.com/api/file/redirect/18941fb2-21c5-4b02-abf7-3ed7dae2f059"],["TTM 8M DD, TTM 14M DD","https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]},
] as const;

type TimingBeltDetailSlug = keyof typeof timingBeltDetailPages;

function TimingProfileFamily({family}:{family:any}){
  return <section className={`openend-profile-family${family.family==="CONTI® SYNCHROCHAIN Carbon"?" carbon-profile-family":""}`}>
    <div className="openend-profile-family-head"><h3>{family.family}</h3></div>
    {family.family.startsWith("CONTI®")&&<p className="continental-family-description">{family.description}</p>}
    <a className={`openend-profile-official openend-profile-official--media${family.family==="BRECOFLEX®"||family.family==="CONTI® SYNCHROCHAIN Carbon"||family.family.startsWith("CONTI® SYNCHROFLEX")?" openend-profile-official--image-right":""}`} href={family.official} target="_blank" rel="noreferrer"><span className="openend-profile-link-image"><img src={family.linkImage} alt="" loading="lazy" decoding="async"/></span><span className="openend-profile-link-copy"><strong>{family.family}</strong><span>{family.description}</span></span><Arrow/></a>
    <div className={`openend-profile-picture-grid${family.profiles.length<=2?" openend-profile-picture-grid--center":""}`}>{family.profiles.map(([profile,src]:[string,string])=><figure key={`${family.family}-${profile}`}><img src={src} alt={`${family.family} ${profile} timing belt profile`} loading="lazy" decoding="async"/><figcaption>{profile}</figcaption></figure>)}</div>
    {family.family==="BRECOFLEX®"&&<div className="continental-profile-note"><figure><img src="/assets/brecoflex-detail.png" alt="BRECOFLEX polyurethane timing belts" loading="lazy" decoding="async"/></figure><div><h4>BRECOFLEX® Timing Belts</h4><p>BRECOFLEX® belts are truly endless polyurethane timing belts built for precise, low-maintenance power transmission in compact and demanding machine designs.</p><p>The range covers standard AT and T profiles as well as imperial and specialty self-guiding options for positioning, conveying and synchronized drive applications.</p></div></div>}
    {family.family==="CONTI® SYNCHROFLEX GEN III"&&<div className="continental-profile-note"><figure><img src="/assets/conti-synchroflex-profile-detail.png" alt="CONTI SYNCHROFLEX GEN III polyurethane timing belt profile" loading="lazy" decoding="async"/></figure><div><h4>CONTI® SYNCHROFLEX GEN III</h4><p>CONTI® SYNCHROFLEX GEN III is a polyurethane timing belt range designed for accurate positioning, dependable repeatability and efficient power transmission in industrial machinery.</p><p>Its AT tooth profiles combine precise engagement with strong, wear-resistant performance for automated drives and conveying applications.</p></div></div>}
    {family.family==="CONTI® SYNCHROCHAIN Carbon"&&<div className="continental-profile-note"><figure><img src="/assets/conti-synchrochain-carbon-detail.png" alt="CONTI SYNCHROCHAIN Carbon timing belt detail" loading="lazy" decoding="async"/></figure><div><h4>CONTI® SYNCHROCHAIN Carbon</h4><p>CONTI® SYNCHROCHAIN Carbon is engineered for high-torque synchronous drives where strength, precision and long service life are critical.</p><p>Its carbon tension members and CTD tooth profiles support demanding dynamic loads while maintaining reliable engagement in heavy industrial applications.</p></div></div>}
  </section>;
}

function RubberPerformanceTechnical({family}:{family:string}){
  if(!["MEGASYNC™ Silver3","MEGASYNC™ Gold2","MEGASYNC™ Titanium"].includes(family))return null;
  const titanium=family.endsWith("Titanium");
  const items=titanium?["HNBR Rubber Backing","HNBR Rubber Teeth","100% Carbon Fiber Cords","High-Performance Tooth Facing Fabric","Special Anti-Friction Treatment"]:["NBR body","NBR back","Glass cords","Nylon fabric","External special film"];
  return <><section className="section openend-technical profile-family-technical" data-openend-reveal><div className="container"><div className="openend-section-head"><p className="eyebrow"><b>TECHNICAL PREVIEW</b></p><h2>{family}</h2></div><div className="openend-technical-grid openend-technical-grid--compact"><div className="internal-structure-image-col"><p className="internal-structure-label internal-structure-label--above">INTERNAL STRUCTURE</p><figure><img src="/assets/silver3-gld2-description.png" alt={`${family} internal construction`} loading="lazy" decoding="async"/></figure></div><div className="openend-component-list internal-structure-list">{items.map((item,index)=><article key={item}><span>{index+1}</span><div><h3>{item}</h3></div></article>)}</div></div>{titanium&&<div className="feature-columns"><div className="feature-column"><h4>Belt Body</h4><ul><li>HNBR elastomer increases tooth rigidity and shear resistance.</li><li>Exceptional resistance to flex fatigue.</li><li>Wide working temperature range from -40°C to +120°C, with peaks up to +140°C.</li></ul></div><div className="feature-column"><h4>Tension Members</h4><ul><li><strong>100%</strong> carbon cord technology for extreme dimensional stability.</li><li>Maintenance-free with no need to re-tension.</li><li>Accurate tooth meshing reduces abrasion, vibration and noise.</li></ul></div></div>}</div></section>{titanium&&<section className="section light-section mechanism-showcase-section" data-openend-reveal><div className="container"><figure className="mechanism-showcase"><img src="/assets/gold-slv-rpp-mechanism.jpg" alt="Silver3, Gold2 and Titanium on a Real Industrial Drive" loading="lazy" decoding="async"/><figcaption><p className="eyebrow"><b>MEGASYNC™ IN THE DRIVE</b></p><h3>Silver3, Gold2 and Titanium on a Real Industrial Drive</h3><p>MEGASYNC™ belts are engineered to perform side by side on the same machine—from cost-effective Silver3 replacement duty through Gold2 upgrades to Titanium’s extreme-duty carbon-cord construction.</p></figcaption></figure></div></section>}</>;
}

function TimingBeltDetailPage({slug}:{slug:TimingBeltDetailSlug}){
  const page=timingBeltDetailPages[slug];
  const catalog=slug==="polyurethane-endless"?polyurethaneEndlessProfilePictures:slug==="rubber-open-end"?rubberOpenEndProfilePictures:rubberEndlessProfilePictures;
  useEffect(()=>{
    const elements=Array.from(document.querySelectorAll<HTMLElement>("[data-openend-reveal]"));
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){elements.forEach(element=>element.classList.add("is-visible"));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.1,rootMargin:"0px 0px -8%"});
    elements.forEach(element=>observer.observe(element));return()=>observer.disconnect();
  },[]);

  return <>
    <section className={"openend-hero openend-hero--brand-split"+(slug==="rubber-open-end"?" openend-hero--rubber-open":"")+("heroFullVisible" in page&&page.heroFullVisible?" openend-hero--full-visible":"")}>
      <div className="openend-hero-copy">
        <Breadcrumbs plain parts={[{label:"Products",href:"/products"},{label:"Timing Belts",href:"/products/timing-belts"},{label:page.titleTop+" "+page.titleBottom}]}/>
        {page.eyebrow&&<p className="eyebrow"><b>{page.eyebrow}</b></p>}
        <h1>{page.titleTop}<br/>{page.titleBottom}</h1>
        <figure className="openend-mobile-hero-media"><img src={page.hero} alt={page.titleTop+" "+page.titleBottom+" belt portfolio"}/></figure>
        <div className="openend-hero-description">{Array.isArray(page.heroCopy)?page.heroCopy.map((paragraph,index)=><p className={index===0?"lead":undefined} key={paragraph}>{paragraph}</p>):<p>{page.heroCopy}</p>}</div>
        {Array.isArray(page.heroCopy)&&<details className="openend-mobile-overview"><summary>More about this range <Chevron/></summary><div>{page.heroCopy.slice(2).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></details>}
        <div className="button-row"><a className="hero-quote-link" href={"/request-a-quote?product="+page.quote}>Request a Quote <Arrow/></a></div>
      </div>
      <figure className="openend-hero-media"><img src={page.hero} alt={page.titleTop+" "+page.titleBottom+" by Megadyne"}/></figure>
    </section>

    {"pillarImage" in page&&page.pillarImage&&<section className="section openend-introduction" data-openend-reveal><div className="container openend-intro-grid pillar-intro-grid"><div className="openend-intro-image"><img src={page.pillarImage} alt={page.pillarTitle}/></div><div className="openend-intro-copy"><p className="eyebrow"><b>MEGASYNC™ ENDLESS RANGE</b></p><h2>{page.pillarTitle}</h2>{page.pillarCopy.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></div></section>}
    {"rangeImage" in page&&page.rangeImage&&<section className="section openend-introduction openend-introduction--reverse" data-openend-reveal><div className="container openend-intro-grid"><div className="openend-intro-copy"><p className="eyebrow"><b>STANDARD RANGE</b></p><h2>{page.rangeTitle}</h2>{page.rangeCopy.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><div className="openend-intro-image"><img src={page.rangeImage} alt={page.rangeTitle}/></div></div></section>}
    {"comparisonIndexImage" in page&&page.comparisonIndexImage&&<section className="section openend-technical" data-openend-reveal><div className="container"><div className="openend-section-head openend-section-head--center"><p className="eyebrow"><b>SELECTION GUIDE</b></p><h2>Performance Comparison Index</h2><p>{page.comparisonIndexCopy}</p></div><figure className="comparison-index-figure"><img src={page.comparisonIndexImage} alt="Megadyne timing belt performance comparison index"/></figure></div></section>}

    <section className="section openend-profiles" data-openend-reveal><div className="container">
      {page.profileTitle&&<div className="openend-section-head"><h2>{page.profileTitle}</h2>{page.profileCopy&&<p>{page.profileCopy}</p>}</div>}
      <div className={"openend-profile-catalog"+(slug==="rubber-open-end"?" rubber-openend-profile-catalog":"")}>{catalog.map((family:any)=><div key={family.family}><TimingProfileFamily family={family}/>{slug==="rubber-endless"&&<RubberPerformanceTechnical family={family.family}/>}</div>)}</div>
    </div></section>

    {page.families.length>0&&<section className="section openend-family" data-openend-reveal><div className="container"><div className="openend-section-head"><p className="eyebrow"><b>{page.familyEyebrow}</b></p><h2>{page.familyTitle}</h2><p>{page.familyCopy}</p></div><div className="openend-family-grid openend-family-grid--unnumbered">{page.families.map(([name,description,url])=><a key={name} href={url} target="_blank" rel="noreferrer" aria-label={"View the official "+name+" product source"}><div><h3>{name}</h3><p>{description}</p></div><Arrow/></a>)}</div></div></section>}
    <section className="section openend-support" data-openend-reveal><div className="container"><SupportBlock/></div></section>
  </>;
}
function ProductPage({ slug }: { slug: string }) {
  const product=findProduct(slug); if(!product) return <NotFound/>;
  const isTiming=slug==="timing-belts"; const isV=slug==="v-belts"; const isConveyor=slug==="conveyor-belts"; const isModular=slug==="modular-belts";
  const extras = isTiming ? ["Open-ended belts","Endless welded belts","Truly endless belts","Steel tension cords","Kevlar or aramid tension cords","Coatings","Cleats","Guides","Perforations","Special backings","Precision machining"] : isConveyor ? ["Custom fabrication","Cleats","Sidewalls","Guides","Tracking profiles","Perforation","Precision machining","Endless splicing","Installation","On-site technical support","Belt selection","Application engineering"] : isModular ? ["Plastic sprockets","Stainless-steel sprockets","Wear strips","Guide rails","Flights and cleats","Side guards","Hold-down components","Curved-conveyor accessories","Spiral-conveyor accessories"] : product.subcategories;
  return <><PageHero plainBreadcrumbs eyebrow={product.family} title={product.name} copy={product.description} parts={[{label:"Products",href:"/products"},{label:product.family,href:`/products?category=${slugify(product.family)}`},{label:product.name}]}/><section className="product-intro"><div className="container product-intro-grid"><div className="detail-image" style={{backgroundImage:`url(${product.image})`}} role="img" aria-label={`Industrial ${product.name.toLowerCase()}`}/><div><p className="eyebrow"><b>SUPPLIER NETWORK</b></p><h2>{product.suppliers.join(" · ")}</h2><p>QTM helps customers identify, select and source a suitable solution for the machine, duty and operating environment.</p><div className="tag-list">{product.industries.map(x=><span key={x}>{x}</span>)}</div><div className="button-row"><Button href={`/request-a-quote?product=${slug}`}>Request a Quote</Button><Button href={`/product-identification?product=${slug}`} secondary>Identify a Belt</Button></div></div></div></section><section className="section"><div className="container"><SectionHeading eyebrow="PRODUCT RANGE" title={isTiming ? "Timing Belt Types" : isV ? "V-Belt Categories and Standard Profiles" : `Complete ${product.name} Range`}/><div className="technical-grid">{product.subcategories.map((item,i)=><div id={slugify(item)} key={item}><span>{String(i+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}</div>{product.profiles&&<><h3 className="subheading">Profiles and sections</h3><div className="profile-grid">{product.profiles.map(x=><code key={x}>{x}</code>)}</div></>}</div></section><section className="dark-feature"><div className="container detail-columns"><div><SectionHeading eyebrow={isModular ? "ACCESSORIES" : "CONFIGURATION & SERVICES"} title="Configured Around the Application" inverse/><p>Final suitability, specifications and availability are confirmed by QTM for each application.</p></div><div className="dark-list">{extras.map(x=><span key={x}>{x}</span>)}</div></div></section><section className="section"><div className="container detail-columns"><div><SectionHeading eyebrow="MATERIALS & BENEFITS" title="Technical Selection Support"/><p>Share operating conditions, dimensions and machine details so the QTM team can compare appropriate constructions.</p></div><div><h3>Materials / surfaces</h3><ul className="check-list dark-check">{product.materials.map(x=><li key={x}>{x}</li>)}</ul>{product.benefits&&<><h3>Product advantages</h3><ul className="check-list dark-check">{product.benefits.map(x=><li key={x}>{x}</li>)}</ul></>}</div></div></section><section className="section light-section"><div className="container"><SectionHeading eyebrow="TECHNICAL INQUIRY" title={`Tell Us About Your ${product.name}`}/><InquiryForm kind="product" product={product.name}/></div></section></>;
}

const supplierLogos: Record<string,string> = {
  megadyne: "/assets/partners/megadyne.svg",
  continental: "/assets/partners/continental.png",
  "ammeraal-beltech": "/assets/partners/trimmed/ammeraal-beltech.webp",
  sampla: "/assets/partners/trimmed/sampla.webp",
  "uni-modular": "/assets/partners/trimmed/uni.webp",
  challenge: "/assets/partners/trimmed/challenge.webp",
  whm: "/assets/partners/whm.png",
};

function SupplierDirectory({compact=false}:{compact?:boolean}) { return <div className={`supplier-directory ${compact?"compact":""}`}>{suppliers.map(s=><article key={s.slug}><div className={`supplier-logo-panel supplier-logo-${s.slug}`}><img src={supplierLogos[s.slug]} alt={`${s.name} logo`}/></div><div className="supplier-directory-copy"><p className="mono-label">{s.short}</p><p>{s.relationship}</p><div className="supplier-links"><a href={`/suppliers/${s.slug}`}>Supplier page <Arrow/></a><a href={s.url} target="_blank" rel="noreferrer">{s.name} <Arrow/></a></div></div></article>)}</div>; }

function SuppliersPage(){return <><PageHero eyebrow="GLOBAL SUPPLIER NETWORK" title="Several International Manufacturers. One QTM Relationship." copy="QTM is independent and clearly presents each approved supplier relationship, product area and official external source." parts={[{label:"Suppliers"}]}/><section className="section"><div className="container"><SupplierDirectory/></div></section><FinalCta/></>}

const principalPartnerships: Record<string, {logo:string;label:string;headline:string;intro:string[];detail:string;images:{src:string;label:string}[]}> = {
  megadyne: {
    logo:"/assets/partners/megadyne.svg", label:"MEGADYNE MEGAPARTNER", headline:"Power Transmission Expertise, Delivered Regionally.",
    intro:["QTM Group is proud to be a Megadyne MegaPartner and a trusted regional distributor of Megadyne power transmission solutions."],
    detail:"Through this strategic relationship, QTM connects Megadyne’s broad industrial portfolio with regional distributors, OEMs, maintenance teams and end users. We support product identification, technical selection, commercial coordination and dependable follow-up for demanding power transmission applications.",
    images:[{src:"/assets/partnership-megadyne-rubber.png",label:"MEGASYNC™ rubber timing belts"},{src:"/assets/partnership-megadyne-pu.png",label:"Polyurethane endless timing belts"},{src:"/assets/partnership-megadyne-open.png",label:"Open-ended timing belts"}],
  },
  continental: {
    logo:"/assets/partners/continental.png", label:"CONTITECH PARTNERSHIP · SINCE 2023", headline:"Proven Industrial Drive Technology for the Region.",
    intro:["Since 2023, QTM Group has also served as a regional representative of ContiTech, a leading manufacturer of high-quality industrial power transmission belts."],
    detail:"QTM helps regional customers access ContiTech industrial drive solutions with responsive local coordination. Our team supports application review, belt identification and product selection across industrial, agricultural and OEM requirements.",
    images:[{src:"/assets/partnership-conti-v.jpg",label:"Continental industrial V-belts"},{src:"/assets/partnership-conti-rubber.jpg",label:"Rubber synchronous belts"},{src:"/assets/partnership-conti-pu.jpg",label:"Polyurethane synchronous belts"}],
  },
  whm: {
    logo:"/assets/partners/whm.png", label:"AUTHORIZED WHM REPRESENTATIVE · SINCE 2026", headline:"Advanced Drive Technology, Closer to Our Customers.",
    intro:["Since 2026 we are proud to announce QTM group received authorization from Wilhelm Herm. Muller group representing their interests in the region.","In 2026, QTM Group was officially authorized by the Wilhelm Herm. Müller Group (WHM) to represent its products and business interests across the region. We are proud to begin this partnership and bring WHM’s advanced drive-technology solutions closer to our customers."],
    detail:"The partnership combines WHM’s specialized drive-technology capabilities with QTM’s regional market knowledge and customer support. Together, we can address standard and customized belt requirements with closer technical and commercial coordination.",
    images:[{src:"/assets/partnership-whm-timing.jpg",label:"PU timing-belt systems"},{src:"/assets/partnership-whm-pulleys.jpg",label:"Synchronous pulleys and components"},{src:"/assets/partnership-whm-esband.jpg",label:"Endless drive and conveyor belts"}],
  },
};

function PrincipalPartnershipPage({slug}:{slug:string}){
  const s=findSupplier(slug); const profile=principalPartnerships[slug]; if(!s||!profile)return <NotFound/>;
  return <><section className="partnership-page-hero"><div className="container"><Breadcrumbs parts={[{label:"Suppliers",href:"/suppliers"},{label:s.name}]}/><div className="partnership-hero-grid"><div><p className="eyebrow"><b>{profile.label}</b></p><h1>{profile.headline}</h1>{profile.intro.map((copy,i)=><p key={i}>{copy}</p>)}<div className="button-row"><Button href={`/request-a-quote?supplier=${slug}`}>Discuss a Requirement</Button><a className="text-link light" href={s.url} target="_blank" rel="noreferrer">{s.name} <Arrow/></a></div></div><div className="partnership-hero-logo"><img src={profile.logo} alt={`${s.name} logo`}/><span>Strategic regional partnership</span></div></div></div></section>
    <section className="section"><div className="container partnership-editorial"><SectionHeading number="01" eyebrow="OUR PARTNERSHIP" title={`QTM Group × ${s.name}`}/><div className="partnership-long-copy"><p>{profile.detail}</p><p>Customers benefit from one responsive regional contact for inquiries, product matching and coordination with the manufacturer. Final specifications and availability are confirmed for every application.</p></div></div></section>
    <section className="partnership-gallery"><div className="container"><SectionHeading eyebrow="PRODUCT TECHNOLOGY" title="Solutions Available Through QTM"/><div className="partnership-gallery-grid">{profile.images.map((image,i)=><figure key={image.src+image.label}><div style={{backgroundImage:`url(${image.src})`}}/><figcaption><span>{String(i+1).padStart(2,"0")}</span>{image.label}</figcaption></figure>)}</div><div className="partnership-product-list">{s.products.map(x=><span key={x}>{x}</span>)}</div></div></section>
    <section className="section partnership-contact"><div className="container"><div><p className="eyebrow"><b>REGIONAL SUPPORT</b></p><h2>Let’s review your application.</h2></div><div className="button-row"><Button href={`/request-a-quote?supplier=${slug}`}>Request a Quote</Button><Button href="/contact-us" secondary>Contact QTM</Button></div></div></section></>;
}

function SupplierPage({slug}:{slug:string}){if(principalPartnerships[slug])return <PrincipalPartnershipPage slug={slug}/>;const s=findSupplier(slug);if(!s)return <NotFound/>;const related=products.filter(p=>p.suppliers.some(x=>x.includes(s.name.split(" /")[0])||s.name.includes(x.split(" /")[0])));return <><PageHero eyebrow="SUPPLIER NETWORK" title={s.name} copy={s.relationship} parts={[{label:"Suppliers",href:"/suppliers"},{label:s.name}]}/><section className="section"><div className="container supplier-detail"><div className="large-logo-placeholder" data-asset={s.mark}><span>{s.name}</span></div><div><SectionHeading eyebrow="PRODUCT AREAS" title="Solutions Available Through QTM"/><ul className="line-list">{s.products.map(x=><li key={x}>{x}</li>)}</ul><div className="button-row"><Button href={`/request-a-quote?supplier=${slug}`}>Request a Quote</Button><Button href="/contact-us" secondary>Contact QTM</Button></div><a className="official-website" href={s.url} target="_blank" rel="noreferrer">{s.name} website <Arrow/></a></div></div></section>{related.length>0&&<section className="section light-section"><div className="container"><SectionHeading eyebrow="RELATED PRODUCTS" title={`Explore ${s.name} Product Areas`}/><div className="catalogue-grid">{related.map(p=><ProductCard product={p} key={p.slug}/>)}</div></div></section>}<FinalCta/></>}

function IndustriesPage(){const loop=[...industries,...industries];return <><section className="about-intro industries-hero-intro"><div className="about-hero-copy industries-hero-copy"><Breadcrumbs parts={[{label:"Industries"}]}/><h1>Industries</h1><p>Applications First. Products Selected Around Them.</p></div><div className="about-hero-media industries-hero-media"><img src="/assets/qtm-industries-panorama-v2.png" alt="Core industrial applications served by QTM Group"/></div></section><section className="section industries-page-intro"><div className="container"><SectionHeading number="01" eyebrow="QTM'S CORE INDUSTRIES" title="Belting Solutions for the Industries We Serve"/></div><div className="industry-marquee"><div className="industry-scroller">{loop.map((industry,i)=><a key={`${industry.slug}-${i}`} href={`/industries/${industry.slug}`} aria-hidden={i>=industries.length} tabIndex={i>=industries.length?-1:undefined}><span>{String((i%industries.length)+1).padStart(2,"0")}</span><h3>{industry.name}</h3><Arrow/></a>)}</div></div></section><section className="section light-section"><div className="container"><SectionHeading number="02" eyebrow="CORE INDUSTRIES" title="Explore by Application"/><div className="industry-directory">{industries.map((i,index)=><a key={i.slug} href={`/industries/${i.slug}`}><span>{String(index+1).padStart(2,"0")}</span><h2>{i.name}</h2><p>Applications, product families and technical support</p><Arrow/></a>)}</div></div></section><FinalCta/></>}

const coverageRegions = {
  "Central Asia": ["kz","kg","tj","tm","uz"],
  "Middle East": ["ae","bh","eg","lb","om","qa","sa"],
  "Caucasus & Moldova": ["am","ge","md"],
  "Mongolia": ["mn"],
};

function WorldCoverageMap(){const [active,setActive]=useState("Central Asia");const regionFor=(id:string)=>Object.entries(coverageRegions).find(([,ids])=>ids.includes(id))?.[0];const details:Record<string,string>={"Central Asia":"Kazakhstan · Kyrgyzstan · Tajikistan · Turkmenistan · Uzbekistan","Middle East":"Saudi Arabia · United Arab Emirates · Bahrain · Oman · Qatar · Egypt · Lebanon","Caucasus & Moldova":"Armenia · Georgia · Moldova","Mongolia":"Dedicated highlighted market coverage"};return <div className="world-coverage-map"><svg viewBox={worldMap.viewBox} role="img" aria-label="World map highlighting QTM coverage in Central Asia, the Middle East, Mongolia, the Caucasus and Moldova">{worldMap.locations.filter((location:any)=>!regionFor(location.id)).map((location:any)=><path className="map-country" key={location.id} d={location.path}/>) }{Object.entries(coverageRegions).map(([region,ids])=><g key={region} className={`map-region ${region==="Mongolia"?"mongolia-region":""} ${active===region?"active":""}`} tabIndex={0} role="button" aria-label={region} onMouseEnter={()=>setActive(region)} onFocus={()=>setActive(region)} onClick={()=>setActive(region)}>{worldMap.locations.filter((location:any)=>ids.includes(location.id)).map((location:any)=><path key={location.id} d={location.path}/>)}</g>)}</svg><div className="map-region-label" aria-live="polite"><span>QTM NETWORK</span><strong>{active}</strong><small>{details[active]}</small></div><div className="map-legend">{Object.keys(coverageRegions).map(region=><button key={region} className={active===region?"active":""} onMouseEnter={()=>setActive(region)} onFocus={()=>setActive(region)} onClick={()=>setActive(region)}>{region}</button>)}</div></div>}

function NetworkPage(){return <><PageHero eyebrow="OUR NETWORK" title="Global Products. Regional Market Knowledge." copy="QTM connects international manufacturers with distributors, OEMs and industrial customers across Central Asia, the Middle East, Mongolia, the Caucasus and selected Eastern European markets." parts={[{label:"Our Network"}]}/><section className="network-map-section"><div className="container"><div className="network-heading"><SectionHeading number="01" eyebrow="REGIONAL COVERAGE" title="A Network Built Around the Markets We Serve" copy="Hover over a highlighted region to explore QTM’s regional reach."/><Button href="/contact-us" secondary>Contact QTM</Button></div><WorldCoverageMap/></div></section><section className="section"><div className="container network-capabilities"><article><span>01</span><h3>Regional Distribution</h3><p>Coordinating premium industrial products with regional distributors and resellers.</p></article><article><span>02</span><h3>OEM & End-User Support</h3><p>Helping customers identify and select suitable solutions for real applications.</p></article><article><span>03</span><h3>Cross-Border Coordination</h3><p>Responsive technical and commercial communication across diverse markets.</p></article></div></section><FinalCta/></>}

function IndustryPage({slug}:{slug:string}){const i=findIndustry(slug);if(!i)return <NotFound/>;const details=industryDetails[slug]||{overview:`Industrial belt, conveying and mechanical power transmission support for ${i.name.toLowerCase()} applications.`,applications:["Production equipment","Conveying systems","Auxiliary drives","Maintenance replacement"],challenges:["Reliability","Correct material selection","Downtime reduction","Regional availability"]};const relevant=products.filter((p)=>p.industries.some(x=>slugify(x)===slug)).slice(0,4);return <><PageHero eyebrow="INDUSTRY SOLUTION" title={i.name} copy={details.overview} parts={[{label:"Industries",href:"/industries"},{label:i.name}]}/><section className="section"><div className="container detail-columns"><div><SectionHeading eyebrow="COMMON APPLICATIONS" title="Where QTM Can Support"/><ul className="line-list">{details.applications.map(x=><li key={x}>{x}</li>)}</ul></div><div><SectionHeading eyebrow="OPERATIONAL CHALLENGES" title="Selection Starts with the Duty"/><ul className="line-list">{details.challenges.map(x=><li key={x}>{x}</li>)}</ul></div></div></section><section className="section light-section"><div className="container"><SectionHeading eyebrow="RELEVANT PRODUCTS" title={`Solutions for ${i.name}`}/><div className="catalogue-grid">{(relevant.length?relevant:products.slice(0,4)).map(p=><ProductCard key={p.slug} product={p}/>)}</div></div></section><section className="section"><div className="container"><SectionHeading eyebrow="TECHNICAL SUPPORT" title="Discuss Your Application"/><InquiryForm kind="quote" product={i.name}/></div></section></>}

const fieldSets={
  contact:["First name*","Last name*","Company*","Email*","Phone","Country*","Inquiry type*","Product category","Supplier","Message*"],
  quote:["Contact name*","Company*","Email*","Phone","Country*","Product category*","Product name","Product code","Belt marking","Profile","Length","Width","Quantity*","Machine manufacturer","Machine model","Application*","Required delivery date","Message"],
  product:["Contact name*","Company*","Email*","Phone","Belt marking","Belt section","Top width","Height","Length","Quantity*","Machine manufacturer","Machine model","Application*"],
  b2b:["First name*","Last name*","Company*","Position","Email*","Phone*","Country*","Website","Customer type*","Industries","Products of interest","Message"],
  identify:["Contact name*","Company","Email*","Phone","Belt marking","Length","Width","Profile / tooth pitch","Machine manufacturer","Machine model","Application","Additional information"],
};

function InquiryForm({kind,product}:{kind:keyof typeof fieldSets;product?:string}){
  const [status,setStatus]=useState(""); const [errors,setErrors]=useState<string[]>([]); const [loading,setLoading]=useState(false);
  const submit=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setLoading(true);setErrors([]);const form=new FormData(e.currentTarget);const missing=fieldSets[kind].filter(x=>x.endsWith("*")&&!String(form.get(slugify(x.replace("*","")))||"").trim());const email=String(form.get("email")||"");if(email&&!/^\S+@\S+\.\S+$/.test(email))missing.push("Valid email");setErrors(missing);if(missing.length){setLoading(false);return;}try{const res=await fetch("/api/submit-inquiry",{method:"POST",body:form});const data=await res.json();if(res.ok){setStatus(data.message||"Your inquiry has been sent successfully. QTM will review it shortly.");e.currentTarget.reset();}else{setErrors([data.error||"Failed to send inquiry"]);}}catch(err){setErrors(["Failed to send inquiry. Please try again or contact QTM directly."]);}finally{setLoading(false);}};
  return <form className="inquiry-form" onSubmit={submit} noValidate>{product&&<input type="hidden" name="prefilled-product" value={product}/>}<div className="form-grid">{fieldSets[kind].map(label=>{const clean=label.replace("*","");const name=slugify(clean);const large=/message|application|information|interest|industries/i.test(clean);const select=/inquiry type|customer type|product category$/i.test(clean);return <label className={large?"field-wide":""} key={label}><span>{clean}{label.endsWith("*")&&<b> *</b>}</span>{select?<select name={name} defaultValue={clean==="Product category"&&product?product:""} disabled={loading}><option value="" disabled>Select</option>{(clean==="Inquiry type"?["Request a Quote","Product Identification","Technical Support","B2B Access","Supplier Inquiry","Partnership","General Inquiry"]:clean==="Customer type"?["Distributor","Reseller","OEM","End User","Service Company","Other"]:products.map(p=>p.name)).map(x=><option key={x}>{x}</option>)}</select>:large?<textarea name={name} rows={4} disabled={loading}/>:<input name={name} type={/email/i.test(clean)?"email":/delivery date/i.test(clean)?"date":"text"} disabled={loading}/>}</label>})}<label className="field-wide file-field"><span>Photograph or document</span><input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" disabled={loading}/><small>PDF, JPG, PNG, DOCX or XLSX</small></label><label className="consent field-wide"><input type="checkbox" name="consent" required disabled={loading}/><span>I consent to QTM processing this inquiry according to the privacy policy. *</span></label></div>{errors.length>0&&<div className="form-error" role="alert">Please complete: {errors.join(", ")}.</div>}{status&&<div className="form-success" role="status">{status}</div>}<button className="button" type="submit" disabled={loading}>{loading?"Sending...":"Submit Inquiry"} {!loading&&<Arrow/>}</button></form>;
}

function ContactPage(){return <><PageHero eyebrow="CONTACT QTM" title="Tell Us What You Need" copy="Use the form for quotations, product identification, technical support, B2B access, supplier inquiries or partnerships." parts={[{label:"Contact Us"}]}/><section className="section"><div className="container contact-layout"><aside><Logo/><p>Central Asia · Middle East · CIS region</p><dl><dt>Email</dt><dd><a href="mailto:info@qtm-group.com">info@qtm-group.com</a></dd><dt>Phone</dt><dd><a href="tel:+37443552522">+374 43 552522</a></dd></dl></aside><div><SectionHeading eyebrow="GENERAL INQUIRY" title="Start a Conversation"/><InquiryForm kind="contact"/></div></div></section></>}

function QuotePage(){const params=useSearchParams();const slug=params.get("product");const prefill=slug?findProduct(slug)?.name||"":"";return <><PageHero eyebrow="REQUEST A QUOTE" title="Share the Product and Application Details" copy="The more information you provide, the more efficiently QTM can review the requirement with the appropriate supplier." parts={[{label:"Request a Quote"}]}/><section className="section"><div className="container"><InquiryForm key={prefill} kind="quote" product={prefill}/></div></section></>}
function IdentificationPage(){return <><PageHero eyebrow="PRODUCT IDENTIFICATION" title="Have a Belt but Don’t Know Its Reference?" copy="Send the marking, dimensions, machine model or a clear photograph. QTM will help identify a suitable replacement." parts={[{label:"Product Identification"}]}/><section className="section"><div className="container identification-page"><div className="identify-guide">{[["01","Photograph","Capture the full belt and a close-up of the marking."],["02","Dimensions","Share length, width, height and tooth pitch where relevant."],["03","Machine","Add the manufacturer, model and application."],["04","Quantity","Tell us how many pieces are required."]].map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div><InquiryForm kind="identify"/></div></section></>}

function B2BPage(){return <section className="b2b-coming-soon"><div className="container b2b-coming-soon-inner">
  <p className="eyebrow"><b>B2B CUSTOMER PORTAL</b></p>
  <div className="b2b-gear" aria-hidden="true">
    <svg viewBox="0 0 200 200" focusable="false">
      <g className="b2b-gear-spin">
        {Array.from({length:12}).map((_,index)=><rect key={index} x="91" y="7" width="18" height="34" rx="3" transform={`rotate(${index*30} 100 100)`}/>) }
        <circle cx="100" cy="100" r="72"/>
        <circle className="b2b-gear-cutout" cx="100" cy="100" r="49"/>
      </g>
    </svg>
    <img src="/assets/qtm-group-logo-transparent.png" alt=""/>
  </div>
  <h1>Coming Soon</h1>
  <p>The QTM B2B customer portal is currently being prepared.</p>
  <a className="text-link" href="/">Return to Home <Arrow/></a>
</div></section>}

function NewsCard({article,featured=false}:{article:typeof news[number];featured?:boolean}){return <article className={`news-card ${featured?"featured":""}`}><div className="news-visual"><span>DRAFT</span></div><div><p className="mono-label">{article.category} · {article.status}</p><h3><a href={`/news/${article.slug}`}>{article.title}</a></h3><p>{article.excerpt}</p><a className="text-link" href={`/news/${article.slug}`}>Read more <Arrow/></a></div></article>}

function NewsPage(){const [query,setQuery]=useState("");const [category,setCategory]=useState("All categories");const [supplier,setSupplier]=useState("All suppliers");const filtered=news.filter(n=>(category==="All categories"||n.category===category)&&(supplier==="All suppliers"||n.supplier===supplier)&&(!query||`${n.title} ${n.excerpt}`.toLowerCase().includes(query.toLowerCase())));return <><PageHero eyebrow="NEWS & INSIGHTS" title="QTM News and Industry Updates" copy="Editable draft placeholders for company, supplier, product and technical updates. No unapproved announcements are published." parts={[{label:"News"}]}/><section className="section"><div className="container"><div className="news-filters"><label><span>Search articles</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search news"/></label><label><span>Category</span><select value={category} onChange={e=>setCategory(e.target.value)}><option>All categories</option>{[...new Set(news.map(n=>n.category))].map(x=><option key={x}>{x}</option>)}</select></label><label><span>Supplier</span><select value={supplier} onChange={e=>setSupplier(e.target.value)}><option>All suppliers</option>{[...new Set(news.map(n=>n.supplier))].map(x=><option key={x}>{x}</option>)}</select></label></div><div className="news-grid">{filtered.map((n,i)=><NewsCard key={n.slug} article={n} featured={i===0}/>)}</div><nav className="pagination" aria-label="News pages"><button aria-current="page">1</button><button disabled>2</button><span>More pages appear when approved articles are added.</span></nav></div></section></>}

function NewsArticle({slug}:{slug:string}){const a=news.find(n=>n.slug===slug);if(!a)return <NotFound/>;return <><PageHero eyebrow={a.category} title={a.title} copy={a.excerpt} parts={[{label:"News",href:"/news"},{label:a.title}]}/><article className="article-body container"><p className="draft-banner">This is an editable draft placeholder. Publication date, quotations and announcement details must be approved before launch.</p><h2>Article introduction</h2><p>Use this structure for a concise company or technical update. Replace this paragraph with approved QTM content while preserving the clear hierarchy and related links below.</p><h2>Key information</h2><p>Explain the customer relevance, supported products or supplier context without making unsupported performance claims.</p><div className="article-cta"><h3>Have a related application?</h3><Button href="/contact-us">Contact QTM</Button></div></article></>}

function SearchPage(){const [q,setQ]=useState("");useEffect(()=>{setQ(new URLSearchParams(window.location.search).get("q")||"")},[]);const groups=useMemo(()=>{const x=q.toLowerCase();return {Products:products.filter(p=>`${p.name} ${p.description} ${p.subcategories.join(" ")}`.toLowerCase().includes(x)),Suppliers:suppliers.filter(s=>`${s.name} ${s.relationship} ${s.products.join(" ")}`.toLowerCase().includes(x)),Industries:industries.filter(i=>i.name.toLowerCase().includes(x)),News:news.filter(n=>`${n.title} ${n.excerpt}`.toLowerCase().includes(x))}},[q]);return <><PageHero eyebrow="SITE SEARCH" title="Find Products, Suppliers and Industries" copy="Search the structured QTM website catalogue." parts={[{label:"Search"}]}/><section className="section"><div className="container"><form className="search-page-form" onSubmit={e=>e.preventDefault()}><label htmlFor="site-search">Search QTM</label><input id="site-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Enter a product, supplier or industry"/><button className="button">Search <Arrow/></button></form>{q&&<div className="search-results">{Object.entries(groups).map(([group,items])=><section key={group}><h2>{group} <span>{items.length}</span></h2>{items.map((item:any)=>{const href=group==="Products"?`/products/${item.slug}`:group==="Suppliers"?`/suppliers/${item.slug}`:group==="Industries"?`/industries/${item.slug}`:`/news/${item.slug}`;return <a key={item.slug} href={href}><strong>{item.name||item.title}</strong><p>{item.description||item.relationship||item.excerpt||"Industry applications and solutions"}</p><Arrow/></a>})}</section>)}</div>}</div></section></>}

const legalUpdated="Last updated: 5 September 2026";
const legalContact=<><a href="mailto:info@qtm-group.com">info@qtm-group.com</a> or <a href="tel:+37443552522">+374 43 552522</a></>;
function PrivacyPolicy(){return <><PageHero eyebrow="LEGAL" title="Privacy Policy" copy="How QTM GROUP LLC collects, uses and protects personal data submitted through this website." parts={[{label:"Privacy Policy"}]}/><section className="section"><div className="container legal-copy"><p className="legal-updated">{legalUpdated}</p><div className="legal-notice-box"><p><strong>Placeholder to confirm:</strong> QTM GROUP LLC is identified as a company registered in Armenia, but the registered office address has not been provided. Add the full legal address before final legal approval.</p></div>
<h2>1. Who We Are</h2><p>This website is operated by QTM GROUP LLC, a company registered in Armenia. QTM Group supplies industrial belts, conveyor belts, power transmission products and related industrial solutions across Armenia, the CIS, Central Asia and the Middle East.</p><p>For privacy questions or requests, contact QTM Group at {legalContact}.</p>
<h2>2. Personal Data We Collect</h2><p>We collect personal data that you choose to provide when you contact QTM Group, request a quotation, submit a product identification request, apply for B2B access, send files or communicate with us by email or phone.</p><ul><li>Contact details, such as your name, company, position, email address, phone number, country and website.</li><li>Commercial inquiry details, such as customer type, product category, product name, supplier interest, quantity, delivery date and message content.</li><li>Technical product details, such as belt marking, profile, tooth pitch, dimensions, machine manufacturer, machine model, application and uploaded photographs or documents.</li><li>B2B login or access-request information, such as business identity, role, products of interest and account-related communication.</li><li>Basic technical information normally sent by a browser, such as IP address, browser type, device type, page requested, time of request and referring page, where this is recorded by hosting or security logs.</li></ul>
<h2>3. Forms and Current Submission Setup</h2><div className="legal-notice-box"><p><strong>Current implementation note:</strong> the website source reviewed on 5 September 2026 validates form fields in the browser and displays a confirmation message. No server-side form delivery endpoint was found in the reviewed source. If QTM later connects email delivery, CRM storage, analytics or a B2B account system, this policy should be updated before launch of that feature.</p></div>
<h2>4. Analytics and Tracking</h2><p>Based on the current website source, QTM Group does not load Google Analytics, Meta Pixel, LinkedIn Insight Tag, advertising pixels or similar analytics scripts. The site stores a language preference in the visitor’s browser using local storage when a visitor selects a language.</p><p>The site may load limited third-party resources, including country flag images and embedded media from YouTube’s privacy-enhanced domain when a visitor opens the video player. Those third-party services may receive technical connection information from the visitor’s browser.</p>
<h2>5. How We Use Personal Data</h2><p>QTM Group uses personal data for legitimate business, contractual and pre-contractual purposes, including to:</p><ul><li>respond to questions, quote requests and technical support inquiries;</li><li>identify belts, components and suitable replacement products;</li><li>review machine, application and product requirements;</li><li>coordinate supply, availability, logistics and commercial follow-up;</li><li>manage B2B access requests and customer relationships;</li><li>protect the website, prevent misuse and maintain business records;</li><li>comply with legal, tax, accounting and regulatory obligations.</li></ul>
<h2>6. Sharing With Partner Brands and Service Providers</h2><p>Where necessary for product selection, technical review, quotation, warranty handling or supply coordination, QTM Group may share relevant inquiry and application details with manufacturer and partner brands, including Megadyne, Ammeraal Beltech, Sampla, Continental / ContiTech and Wilhelm Herm. Müller (WHM). QTM Group shares only the information reasonably needed for the specific inquiry or business purpose.</p><p>QTM Group may also share data with website hosting providers, email providers, IT support, logistics providers, professional advisers and authorities where required by law. QTM Group does not sell personal data.</p>
<h2>7. International Transfers</h2><p>Because QTM Group operates across Armenia, the CIS, Central Asia and the Middle East and works with international partner brands, personal data may be processed or reviewed outside your country. Where applicable, QTM Group will use reasonable safeguards and share data only for the business purposes described in this policy.</p>
<h2>8. Storage and Retention</h2><p>QTM Group keeps personal data only as long as reasonably necessary for the purpose for which it was collected, including responding to inquiries, providing quotations, handling customer relationships, maintaining technical records and meeting legal or accounting obligations.</p><div className="legal-notice-box"><p><strong>Placeholder to confirm:</strong> exact retention periods and the exact systems used for CRM, email archives, file storage and B2B accounts have not been confirmed. Inquiry records should be reviewed periodically and deleted or anonymized when no longer needed.</p></div>
<h2>9. Security</h2><p>QTM Group aims to use reasonable technical and organizational measures to protect personal data against unauthorized access, loss, misuse or disclosure. No website, email or online storage system can be guaranteed to be completely secure.</p>
<h2>10. Your Rights</h2><p>Depending on your location and applicable law, you may have rights to request access to your personal data, correction of inaccurate data, deletion of data, restriction or objection to processing, withdrawal of consent where processing is based on consent, and information about how your data is used.</p><p>To exercise these rights, email <a href="mailto:info@qtm-group.com">info@qtm-group.com</a> with your name, company, contact details and the request you want QTM Group to review. QTM Group may need to verify your identity before responding.</p>
<h2>11. Applicable Law</h2><p>As an Armenian company, QTM Group is subject to applicable Armenian law, including the Law of the Republic of Armenia on Protection of Personal Data. If QTM Group offers goods or services to, or monitors the behavior of, individuals in the European Union or United Kingdom, the EU GDPR and/or UK GDPR may apply. Depending on the country of the visitor, customer or transaction, other regional privacy laws may also be relevant, including data protection laws in CIS countries and Gulf markets such as the UAE Personal Data Protection Law and Saudi Arabia’s Personal Data Protection Law.</p><p>This policy is intended as website-level transparency information and should be reviewed by qualified legal counsel for each target market before being treated as final legal advice.</p>
<h2>12. Changes to This Policy</h2><p>QTM Group may update this Privacy Policy when website functions, business processes, legal requirements or partner arrangements change. The latest version will be posted on this page with the last-updated date.</p></div></section></>}

function CookiePolicy(){return <><PageHero eyebrow="LEGAL" title="Cookie Policy" copy="What cookies and similar technologies are used on the QTM Group website." parts={[{label:"Cookie Policy"}]}/><section className="section"><div className="container legal-copy"><p className="legal-updated">{legalUpdated}</p><h2>1. Overview</h2><p>This Cookie Policy explains how QTM GROUP LLC uses cookies, local storage and similar technologies on this website.</p><h2>2. What the Site Currently Uses</h2><p>Based on the current website source reviewed on 5 September 2026, QTM Group does not load non-essential analytics cookies, marketing cookies, advertising pixels or behavioral tracking scripts.</p><table className="legal-table"><thead><tr><th>Technology</th><th>Purpose</th><th>Type</th></tr></thead><tbody><tr><td>Local storage language preference</td><td>Stores the visitor’s selected language so the site can keep that preference on later visits.</td><td>Functional / preference</td></tr><tr><td>Hosting and security logs</td><td>The hosting environment may process technical request data such as IP address, browser details, requested URL and time of request for security, diagnostics and delivery.</td><td>Essential</td></tr><tr><td>Third-party media or external assets</td><td>Country flag images and the YouTube privacy-enhanced video embed may be requested by the visitor’s browser when those elements are loaded or used.</td><td>External service request</td></tr></tbody></table><h2>3. Essential, Analytics and Marketing Cookies</h2><p><strong>Essential technologies</strong> are used to deliver the website, keep it secure and allow normal browser requests.</p><p><strong>Analytics technologies</strong> are not currently found in the reviewed website source. If QTM Group adds analytics in the future, the policy should name the tool, explain the purpose and configure consent where required.</p><p><strong>Marketing technologies</strong> are not currently found in the reviewed website source. If advertising or retargeting pixels are added, visitors should receive an appropriate consent choice before those tools load.</p><h2>4. Cookie Consent Banner</h2><p>Because the reviewed website source does not load non-essential cookies or tracking scripts, a cookie consent banner has not been added at this time. If analytics, marketing pixels, heatmaps, chat widgets or other non-essential tracking tools are added later, QTM Group should add a consent banner that lets visitors accept or decline before those tools load.</p><h2>5. Managing Cookies and Local Storage</h2><p>You can manage cookies and local storage through your browser settings. Most browsers allow you to block cookies, delete existing cookies, clear local storage or set preferences for specific websites. Blocking essential technologies may affect website functionality.</p><h2>6. Contact</h2><p>For questions about this Cookie Policy, contact QTM Group at {legalContact}.</p></div></section></>}

function TermsPage(){return <><PageHero eyebrow="LEGAL" title="Terms of Service" copy="Rules for using the QTM Group website and requesting information through it." parts={[{label:"Terms of Service"}]}/><section className="section"><div className="container legal-copy"><p className="legal-updated">{legalUpdated}</p><div className="legal-notice-box"><p><strong>Placeholder to confirm:</strong> QTM GROUP LLC is identified as registered in Armenia, but the full registered office address has not been provided. Add the full legal address before final legal approval.</p></div><h2>1. About These Terms</h2><p>These Terms of Service govern use of the QTM Group website operated by QTM GROUP LLC, a company registered in Armenia. By using this website, you agree to use it only for lawful business, informational and inquiry purposes.</p><h2>2. Website Content</h2><p>The website provides information about industrial belts, conveyor belts, power transmission products, partner brands, industries served and QTM Group’s regional support. Product information is provided for general guidance only and does not create a binding quotation, technical guarantee or supply commitment.</p><p>Final product suitability, specifications, availability, price, delivery terms and warranty terms must be confirmed in writing by QTM Group or the relevant manufacturer.</p><h2>3. Acceptable Use</h2><p>You must not use this website to:</p><ul><li>submit false, misleading, unlawful or malicious information;</li><li>upload files that contain malware, viruses or unlawful material;</li><li>attempt to gain unauthorized access to the website, server, forms, B2B portal or related systems;</li><li>copy, scrape, overload, reverse engineer or interfere with the website or its security;</li><li>misuse QTM Group contact forms, email links or product identification tools for spam or unrelated solicitation;</li><li>infringe the rights of QTM Group, partner brands or third parties.</li></ul><h2>4. B2B Access</h2><p>Any B2B login or customer portal access is intended only for authorized business users. QTM Group may approve, refuse, suspend or remove B2B access where necessary for security, business, compliance or operational reasons.</p><h2>5. Intellectual Property</h2><p>All website design, text, structure, graphics and QTM Group branding are owned by or licensed to QTM GROUP LLC, unless otherwise stated. QTM Group logos and materials may not be copied, modified or used without permission.</p><p>Partner names, logos, product names, product images, trademarks and technical materials, including those associated with Megadyne, Ammeraal Beltech, Sampla, Continental / ContiTech, Wilhelm Herm. Müller, BRECO and BRECOFLEX, remain the property of their respective owners.</p><h2>6. Third-Party Links</h2><p>The website may link to partner manufacturer websites, product data sheets, videos or other third-party resources. QTM Group is not responsible for the content, accuracy, availability, security or privacy practices of third-party websites.</p><h2>7. Disclaimer of Liability</h2><p>The website is provided on an “as available” basis. QTM Group aims to keep information accurate and useful, but does not guarantee that the website will be uninterrupted, error-free or fully up to date. To the maximum extent permitted by applicable law, QTM Group is not liable for indirect, incidental, consequential or business-loss damages arising from use of the website or reliance on general website information.</p><p>Nothing in these Terms excludes liability that cannot be excluded under applicable law.</p><h2>8. Inquiries, Quotations and Orders</h2><p>Submitting a form, email or product identification request does not create a binding contract. A contract, order or supply obligation exists only when confirmed through QTM Group’s accepted commercial process and agreed written terms.</p><h2>9. Privacy</h2><p>Use of personal data is described in the <a href="/privacy-policy">Privacy Policy</a> and <a href="/cookie-policy">Cookie Policy</a>.</p><h2>10. Governing Law and Jurisdiction</h2><p>These Terms are governed by the laws of the Republic of Armenia, unless mandatory laws in another jurisdiction apply. Courts of the Republic of Armenia shall have jurisdiction over disputes relating to this website, subject to any mandatory consumer, privacy or trade-law rights that may apply in another country.</p><h2>11. Changes to These Terms</h2><p>QTM Group may update these Terms when the website, business processes or legal requirements change. The latest version will be posted on this page with the last-updated date.</p><h2>12. Contact</h2><p>For questions about these Terms, contact QTM Group at {legalContact}.</p></div></section></>}
function LegalPage({type}:{type:string}){return type==="privacy-policy"?<PrivacyPolicy/>:type==="cookie-policy"?<CookiePolicy/>:<TermsPage/>}

function NotFound(){return <section className="not-found"><div className="container"><p className="eyebrow"><b>404</b>PAGE NOT FOUND</p><h1>This route is not available.</h1><p>Return to the QTM product catalogue or ask the team for help.</p><div className="button-row"><Button href="/products">View Products</Button><Button href="/contact-us" secondary>Contact QTM</Button></div></div></section>}

export default function QtmSite({segments=[]}:{segments?:string[]}){
  const [language,setLanguage]=useState<Language>("en");
  useEffect(()=>{const saved=window.localStorage.getItem("qtm-language");if(saved==="ru")setLanguage("ru")},[]);
  const changeLanguage=(next:Language)=>{setLanguage(next);window.localStorage.setItem("qtm-language",next)};
  const path=`/${segments.join("/")}`.replace(/\/$/,"")||"/";
  let page:ReactNode;
  if(path==="/")page=<HomePage/>;
  else if(path==="/about-us")page=<AboutPage/>;
  else if(path==="/products")page=<ProductsPage/>;
  else if(path==="/products/timing-belts")page=<TimingBeltsPage/>;
  else if(path==="/products/timing-belts/polyurethane-open-end")page=<PolyurethaneOpenEndPage/>;
  else if(path==="/products/timing-belts/polyurethane-endless")page=<TimingBeltDetailPage slug="polyurethane-endless"/>;
  else if(path==="/products/timing-belts/rubber-open-end")page=<TimingBeltDetailPage slug="rubber-open-end"/>;
  else if(path==="/products/timing-belts/rubber-endless")page=<TimingBeltDetailPage slug="rubber-endless"/>;
  else if(path==="/products/v-belts")page=<VBeltsPage/>;
  else if(path==="/products/v-belts/rubber-wrapped")page=<VBeltDetailPage slug="rubber-wrapped"/>;
  else if(path==="/products/v-belts/rubber-banded")page=<VBeltDetailPage slug="rubber-banded"/>;
  else if(segments[0]==="products"&&segments[1])page=<ProductPage slug={segments[1]}/>;
  else if(path==="/suppliers")page=<SuppliersPage/>;
  else if(segments[0]==="suppliers"&&segments[1])page=<SupplierPage slug={segments[1]}/>;
  else if(path==="/industries")page=<IndustriesPage/>;
  else if(segments[0]==="industries"&&segments[1])page=<IndustryPage slug={segments[1]}/>;
  else if(path==="/our-network")page=<NetworkPage/>;
  else if(path==="/contact-us")page=<ContactPage/>;
  else if(path==="/request-a-quote")page=<QuotePage/>;
  else if(path==="/product-identification")page=<IdentificationPage/>;
  else if(path==="/b2b")page=<B2BPage/>;
  else if(path==="/news")page=<NewsPage/>;
  else if(segments[0]==="news"&&segments[1])page=<NewsArticle slug={segments[1]}/>;
  else if(path==="/search")page=<SearchPage/>;
  else if(["/privacy-policy","/cookie-policy","/terms"].includes(path))page=<LegalPage type={segments[0]}/>;
  else page=<NotFound/>;
  return <><AutoTranslate language={language}/><Header path={path} language={language} onLanguageChange={changeLanguage}/><main id="main">{page}</main><Footer/></>;
}
