/* ===========================================================
   CONSTANTS
   =========================================================== */
const KEYS = {
    items: "curriculo-items",
    profile: "curriculo-profile",
    unlocked: "curriculo-unlocked",
    password: "curriculo-password",
    confirmPassword: "curriculo-confirm-password",
};

const DEFAULT_PASSWORD = "admin123";
const DEFAULT_CONFIRM_PASSWORD = "gvizon2026";
const OLD_KEYS = {
    courses: "gabriel-curriculo-cursos",
    academic: "gabriel-curriculo-academic",
    work: "gabriel-curriculo-work",
};

/* ===========================================================
   DEFAULTS
   =========================================================== */
function defaultProfile() {
    return {
        name: "Gabriel Felipe Vizon",
        title: "Estudante de Desenvolvimento de Sistemas | Back-End",
        photo: "Profile.jpeg",
        city: "Barra Bonita",
        state: "SP",
        email: "gabrielvizon1931@gmail.com",
        phone: "(14) 99175-6138",
        summary:
            "Estudante com interesse em tecnologia, programação e desenvolvimento profissional, sempre buscando aprimorar conhecimentos por meio de estudos, cursos e projetos pessoais. Embora ainda não possua experiência profissional na área, desenvolvi habilidades práticas em projetos acadêmicos e pessoais, aplicando conceitos de desenvolvimento de software e resolução de problemas.",
        skills: [
            "Git e GitHub",
            "HTML e CSS",
            "Lógica de Programação",
            "Aprendendo C#",
            "Aprendizado contínuo",
            "Organização",
            "Comunicação",
            "Trabalho em equipe",
        ],
        socialLinks: [
            {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/gabriel-vizon-80630b2b5/",
                icon: "bxl-linkedin-square",
            },
            {
                name: "GitHub",
                url: "https://github.com/GabriellVizon",
                icon: "bxl-github",
            },
        ],
    };
}

function generateId() {
    try {
        return crypto.randomUUID();
    } catch {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }
}

const defaultItems = [
    { id: generateId(), type: "course", name: "Projeto Barracred Conecta", school: "Barracred Conecta", start: "2025-09", status: "Em curso", end: "", present: false, description: "Curso direcionado a programação, desenvolvimento pessoal e desenvolvimento profissional." },
    { id: generateId(), type: "course", name: "Desenvolvimento de Sistemas", school: "Etec", start: "2026-03", status: "Em curso", end: "", present: false, description: "Curso técnico direcionado a programação, tecnologia e desenvolvimento profissional." },
    { id: generateId(), type: "course", name: "Ativa Juventude", school: "Ativa Juventude", start: "2022-02", status: "Concluído", end: "", present: false, description: "Curso focado em desenvolvimento profissional e preparacao para o mercado de trabalho." },
    { id: generateId(), type: "course", name: "Inglês", school: "Centro de Linguas", start: "2023-09", status: "Em curso", end: "", present: false, description: "Aprendizagem do idioma ingles com foco em comunicacao e compreensao. Aulas aos sabados, das 07:00 as 12:00, com conclusao prevista para 06/2026." },
    { id: generateId(), type: "academic", name: "Ensino Médio", school: "", start: "", status: "Completo", end: "", present: false, description: "Formação com foco em exatas, matemática, biotecnologia, programação e empreendedorismo." },
    { id: generateId(), type: "work", name: "Pizzaiolo", school: "Steve's Pizza", start: "2024-07", status: "", end: "2024-12", present: false, description: "Atuação por 5 meses na Steve's Pizza, desenvolvendo responsabilidade, agilidade, organização e trabalho em equipe." },
];

/* ===========================================================
   STATE
   =========================================================== */
let items = [];
let profile = {};
let editingId = null;

/* ===========================================================
   DOM REFS
   =========================================================== */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

const appShell = $(".app-shell");
const adminUnlock = $("#admin-unlock");
const lockPanelBtn = $("#lock-panel-btn");
const statusMessage = $("#save-status");
const importInput = $("#import-data");

const itemForm = $("#item-form");
const itemType = $("#item-type");
const itemName = $("#item-name");
const itemSchool = $("#item-school");
const itemStart = $("#item-start");
const itemEnd = $("#item-end");
const itemStatus = $("#item-status");
const itemPresent = $("#item-present");
const itemDescription = $("#item-description");
const submitLabel = $("#submit-label");
const cancelEditBtn = $("#cancel-edit");

const nameLabel = $("#name-label");
const schoolLabel = $("#school-label");
const dynamicColumn = $("#dynamic-column");
const presentGroup = $("#present-group");

const coursesList = $("#courses-list");
const courseCounter = $("#course-counter");
const academicList = $("#academic-list");
const academicCounter = $("#academic-counter");
const workList = $("#work-list");
const workCounter = $("#work-counter");

const profileForm = $("#profile-form");
const profilePhotoInput = $("#profile-photo-input");
const profileName = $("#profile-name");
const profileTitle = $("#profile-title");
const profileCity = $("#profile-city");
const profileState = $("#profile-state");
const profileEmail = $("#profile-email");
const profilePhone = $("#profile-phone");
const profileSummary = $("#profile-summary");
const profileStatus = $("#profile-status");

const skillInput = $("#skill-input");
const addSkillBtn = $("#add-skill-btn");
const skillsList = $("#skills-list");

const socialNameInput = $("#social-name-input");
const socialUrlInput = $("#social-url-input");
const addSocialBtn = $("#add-social-btn");
const socialList = $("#social-list");

const displayName = $("#display-name");
const displayTitle = $("#display-title");
const displayCity = $("#display-city");
const displayState = $("#display-state");
const displayEmail = $("#display-email");
const displayPhone = $("#display-phone");
const displaySummary = $("#display-summary");
const displaySkills = $("#display-skills");
const displaySocial = $("#display-social");
const displayPhoto = $("#profile-photo");
const displayCopyright = $("#display-copyright");

const itemManager = $("#item-manager");
const securityForm = $("#security-form");
const adminPasswordInput = $("#admin-password");
const confirmPasswordInput = $("#confirm-password");
const securityStatus = $("#security-status");
const clearAllBtn = $("#clear-all");
const printBtn = $("#print-resume");
const exportBtn = $("#export-data");

/* ===========================================================
   DATA : ITEMS
   =========================================================== */
function migrateOldData() {
    const oldCourses = localStorage.getItem(OLD_KEYS.courses);
    const oldAcademic = localStorage.getItem(OLD_KEYS.academic);
    const oldWork = localStorage.getItem(OLD_KEYS.work);
    if (!oldCourses && !oldAcademic && !oldWork) return false;

    const migrated = [];
    const typesInStorage = new Set();

    if (oldCourses) {
        typesInStorage.add("course");
        try {
            const parsed = JSON.parse(oldCourses);
            if (Array.isArray(parsed)) {
                parsed.forEach((c) =>
                    migrated.push({
                        id: c.id || generateId(),
                        type: "course",
                        name: c.name || "Curso",
                        school: c.school || "",
                        start: c.start || "",
                        status: c.status || "Em curso",
                        end: "",
                        present: false,
                        description: c.description || "",
                    })
                );
            }
        } catch {}
        localStorage.removeItem(OLD_KEYS.courses);
    }

    if (oldAcademic) {
        typesInStorage.add("academic");
        try {
            const parsed = JSON.parse(oldAcademic);
            if (Array.isArray(parsed)) {
                parsed.forEach((a) =>
                    migrated.push({
                        id: a.id || generateId(),
                        type: "academic",
                        name: a.course || a.name || "Formação",
                        school: a.school || "",
                        start: a.start || "",
                        status: a.status || "Completo",
                        end: "",
                        present: false,
                        description: a.description || "",
                    })
                );
            }
        } catch {}
        localStorage.removeItem(OLD_KEYS.academic);
    }

    if (oldWork) {
        typesInStorage.add("work");
        try {
            const parsed = JSON.parse(oldWork);
            if (Array.isArray(parsed)) {
                parsed.forEach((w) =>
                    migrated.push({
                        id: w.id || generateId(),
                        type: "work",
                        name: w.role || w.name || "Experiência",
                        school: w.company || w.school || "",
                        start: w.start || "",
                        status: "",
                        end: w.end || "",
                        present: w.present || false,
                        description: w.description || "",
                    })
                );
            }
        } catch {}
        localStorage.removeItem(OLD_KEYS.work);
    }

    defaultItems.forEach((item) => {
        if (!typesInStorage.has(item.type)) {
            migrated.push({ ...item, id: generateId() });
        }
    });

    localStorage.setItem(KEYS.items, JSON.stringify(migrated));
    return true;
}

function loadItems() {
    if (migrateOldData()) {
        const saved = localStorage.getItem(KEYS.items);
        try {
            return JSON.parse(saved);
        } catch {}
    }

    const saved = localStorage.getItem(KEYS.items);
    if (!saved) {
        return defaultItems.map((item) => ({ ...item, id: generateId() }));
    }

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
            ? parsed
            : defaultItems.map((item) => ({ ...item, id: generateId() }));
    } catch {
        return defaultItems.map((item) => ({ ...item, id: generateId() }));
    }
}

function saveItems() {
    localStorage.setItem(KEYS.items, JSON.stringify(items));
}

/* ===========================================================
   DATA : PROFILE
   =========================================================== */
function loadProfile() {
    const saved = localStorage.getItem(KEYS.profile);
    if (!saved) return { ...defaultProfile() };
    try {
        const parsed = JSON.parse(saved);
        const def = defaultProfile();
        return {
            ...def,
            ...parsed,
            socialLinks: Array.isArray(parsed.socialLinks)
                ? parsed.socialLinks
                : def.socialLinks,
            skills: Array.isArray(parsed.skills) ? parsed.skills : def.skills,
        };
    } catch {
        return { ...defaultProfile() };
    }
}

function saveProfile() {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

/* ===========================================================
   DATA : PASSWORD
   =========================================================== */
function loadPassword() {
    return localStorage.getItem(KEYS.password) || DEFAULT_PASSWORD;
}

function savePassword(pwd) {
    localStorage.setItem(KEYS.password, pwd);
}

function loadConfirmPassword() {
    return localStorage.getItem(KEYS.confirmPassword) || DEFAULT_CONFIRM_PASSWORD;
}

function saveConfirmPassword(pwd) {
    localStorage.setItem(KEYS.confirmPassword, pwd);
}

/* ===========================================================
   RENDER : PROFILE
   =========================================================== */
function renderProfile() {
    displayName.textContent = profile.name;
    displayTitle.textContent = profile.title;
    displayCity.textContent = profile.city;
    displayState.textContent = profile.state;
    displayEmail.textContent = profile.email;
    displayPhone.textContent = profile.phone;
    displaySummary.textContent = profile.summary || "Sem descrição.";

    if (profile.photo) {
        displayPhoto.src = profile.photo;
    } else {
        displayPhoto.src = "Profile.jpeg";
    }

    displaySkills.innerHTML = profile.skills
        .map((s) => `<span>${escHtml(s)}</span>`)
        .join("");

    displaySocial.innerHTML = profile.socialLinks
        .map(
            (l) =>
                `<a href="${escHtml(l.url)}" target="_blank" class="social-link" title="${escHtml(l.name)}">
                    <i class="bx ${escHtml(l.icon || "bx-link")}"></i>
                </a>`
        )
        .join("");

    const year = new Date().getFullYear();
    displayCopyright.textContent = `© ${year} - Currículo Dinâmico`;
}

function renderProfileForm() {
    profileName.value = profile.name;
    profileTitle.value = profile.title;
    profileCity.value = profile.city;
    profileState.value = profile.state;
    profileEmail.value = profile.email;
    profilePhone.value = profile.phone;
    profileSummary.value = profile.summary;
}

/* ===========================================================
   RENDER : SKILLS
   =========================================================== */
function renderSkillsEditor() {
    skillsList.innerHTML = profile.skills
        .map(
            (s, i) =>
                `<span class="tag-chip">
                    ${escHtml(s)}
                    <button type="button" data-skill-index="${i}" title="Remover">✕</button>
                </span>`
        )
        .join("");
}

/* ===========================================================
   RENDER : SOCIAL LINKS
   =========================================================== */
function renderSocialEditor() {
    socialList.innerHTML = profile.socialLinks
        .map(
            (l, i) =>
                `<div class="social-chip">
                    <i class="bx ${escHtml(l.icon || "bx-link")}"></i>
                    <span>${escHtml(l.name)}</span>
                    <a href="${escHtml(l.url)}" target="_blank">${escHtml(l.url)}</a>
                    <button type="button" data-social-index="${i}" title="Remover">✕</button>
                </div>`
        )
        .join("");
}

/* ===========================================================
   HELPERS
   =========================================================== */
function escHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatMonth(monthValue) {
    if (!monthValue) return null;
    const [year, month] = monthValue.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        year: "numeric",
    })
        .format(date)
        .replace(".", "");
}

function getItemPeriod(item) {
    if (item.type === "work") {
        const start = formatMonth(item.start);
        if (item.present) return start ? `${start} - Atual` : "Atual";
        const end = formatMonth(item.end);
        if (start && end) return `${start} - ${end}`;
        if (start) return `${start} - Atual`;
        if (end) return `Até ${end}`;
        return "Período não informado";
    }
    const start = formatMonth(item.start);
    return start ? `${start} - ${item.status}` : item.status;
}

function getItemIcon(item) {
    if (item.type === "work") return "bx bx-restaurant";
    if (item.type === "academic") return "bx bxs-graduation";
    return "bx bxs-book";
}

function typeLabel(type) {
    return type === "course"
        ? "Curso"
        : type === "academic"
        ? "Formação"
        : "Trabalho";
}

function setStatus(msg) {
    statusMessage.textContent = msg;
}

/* ===========================================================
   RENDER : ITEMS
   =========================================================== */
function renderList(items, listEl, counterEl, singular, plural) {
    listEl.innerHTML = "";

    items.forEach((item) => {
        const el = document.createElement("article");
        el.className = "timeline-item";
        el.dataset.itemId = item.id;
        el.innerHTML = `
            <div class="item-header">
                <div>
                    <h3 class="item-title">
                        <i class="${getItemIcon(item)}"></i>
                        ${escHtml(item.name)}
                    </h3>
                    ${item.school ? `<p class="item-meta">${escHtml(item.school)}</p>` : ""}
                </div>
                <span class="item-date">${escHtml(getItemPeriod(item))}</span>
            </div>
            <p class="item-description">${escHtml(item.description || "Descrição não informada.")}</p>
            <div class="item-actions">
                <button type="button" class="edit-btn" data-edit="${item.id}">
                    <i class="bx bx-pencil"></i>
                    Editar
                </button>
                <button type="button" class="del-btn" data-remove="${item.id}">
                    <i class="bx bx-trash"></i>
                    Remover
                </button>
            </div>
        `;

        listEl.appendChild(el);
    });

    counterEl.textContent = `${items.length} ${items.length === 1 ? singular : plural}`;
}

function renderAll() {
    renderList(
        items.filter((i) => i.type === "course"),
        coursesList,
        courseCounter,
        "curso",
        "cursos"
    );
    renderList(
        items.filter((i) => i.type === "academic"),
        academicList,
        academicCounter,
        "formação",
        "formações"
    );
    renderList(
        items.filter((i) => i.type === "work"),
        workList,
        workCounter,
        "experiência",
        "experiências"
    );
    renderItemManager();
}

/* ===========================================================
   RENDER : ITEM MANAGER (reorder)
   =========================================================== */
function renderItemManager() {
    itemManager.innerHTML = items
        .map(
            (item, i) =>
                `<div class="manager-item" data-manager-id="${item.id}">
                    <span class="drag-icon"><i class="bx bx-menu"></i></span>
                    <div class="item-info">
                        <span class="type-badge">${typeLabel(item.type)}</span>
                        ${escHtml(item.name)}
                    </div>
                    <div class="move-btns">
                        <button type="button" data-move-up="${i}" title="Subir" ${i === 0 ? "disabled" : ""}>
                            <i class="bx bx-chevron-up"></i>
                        </button>
                        <button type="button" data-move-down="${i}" title="Descer" ${i === items.length - 1 ? "disabled" : ""}>
                            <i class="bx bx-chevron-down"></i>
                        </button>
                    </div>
                    <div class="action-btns">
                        <button type="button" class="edit-btn" data-edit="${item.id}" title="Editar">
                            <i class="bx bx-pencil"></i>
                        </button>
                        <button type="button" class="del-btn" data-remove="${item.id}" title="Remover">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                </div>`
        )
        .join("");
}

/* ===========================================================
   FORM : TYPE CONFIG
   =========================================================== */
const typeConfig = {
    course: {
        nameLabel: "Nome do curso",
        namePlaceholder: "Ex: Lógica de Programação",
        schoolLabel: "Instituição",
        schoolPlaceholder: "Ex: Etec, Senai, Alura",
        descPlaceholder:
            "O que você está aprendendo? Quais tecnologias, habilidades ou temas?",
        statusOptions: ["Em curso", "Concluído", "Pausado"],
        defaultStatus: "Em curso",
    },
    academic: {
        nameLabel: "Curso",
        namePlaceholder: "Ex: Ensino Médio, Graduação",
        schoolLabel: "Instituição",
        schoolPlaceholder: "Ex: Etec, Faculdade XYZ",
        descPlaceholder: "Detalhes da sua formação...",
        statusOptions: ["Completo", "Em curso", "Trancado"],
        defaultStatus: "Completo",
    },
    work: {
        nameLabel: "Cargo",
        namePlaceholder: "Ex: Pizzaiolo, Desenvolvedor",
        schoolLabel: "Empresa",
        schoolPlaceholder: "Ex: Steve's Pizza",
        descPlaceholder:
            "Descreva suas responsabilidades e conquistas...",
    },
};

function updateFormForType(type) {
    const config = typeConfig[type];
    const nameInput = itemName;
    const schoolInput = itemSchool;

    nameLabel.innerHTML = "";
    nameLabel.append(config.nameLabel);
    nameLabel.append(document.createElement("br"));
    nameLabel.append(nameInput);
    nameInput.placeholder = config.namePlaceholder;

    schoolLabel.innerHTML = "";
    schoolLabel.append(config.schoolLabel);
    schoolLabel.append(document.createElement("br"));
    schoolLabel.append(schoolInput);
    schoolInput.placeholder = config.schoolPlaceholder;

    itemDescription.placeholder = config.descPlaceholder;

    if (type === "work") {
        dynamicColumn.innerHTML = `
            Fim
            <input id="item-end" type="month">
        `;
        presentGroup.style.display = "";
    } else {
        dynamicColumn.innerHTML = `
            Status
            <select id="item-status">
                ${config.statusOptions
                    .map((o) => `<option value="${o}">${o}</option>`)
                    .join("")}
            </select>
        `;
        const sel = document.querySelector("#item-status");
        if (sel) sel.value = config.defaultStatus;
        presentGroup.style.display = "none";
    }
}

function populateForm(item) {
    itemType.value = item.type;
    updateFormForType(item.type);
    itemName.value = item.name || "";
    itemSchool.value = item.school || "";
    itemStart.value = item.start || "";
    itemDescription.value = item.description || "";

    if (item.type === "work") {
        const endInput = document.querySelector("#item-end");
        if (endInput) endInput.value = item.end || "";
        itemPresent.checked = item.present || false;
    } else {
        const sel = document.querySelector("#item-status");
        if (sel) sel.value = item.status || typeConfig[item.type].defaultStatus;
    }
}

function resetForm() {
    editingId = null;
    itemForm.reset();
    itemType.value = "course";
    updateFormForType("course");
    submitLabel.textContent = "Pronto";
    cancelEditBtn.style.display = "none";
    itemForm.classList.remove("editing-highlight");
}

/* ===========================================================
   ADMIN LOCK / UNLOCK
   =========================================================== */
function unlockPanel() {
    appShell.classList.remove("panel-locked");
    localStorage.setItem(KEYS.unlocked, "true");
    adminUnlock.textContent = "\u{1F513}";
    adminUnlock.title = "Bloquear painel";
    lockPanelBtn.innerHTML = '<i class="bx bx-lock"></i>';
    lockPanelBtn.title = "Bloquear painel";
}

function lockPanel() {
    discardAllChanges();
    appShell.classList.add("panel-locked");
    localStorage.removeItem(KEYS.unlocked);
    adminUnlock.textContent = "\u2699";
    adminUnlock.title = "Acessar painel de controle";
    lockPanelBtn.innerHTML = '<i class="bx bx-lock-open"></i>';
    lockPanelBtn.title = "Desbloquear painel";
    resetForm();
}

function checkPanelAccess() {
    if (localStorage.getItem(KEYS.unlocked)) {
        unlockPanel();
    }
}

/* ===========================================================
   CONFIRM / DISCARD CHANGES
   =========================================================== */
function confirmAllChanges() {
    const confirmPwd = prompt("Digite a senha de confirmação para salvar tudo:");
    if (confirmPwd !== loadConfirmPassword()) {
        if (confirmPwd !== null) alert("Senha de confirmação incorreta. Nada foi salvo.");
        return false;
    }
    saveItems();
    saveProfile();
    setStatus("Todas as alterações foram salvas permanentemente ✓");
    return true;
}

function discardAllChanges() {
    items = loadItems();
    profile = loadProfile();
    renderProfile();
    renderAll();
    setStatus("Alterações descartadas. Voltou ao último estado salvo.");
}

/* ===========================================================
   EVENTS : ADMIN UNLOCK
   =========================================================== */
adminUnlock.addEventListener("click", () => {
    if (!appShell.classList.contains("panel-locked")) {
        lockPanel();
        setStatus("Painel bloqueado.");
        return;
    }

    const password = prompt("Digite a senha para acessar o painel de controle:");
    if (password === loadPassword()) {
        unlockPanel();
        setStatus("Painel desbloqueado.");
        renderProfileForm();
        renderSkillsEditor();
        renderSocialEditor();
    } else if (password !== null) {
        alert("Senha incorreta.");
    }
});

lockPanelBtn.addEventListener("click", () => {
    lockPanel();
    setStatus("Painel bloqueado.");
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === "A") {
        event.preventDefault();
        adminUnlock.click();
    }
    if (event.key === "Escape" && !appShell.classList.contains("panel-locked")) {
        lockPanel();
        setStatus("Painel bloqueado.");
    }
});

/* ===========================================================
   EVENTS : ITEM FORM (add / edit)
   =========================================================== */
itemType.addEventListener("change", () => {
    updateFormForType(itemType.value);
});

itemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const type = itemType.value;
    const statusEl = document.querySelector("#item-status");
    const endEl = document.querySelector("#item-end");

    const entry = {
        id: editingId || generateId(),
        type,
        name: itemName.value.trim(),
        school: itemSchool.value.trim(),
        start: itemStart.value,
        status: type !== "work" && statusEl ? statusEl.value : "",
        end: type === "work" && endEl ? endEl.value : "",
        present: type === "work" ? itemPresent.checked : false,
        description: itemDescription.value.trim(),
    };

    if (editingId) {
        const idx = items.findIndex((i) => i.id === editingId);
        if (idx !== -1) {
            items[idx] = entry;
        }
        setStatus(`"${entry.name}" atualizado (não salvo).`);
    } else {
        items.unshift(entry);
        setStatus(`"${entry.name}" adicionado (não salvo).`);
    }

    renderAll();
    resetForm();
});

cancelEditBtn.addEventListener("click", resetForm);

/* ===========================================================
   EVENTS : ITEM ACTIONS (edit / remove via delegation)
   =========================================================== */
document.addEventListener("click", (event) => {
    const removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) {
        const id = removeBtn.dataset.remove;
        const removed = items.find((i) => i.id === id);
        items = items.filter((i) => i.id !== id);
        renderAll();
        setStatus(removed ? `"${removed.name}" removido (não salvo).` : "Item removido (não salvo).");
        if (editingId === id) resetForm();
        return;
    }

    const editBtn = event.target.closest("[data-edit]");
    if (editBtn) {
        const id = editBtn.dataset.edit;
        const item = items.find((i) => i.id === id);
        if (!item) return;
        editingId = id;
        populateForm(item);
        submitLabel.textContent = "Salvar alterações";
        cancelEditBtn.style.display = "";
        itemForm.classList.add("editing-highlight");
        itemForm.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const upBtn = event.target.closest("[data-move-up]");
    if (upBtn) {
        const idx = parseInt(upBtn.dataset.moveUp, 10);
        if (idx > 0) {
            [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
            renderAll();
            setStatus("Item movido para cima (não salvo).");
        }
        return;
    }

    const downBtn = event.target.closest("[data-move-down]");
    if (downBtn) {
        const idx = parseInt(downBtn.dataset.moveDown, 10);
        if (idx < items.length - 1) {
            [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
            renderAll();
            setStatus("Item movido para baixo (não salvo).");
        }
        return;
    }
});

/* ===========================================================
   EVENTS : PROFILE FORM
   =========================================================== */
profileForm.addEventListener("input", () => {
    profile.name = profileName.value.trim() || profile.name;
    profile.title = profileTitle.value.trim();
    profile.city = profileCity.value.trim();
    profile.state = profileState.value.trim();
    profile.email = profileEmail.value.trim();
    profile.phone = profilePhone.value.trim();
    profile.summary = profileSummary.value.trim();

    renderProfile();
    profileStatus.textContent = "Alterado (não salvo) ⚠";
});

profilePhotoInput.addEventListener("change", () => {
    const [file] = profilePhotoInput.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        profile.photo = e.target.result;
        renderProfile();
        profileStatus.textContent = "Foto alterada (não salva) ⚠";
    };
    reader.readAsDataURL(file);
});

/* ===========================================================
   EVENTS : SKILLS
   =========================================================== */
addSkillBtn.addEventListener("click", () => {
    const val = skillInput.value.trim();
    if (!val) return;
    profile.skills.push(val);
    skillInput.value = "";
    renderProfile();
    renderSkillsEditor();
    setStatus(`Competência "${val}" adicionada (não salva).`);
});

skillInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addSkillBtn.click();
    }
});

skillsList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-skill-index]");
    if (!btn) return;
    const idx = parseInt(btn.dataset.skillIndex, 10);
    const removed = profile.skills[idx];
    profile.skills.splice(idx, 1);
    renderProfile();
    renderSkillsEditor();
    setStatus(`Competência "${removed}" removida (não salvo).`);
});

/* ===========================================================
   EVENTS : SOCIAL LINKS
   =========================================================== */
addSocialBtn.addEventListener("click", () => {
    const name = socialNameInput.value.trim();
    const url = socialUrlInput.value.trim();
    if (!name || !url) return;

    let icon = "bx-link";
    const lower = name.toLowerCase();
    if (lower.includes("linkedin")) icon = "bxl-linkedin-square";
    else if (lower.includes("github")) icon = "bxl-github";
    else if (lower.includes("instagram")) icon = "bxl-instagram";
    else if (lower.includes("twitter") || lower.includes("x")) icon = "bxl-twitter";
    else if (lower.includes("youtube")) icon = "bxl-youtube";
    else if (lower.includes("facebook")) icon = "bxl-facebook-square";
    else if (lower.includes("tiktok")) icon = "bxl-tiktok";
    else if (lower.includes("discord")) icon = "bxl-discord";
    else if (lower.includes("whatsapp")) icon = "bxl-whatsapp";

    profile.socialLinks.push({ name, url, icon });
    socialNameInput.value = "";
    socialUrlInput.value = "";
    renderProfile();
    renderSocialEditor();
    setStatus(`Link "${name}" adicionado (não salvo).`);
});

socialList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-social-index]");
    if (!btn) return;
    const idx = parseInt(btn.dataset.socialIndex, 10);
    const removed = profile.socialLinks[idx];
    profile.socialLinks.splice(idx, 1);
    renderProfile();
    renderSocialEditor();
    setStatus(`Link "${removed.name}" removido (não salvo).`);
});

/* ===========================================================
   EVENTS : SECURITY
   =========================================================== */
securityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pwd = adminPasswordInput.value.trim();
    const confirmPwd = confirmPasswordInput.value.trim();

    let msg = [];
    if (pwd.length >= 4) {
        savePassword(pwd);
        msg.push("Senha do painel");
    }
    if (confirmPwd.length >= 4) {
        saveConfirmPassword(confirmPwd);
        msg.push("Senha de confirmação");
    }

    if (msg.length === 0) {
        securityStatus.textContent = "Mínimo 4 caracteres cada.";
        return;
    }

    adminPasswordInput.value = "";
    confirmPasswordInput.value = "";
    securityStatus.textContent = `${msg.join(" e ")} alterada(s) ✓`;
    setStatus("Senhas alteradas.");
});

/* ===========================================================
   EVENTS : CONFIRM / DISCARD
   =========================================================== */
const confirmBtn = $("#confirm-changes");
const revertBtn = $("#revert-changes");

confirmBtn.addEventListener("click", () => {
    const ok = confirmAllChanges();
    if (ok) {
        renderProfileForm();
        renderSkillsEditor();
        renderSocialEditor();
        profileStatus.textContent = "Tudo salvo ✓";
    }
});

revertBtn.addEventListener("click", () => {
    if (!confirm("Descartar todas as alterações não salvas?")) return;
    discardAllChanges();
    renderProfileForm();
    renderSkillsEditor();
    renderSocialEditor();
    profileStatus.textContent = "Alterações descartadas.";
});

/* ===========================================================
   EVENTS : RESTORE / EXPORT / IMPORT / PRINT
   =========================================================== */
clearAllBtn.addEventListener("click", () => {
    if (!confirm("Restaurar dados padrão? Isso substituirá todos os itens atuais (não salvo até confirmar)."))
        return;
    items = defaultItems.map((item) => ({ ...item, id: generateId() }));
    renderAll();
    resetForm();
    setStatus("Dados padrão carregados (não salvos). Confirme para永久izar.");
});

printBtn.addEventListener("click", () => {
    window.print();
});

exportBtn.addEventListener("click", () => {
    const payload = { profile, items };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "curriculo-backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus("Cópia de segurança gerada.");
});

importInput.addEventListener("change", async () => {
    const [file] = importInput.files;
    if (!file) return;

    try {
        const data = JSON.parse(await file.text());

        if (data && data.profile && data.items) {
            const def = defaultProfile();
            profile = {
                ...def,
                ...data.profile,
                socialLinks: Array.isArray(data.profile.socialLinks)
                    ? data.profile.socialLinks : def.socialLinks,
                skills: Array.isArray(data.profile.skills)
                    ? data.profile.skills : def.skills,
            };
            items = data.items.map(formatItem);
        } else if (Array.isArray(data)) {
            items = data.map(formatItem);
        } else if (data && typeof data === "object") {
            const merged = [];
            ["courses", "academic", "work"].forEach((key) => {
                if (Array.isArray(data[key])) {
                    data[key].forEach((item) => merged.push(formatItem(item)));
                }
            });
            if (merged.length) items = merged;
        }

        saveItems();
        saveProfile();
        renderProfile();
        renderProfileForm();
        renderSkillsEditor();
        renderSocialEditor();
        renderAll();
        setStatus("Backup importado com sucesso.");
    } catch {
        setStatus("Não consegui importar esse arquivo.");
    } finally {
        importInput.value = "";
    }
});

function formatItem(item) {
    return {
        id: item.id || generateId(),
        type: item.type || "course",
        name: item.name || "Item",
        school: item.school || "",
        start: item.start || "",
        status: item.type !== "work" ? item.status || "Em curso" : "",
        end: item.type === "work" ? item.end || "" : "",
        present: item.type === "work" ? !!item.present : false,
        description: item.description || "",
    };
}

/* ===========================================================
   INIT
   =========================================================== */
(function init() {
    items = loadItems();
    profile = loadProfile();
    checkPanelAccess();
    updateFormForType(itemType.value);
    renderProfile();
    renderAll();
    if (!appShell.classList.contains("panel-locked")) {
        renderProfileForm();
        renderSkillsEditor();
        renderSocialEditor();
    }
})();
