/* ==========================================================================
   CV Generator — Application Logic
   ========================================================================== */

const STORAGE_KEY = "cv-generator-data";
const STORAGE_HASH_KEY = "cv-generator-json-hash";

let cvData = null;

const ICONS = {
  email: `<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>`,
  phone: `<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  location: `<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedIn: `<svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.537H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.54v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  github: `<svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 012.996-.404 11.5 11.5 0 012.996.404c2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>`
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function escapeHtml(text) {
  if (text == null) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function hasText(value) {
  return value != null && String(value).trim() !== "";
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function setByPath(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current = current[isNaN(key) ? key : Number(key)];
  }
  const lastKey = keys[keys.length - 1];
  current[isNaN(lastKey) ? lastKey : Number(lastKey)] = value;
}

function asLines(value) {
  if (Array.isArray(value)) return value.filter((line) => hasText(line));
  if (!hasText(value)) return [];
  return [String(value)];
}

function contactHref(field, value) {
  const v = (value || "").trim();
  if (!v) return "#";

  switch (field) {
    case "personal.email":
      return `mailto:${v}`;
    case "personal.phone":
      return `tel:${v.replace(/[^\d+]/g, "")}`;
    case "personal.linkedIn":
    case "personal.github":
      return v.startsWith("http") ? v : `https://${v}`;
    default:
      return v;
  }
}

function contactLabel(field, value) {
  const v = (value || "").trim();
  if (field === "personal.linkedIn") return v || "LinkedIn";
  if (field === "personal.github") return v || "GitHub";
  return v;
}

function emptyCvData() {
  return {
    personal: {},
    experiences: [],
    education: [],
    skills: [],
    interests: [],
    languages: [],
    projects: [],
    achievements: []
  };
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    console.log("Saved to localStorage:", cvData);
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

function normalizeCvData() {
  if (Array.isArray(cvData.skills)) {
    cvData.skills = cvData.skills.filter(hasText);
  }
}

async function loadData() {
  let jsonText = null;
  let jsonData = null;

  try {
    const response = await fetch(`cv-data.json?t=${Date.now()}`);
    if (response.ok) {
      jsonText = await response.text();
      jsonData = JSON.parse(jsonText);
    }
  } catch (err) {
    console.warn("Could not fetch cv-data.json — run start-server.bat first.", err);
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  const storedHash = localStorage.getItem(STORAGE_HASH_KEY);
  const currentHash = jsonText ? hashString(jsonText) : null;

  if (jsonData && currentHash) {
    if (stored && storedHash === currentHash) {
      cvData = JSON.parse(stored);
      console.log("Loaded from localStorage (cv-data.json unchanged)");
    } else {
      cvData = jsonData;
      localStorage.setItem(STORAGE_HASH_KEY, currentHash);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
      console.log("Loaded from cv-data.json");
    }
  } else if (stored) {
    cvData = JSON.parse(stored);
    console.log("Loaded from localStorage (fetch failed)");
  } else {
    cvData = emptyCvData();
    console.warn("No data source available.");
  }

  normalizeCvData();
}

// ---------------------------------------------------------------------------
// Visibility — empty fields / sections are hidden (not in PDF either)
// ---------------------------------------------------------------------------

/**
 * Toggle .cv-hidden on blocks marked with data-cv-hide / data-cv-entry / data-cv-section.
 * Called after render and after every edit so cleared fields disappear immediately.
 */
function updateVisibility() {
  document.querySelectorAll("#cv-template [data-cv-hide]").forEach((block) => {
    const field = block.matches("[data-field]")
      ? block
      : block.querySelector("[data-field]");
    if (!field) return;
    block.classList.toggle("cv-hidden", !hasText(field.textContent));
  });

  document.querySelectorAll("#cv-template [data-cv-entry]").forEach((entry) => {
    const fields = entry.querySelectorAll("[data-field]");
    const any = [...fields].some((f) => hasText(f.textContent));
    entry.classList.toggle("cv-hidden", !any);
  });

  document.querySelectorAll("#cv-template [data-cv-section]").forEach((section) => {
    const body = section.querySelector("[data-cv-section-body]");
    if (!body) {
      section.classList.add("cv-hidden");
      return;
    }
    const hasContent =
      [...body.querySelectorAll("[data-cv-entry]:not(.cv-hidden)")].length > 0 ||
      [...body.querySelectorAll("[data-cv-hide]:not(.cv-hidden)")].length > 0 ||
      [...body.querySelectorAll("li[data-field]:not(.cv-hidden)")].length > 0;
    section.classList.toggle("cv-hidden", !hasContent);
  });

  const nav = document.querySelector("#cv-template .contact-links");
  if (nav) {
    const visible = [...nav.querySelectorAll("[data-cv-hide]:not(.cv-hidden)")];
    nav.classList.toggle("cv-hidden", visible.length === 0);
    nav.querySelectorAll(".contact-separator").forEach((sep) => sep.classList.add("cv-hidden"));
    visible.forEach((item, i) => {
      if (i > 0) {
        const prevSep = item.previousElementSibling;
        if (prevSep && prevSep.classList.contains("contact-separator")) {
          prevSep.classList.remove("cv-hidden");
        }
      }
    });
  }

  const leftCol = document.querySelector("#cv-template .cv-col-left");
  const rightCol = document.querySelector("#cv-template .cv-col-right");
  const body = document.querySelector("#cv-template .cv-body");

  if (leftCol) {
    const visibleSections = leftCol.querySelectorAll("[data-cv-section]:not(.cv-hidden)");
    leftCol.classList.toggle("cv-hidden", visibleSections.length === 0);
  }

  if (rightCol) {
    const visibleSections = rightCol.querySelectorAll("[data-cv-section]:not(.cv-hidden)");
    rightCol.classList.toggle("cv-hidden", visibleSections.length === 0);
  }

  if (body && leftCol && rightCol) {
    body.classList.toggle(
      "cv-hidden",
      leftCol.classList.contains("cv-hidden") && rightCol.classList.contains("cv-hidden")
    );
  }
}

// ---------------------------------------------------------------------------
// Render helpers — only output blocks when JSON has content
// ---------------------------------------------------------------------------

function renderSection(title, bodyHTML) {
  if (!bodyHTML || !bodyHTML.trim()) return "";
  return `
    <section class="cv-section" data-cv-section>
      <h2 class="cv-section-title">${title}</h2>
      <div data-cv-section-body>${bodyHTML}</div>
    </section>
  `;
}

function renderEditableField(tag, className, field, value, placeholder) {
  if (!hasText(value)) return "";
  return `
    <${tag} class="${className} cv-block" data-cv-hide contenteditable="true" data-field="${field}" data-placeholder="${placeholder}">${escapeHtml(value)}</${tag}>
  `;
}

function renderContactRow(p) {
  const items = [
    { field: "personal.email", icon: ICONS.email, value: p.email, type: "link" },
    { field: "personal.phone", icon: ICONS.phone, value: p.phone, type: "phone" },
    { field: "personal.linkedIn", icon: ICONS.linkedIn, value: p.linkedIn, type: "link" },
    { field: "personal.github", icon: ICONS.github, value: p.github, type: "link" },
    { field: "personal.location", icon: ICONS.location, value: p.location, type: "text" }
  ];

  const parts = [];
  items.forEach((item) => {
    if (!hasText(item.value)) return;

    if (item.type === "link") {
      const label = contactLabel(item.field, item.value);
      const href = contactHref(item.field, item.value);
      parts.push(`
        <a class="contact-icon-link cv-block" data-cv-hide href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(label)}">
          ${item.icon}
        </a>
        <span class="contact-text visually-hidden" contenteditable="true" data-field="${item.field}" data-link-type="contact" data-placeholder="Contact">${escapeHtml(label)}</span>
      `);
    } else if (item.type === "phone") {
      parts.push(`
        <button type="button" class="contact-icon-button cv-block" data-cv-hide data-copy-field="${item.field}" aria-label="Copy phone number">
          ${item.icon}
        </button>
        <span class="contact-text visually-hidden" contenteditable="true" data-field="${item.field}" data-placeholder="Phone">${escapeHtml(item.value)}</span>
      `);
    } else {
      parts.push(`
        <span class="contact-item cv-block" data-cv-hide>
          ${item.icon}
          <span class="contact-text visually-hidden" contenteditable="true" data-field="${item.field}" data-placeholder="Location">${escapeHtml(item.value)}</span>
        </span>
      `);
    }
  });

  return parts.join("");
}

function renderSkills() {
  return (cvData.skills || [])
    .filter(hasText)
    .map((skill, i) => `
      <span class="skill-pill cv-block" data-cv-hide contenteditable="true" data-field="skills.${i}" data-placeholder="Skill">${escapeHtml(skill)}</span>
    `)
    .join("");
}

function renderStringList(field, items, placeholder) {
  return (items || [])
    .map((item, i) => {
      if (!hasText(item)) return "";
      return `
      <li class="cv-block" data-cv-hide contenteditable="true" data-field="${field}.${i}" data-placeholder="${placeholder}">${escapeHtml(item)}</li>
    `;
    })
    .filter(Boolean)
    .join("");
}

function renderAbout() {
  const about = cvData.personal?.about;
  if (Array.isArray(about)) {
    return about
      .filter(hasText)
      .map((line, i) => `
        <p class="text-sm text-slate-600 about-line cv-block" data-cv-hide contenteditable="true" data-field="personal.about.${i}" data-placeholder="About you...">${escapeHtml(line)}</p>
      `)
      .join("");
  }
  return renderEditableField("p", "text-sm text-slate-600 about-line", "personal.about", about, "About you...");
}

function renderEducation() {
  return (cvData.education || [])
    .map((edu, i) => {
      const institution = renderEditableField("h3", "text-sm font-bold text-slate-800 leading-tight", `education.${i}.institution`, edu.institution, "Institution");
      const startYear = hasText(edu.startYear) ? `<span contenteditable="true" data-field="education.${i}.startYear">${escapeHtml(edu.startYear)}</span>` : "";
      const endYear = hasText(edu.endYear) ? `<span contenteditable="true" data-field="education.${i}.endYear">${escapeHtml(edu.endYear)}</span>` : "";
      const dates =
        startYear || endYear
          ? `<p class="text-xs text-slate-500 mb-0.5 cv-block" data-cv-hide>${startYear}${startYear && endYear ? " – " : ""}${endYear}</p>`
          : "";

      const degree = hasText(edu.degree)
        ? `<span contenteditable="true" data-field="education.${i}.degree">${escapeHtml(edu.degree)}</span>`
        : "";
      const fieldOfStudy = hasText(edu.fieldOfStudy)
        ? `<span contenteditable="true" data-field="education.${i}.fieldOfStudy">${escapeHtml(edu.fieldOfStudy)}</span>`
        : "";
      const degreeLine =
        degree || fieldOfStudy
          ? `<p class="text-xs text-indigo-600 font-medium cv-block" data-cv-hide>${degree}${degree && fieldOfStudy ? ", " : ""}${fieldOfStudy}</p>`
          : "";

      if (!institution && !dates && !degreeLine) return "";

      return `
        <article class="entry-block" data-cv-entry>
          ${institution}
          ${dates}
          ${degreeLine}
        </article>
      `;
    })
    .filter(Boolean)
    .join("");
}

function renderLanguages() {
  return (cvData.languages || [])
    .map((lang, i) => {
      if (!hasText(lang.language) && !hasText(lang.proficiency)) return "";
      const language = hasText(lang.language)
        ? `<span class="font-semibold text-slate-800" contenteditable="true" data-field="languages.${i}.language">${escapeHtml(lang.language)}</span>`
        : "";
      const proficiency = hasText(lang.proficiency)
        ? `<span contenteditable="true" data-field="languages.${i}.proficiency">${escapeHtml(lang.proficiency)}</span>`
        : "";
      return `
        <div class="language-entry text-sm text-slate-600 mb-1 cv-block" data-cv-hide data-cv-entry>
          ${language}${language && proficiency ? '<span class="text-slate-400"> — </span>' : ""}${proficiency}
        </div>
      `;
    })
    .filter(Boolean)
    .join("");
}

function renderExperiences() {
  return (cvData.experiences || [])
    .map((exp, i) => {
      const position = renderEditableField("h3", "text-base font-bold text-slate-800", `experiences.${i}.position`, exp.position, "Position");
      const startYear = hasText(exp.startYear) ? `<span contenteditable="true" data-field="experiences.${i}.startYear">${escapeHtml(exp.startYear)}</span>` : "";
      const endYear = hasText(exp.endYear) ? `<span contenteditable="true" data-field="experiences.${i}.endYear">${escapeHtml(exp.endYear)}</span>` : "";
      const dates =
        startYear || endYear
          ? `<span class="text-xs text-slate-500 whitespace-nowrap shrink-0 cv-block" data-cv-hide>${startYear}${startYear && endYear ? " – " : ""}${endYear}</span>`
          : "";
      const company = renderEditableField("p", "text-sm font-medium text-indigo-600 mb-1", `experiences.${i}.company`, exp.company, "Company");

      const bullets = asLines(exp.description)
        .map((line, j) => `
          <li class="cv-block" data-cv-hide contenteditable="true" data-field="experiences.${i}.description.${j}">${escapeHtml(line)}</li>
        `)
        .join("");
      const bulletList = bullets ? `<ul class="bullet-list">${bullets}</ul>` : "";

      if (!position && !dates && !company && !bulletList) return "";

      return `
        <article class="entry-block" data-cv-entry>
          <div class="flex justify-between items-start gap-2 mb-0.5">
            ${position}
            ${dates}
          </div>
          ${company}
          ${bulletList}
        </article>
      `;
    })
    .filter(Boolean)
    .join("");
}

function renderProjects() {
  return (cvData.projects || [])
    .map((project, i) => {
      const name = renderEditableField("h3", "text-sm font-bold text-slate-800 mb-1", `projects.${i}.name`, project.name, "Project name");
      const link = hasText(project.link)
        ? `<a class="text-xs text-indigo-600 contact-link mb-1 cv-block" data-cv-hide href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" data-link-for="projects.${i}.link">
            <span class="contact-text" contenteditable="true" data-field="projects.${i}.link" data-link-type="contact">${escapeHtml(project.link)}</span>
          </a>`
        : "";
      const description = renderEditableField("p", "text-sm text-slate-600 leading-relaxed", `projects.${i}.description`, project.description, "Description");
      if (!name && !link && !description) return "";
      return `<article class="entry-block" data-cv-entry>${name}${link}${description}</article>`;
    })
    .filter(Boolean)
    .join("");
}

// ---------------------------------------------------------------------------
// Render template
// ---------------------------------------------------------------------------

function render() {
  const template = document.getElementById("cv-template");
  const p = cvData.personal || {};

  const contactHTML = renderContactRow(p);
  const contactNav = contactHTML
    ? `<nav class="contact-links mt-3" aria-label="Contact details">${contactHTML}</nav>`
    : "";

  const skillsHTML = renderSkills();
  const interestsHTML = renderStringList("interests", cvData.interests, "Interest");
  const achievementsHTML = renderStringList("achievements", cvData.achievements, "Achievement");

  const leftSections = [
    renderSection("Education", renderEducation()),
    renderSection("Skills", skillsHTML ? `<div class="flex flex-wrap">${skillsHTML}</div>` : ""),
    renderSection("Languages", renderLanguages()),
    renderSection("Interests", interestsHTML ? `<ul class="bullet-list">${interestsHTML}</ul>` : ""),
    renderSection("Achievements", achievementsHTML ? `<ul class="bullet-list">${achievementsHTML}</ul>` : ""),
    renderSection("Projects", renderProjects())
  ].join("");

  const experienceHTML = renderExperiences();
  const experienceSection = experienceHTML ? renderSection("Experience", experienceHTML) : "";

  template.innerHTML = `
    <header class="cv-header">
      <div class="cv-header-grid">
        <div class="cv-header-main">
          ${renderEditableField("h1", "text-3xl font-extrabold text-slate-900 tracking-tight", "personal.name", p.name, "Full Name")}
          ${renderEditableField("p", "text-lg text-indigo-600 font-medium mt-1", "personal.title", p.title, "Title")}
          ${renderAbout()}
        </div>
        <div class="cv-header-side">
          ${contactNav}
        </div>
      </div>
    </header>

    <div class="cv-body">
      <aside class="cv-col-left flex flex-col gap-5">${leftSections}</aside>
      <main class="cv-col-right">${experienceSection}</main>
    </div>
  `;

  bindEditableElements();
  bindContactActions();
  updateVisibility();
}

function bindContactActions() {
  const template = document.getElementById("cv-template");
  if (!template) return;

  template.querySelectorAll("button[data-copy-field]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const fieldPath = button.getAttribute("data-copy-field");
      if (!fieldPath) return;

      const fieldElement = template.querySelector(`[data-field="${fieldPath}"]`);
      const text = fieldElement ? fieldElement.textContent.trim() : "";
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        button.setAttribute("aria-label", "Phone number copied");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Two-way binding
// ---------------------------------------------------------------------------

function readFieldValue(element) {
  return element.textContent.trim();
}

function syncContactLink(element, fieldPath, value) {
  if (element.getAttribute("data-link-type") !== "contact") return;
  const anchor = element.closest("a[data-link-for]");
  if (!anchor) return;
  anchor.setAttribute("href", contactHref(fieldPath, value));
}

function bindEditableElements() {
  document.querySelectorAll("#cv-template [data-field]").forEach((element) => {
    const handler = () => {
      const fieldPath = element.getAttribute("data-field");
      const newValue = readFieldValue(element);

      setByPath(cvData, fieldPath, newValue);
      syncContactLink(element, fieldPath, newValue);

      console.log("cvData updated:", fieldPath, "→", newValue);
      console.log(cvData);

      saveToLocalStorage();
      updateVisibility();
    };

    element.addEventListener("input", handler);
    element.addEventListener("blur", handler);
  });
}

// ---------------------------------------------------------------------------
// PDF export
// ---------------------------------------------------------------------------

function downloadPDF() {
  saveToLocalStorage();
  updateVisibility();

  const element = document.getElementById("cv-template");
  const name = (cvData.personal && cvData.personal.name) || "Resume";

  element.classList.add("pdf-export");

  html2pdf()
    .set({
      margin: [6, 6, 6, 6],
      filename: `${name.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save()
    .then(() => element.classList.remove("pdf-export"))
    .catch((error) => {
      element.classList.remove("pdf-export");
      console.error("PDF generation failed:", error);
    });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  render();

  document.getElementById("download-pdf-btn").addEventListener("click", downloadPDF);
  window.addEventListener("pagehide", saveToLocalStorage);
  window.addEventListener("beforeunload", saveToLocalStorage);
});
