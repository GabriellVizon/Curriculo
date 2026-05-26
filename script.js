const STORAGE_KEY = "gabriel-curriculo-items";
const UNLOCK_KEY = "gabriel-curriculo-unlocked";
const PANEL_PASSWORD = "gvizon2026";

const OLD_KEYS = {
    courses: "gabriel-curriculo-cursos",
    academic: "gabriel-curriculo-academic",
    work: "gabriel-curriculo-work"
};

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
    { id: generateId(), type: "work", name: "Pizzaiolo", school: "Steve's Pizza", start: "2024-07", status: "", end: "2024-12", present: false, description: "Atuação por 5 meses na Steve's Pizza, desenvolvendo responsabilidade, agilidade, organização e trabalho em equipe." }
];

const appShell = document.querySelector(".app-shell");
const statusMessage = document.querySelector("#save-status");
const importInput = document.querySelector("#import-data");
const adminUnlock = document.querySelector("#admin-unlock");

const itemForm = document.querySelector("#item-form");
const itemType = document.querySelector("#item-type");
const itemName = document.querySelector("#item-name");
const itemSchool = document.querySelector("#item-school");
const itemStart = document.querySelector("#item-start");
const itemStatus = document.querySelector("#item-status");
const itemEnd = document.querySelector("#item-end");
const itemPresent = document.querySelector("#item-present");
const itemDescription = document.querySelector("#item-description");

const nameLabel = document.querySelector("#name-label");
const schoolLabel = document.querySelector("#school-label");
const statusGroup = document.querySelector("#status-group");
const endGroup = document.querySelector("#end-group");
const presentGroup = document.querySelector("#present-group");

const coursesList = document.querySelector("#courses-list");
const courseCounter = document.querySelector("#course-counter");
const academicList = document.querySelector("#academic-list");
const academicCounter = document.querySelector("#academic-counter");
const workList = document.querySelector("#work-list");
const workCounter = document.querySelector("#work-counter");

let items = loadItems();

function migrateOldData() {
    const oldCourses = localStorage.getItem(OLD_KEYS.courses);
    const oldAcademic = localStorage.getItem(OLD_KEYS.academic);
    const oldWork = localStorage.getItem(OLD_KEYS.work);

    if (!oldCourses && !oldAcademic && !oldWork) {
        return false;
    }

    const migrated = [];

    if (oldCourses) {
        try {
            const parsed = JSON.parse(oldCourses);
            if (Array.isArray(parsed)) {
                parsed.forEach(c => migrated.push({
                    id: c.id || generateId(),
                    type: "course",
                    name: c.name || "Curso",
                    school: c.school || "",
                    start: c.start || "",
                    status: c.status || "Em curso",
                    end: "",
                    present: false,
                    description: c.description || ""
                }));
            }
        } catch { }
        localStorage.removeItem(OLD_KEYS.courses);
    }

    if (oldAcademic) {
        try {
            const parsed = JSON.parse(oldAcademic);
            if (Array.isArray(parsed)) {
                parsed.forEach(a => migrated.push({
                    id: a.id || generateId(),
                    type: "academic",
                    name: a.course || a.name || "Formação",
                    school: a.school || "",
                    start: a.start || "",
                    status: a.status || "Completo",
                    end: "",
                    present: false,
                    description: a.description || ""
                }));
            }
        } catch { }
        localStorage.removeItem(OLD_KEYS.academic);
    }

    if (oldWork) {
        try {
            const parsed = JSON.parse(oldWork);
            if (Array.isArray(parsed)) {
                parsed.forEach(w => migrated.push({
                    id: w.id || generateId(),
                    type: "work",
                    name: w.role || w.name || "Experiência",
                    school: w.company || w.school || "",
                    start: w.start || "",
                    status: "",
                    end: w.end || "",
                    present: w.present || false,
                    description: w.description || ""
                }));
            }
        } catch { }
        localStorage.removeItem(OLD_KEYS.work);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return true;
}

function loadItems() {
    if (migrateOldData()) {
        const saved = localStorage.getItem(STORAGE_KEY);
        try { return JSON.parse(saved); } catch { }
    }

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return defaultItems.map(item => ({ ...item, id: generateId() }));
    }

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : defaultItems.map(item => ({ ...item, id: generateId() }));
    } catch {
        return defaultItems.map(item => ({ ...item, id: generateId() }));
    }
}

function saveItems(message) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (message) {
        statusMessage.textContent = message;
    }
}

function unlockPanel() {
    appShell.classList.remove("panel-locked");
    localStorage.setItem(UNLOCK_KEY, "true");
    adminUnlock.textContent = "\u{1F513}";
    adminUnlock.title = "Bloquear painel de controle";
    statusMessage.textContent = "Painel de controle desbloqueado.";
}

function lockPanel() {
    appShell.classList.add("panel-locked");
    localStorage.removeItem(UNLOCK_KEY);
    adminUnlock.textContent = "\u2699";
    adminUnlock.title = "Acessar painel de controle";
    statusMessage.textContent = "Painel bloqueado.";
}

(function checkPanelAccess() {
    if (localStorage.getItem(UNLOCK_KEY)) {
        unlockPanel();
    }
})();

adminUnlock.addEventListener("click", () => {
    if (!appShell.classList.contains("panel-locked")) {
        lockPanel();
        return;
    }

    const password = prompt("Digite a senha para acessar o painel de controle:");
    if (password === PANEL_PASSWORD) {
        unlockPanel();
    } else if (password !== null) {
        alert("Senha incorreta.");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === "A") {
        event.preventDefault();
        adminUnlock.click();
    }
});

const typeConfig = {
    course: {
        nameLabel: "Nome do curso",
        namePlaceholder: "Ex: Lógica de Programação",
        schoolLabel: "Instituição",
        schoolPlaceholder: "Ex: Etec, Senai, Alura",
        descPlaceholder: "O que você está aprendendo? Quais tecnologias, habilidades ou temas?",
        statusOptions: ["Em curso", "Concluído", "Pausado"],
        defaultStatus: "Em curso"
    },
    academic: {
        nameLabel: "Curso",
        namePlaceholder: "Ex: Ensino Médio, Graduação",
        schoolLabel: "Instituição",
        schoolPlaceholder: "Ex: Etec, Faculdade XYZ",
        descPlaceholder: "Detalhes da sua formação...",
        statusOptions: ["Completo", "Em curso", "Trancado"],
        defaultStatus: "Completo"
    },
    work: {
        nameLabel: "Cargo",
        namePlaceholder: "Ex: Pizzaiolo, Desenvolvedor",
        schoolLabel: "Empresa",
        schoolPlaceholder: "Ex: Steve's Pizza",
        descPlaceholder: "Descreva suas responsabilidades e conquistas..."
    }
};

function updateFormForType(type) {
    const config = typeConfig[type];
    const nameInput = document.querySelector("#item-name");
    const schoolInput = document.querySelector("#item-school");

    nameLabel.textContent = "";
    nameLabel.append(config.nameLabel);
    nameLabel.append(document.createElement("br"));
    nameLabel.append(nameInput);
    nameInput.placeholder = config.namePlaceholder;

    schoolLabel.textContent = "";
    schoolLabel.append(config.schoolLabel);
    schoolLabel.append(document.createElement("br"));
    schoolLabel.append(schoolInput);
    schoolInput.placeholder = config.schoolPlaceholder;

    itemDescription.placeholder = config.descPlaceholder;

    if (type === "work") {
        statusGroup.style.display = "none";
        endGroup.style.display = "";
        presentGroup.style.display = "";
    } else {
        statusGroup.style.display = "";
        endGroup.style.display = "none";
        presentGroup.style.display = "none";

        itemStatus.innerHTML = "";
        config.statusOptions.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            itemStatus.appendChild(option);
        });
        itemStatus.value = config.defaultStatus;
    }
}

itemType.addEventListener("change", () => {
    updateFormForType(itemType.value);
});

updateFormForType(itemType.value);

function escapeHtml(value) {
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
        year: "numeric"
    }).format(date).replace(".", "");
}

function getItemPeriod(item) {
    if (item.type === "work") {
        const start = formatMonth(item.start);

        if (item.present) {
            return start ? `${start} - Atual` : "Atual";
        }

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
    return "bx bxs-book";
}

function renderList(items, listEl, counterEl, singular, plural) {
    listEl.innerHTML = "";

    items.forEach(item => {
        const el = document.createElement("article");
        el.className = "timeline-item";
        el.innerHTML = `
            <div class="item-header">
                <div>
                    <h3 class="item-title">
                        <i class="${getItemIcon(item)}"></i>
                        ${escapeHtml(item.name)}
                    </h3>
                    ${item.school ? `<p class="item-meta">${escapeHtml(item.school)}</p>` : ""}
                </div>
                <span class="item-date">${escapeHtml(getItemPeriod(item))}</span>
            </div>
            <p class="item-description">${escapeHtml(item.description || "Descrição não informada.")}</p>
            <div class="course-actions">
                <button type="button" data-remove="${item.id}">
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
        items.filter(i => i.type === "course"),
        coursesList, courseCounter, "curso", "cursos"
    );
    renderList(
        items.filter(i => i.type === "academic"),
        academicList, academicCounter, "formação", "formações"
    );
    renderList(
        items.filter(i => i.type === "work"),
        workList, workCounter, "experiência", "experiências"
    );
}

itemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const type = itemType.value;
    const entry = {
        id: generateId(),
        type,
        name: itemName.value.trim(),
        school: itemSchool.value.trim(),
        start: itemStart.value,
        status: type !== "work" ? itemStatus.value : "",
        end: type === "work" ? itemEnd.value : "",
        present: type === "work" ? itemPresent.checked : false,
        description: itemDescription.value.trim()
    };

    items.unshift(entry);
    saveItems(`${typeConfig[type].nameLabel} "${entry.name}" adicionado ao currículo.`);
    renderAll();
    itemForm.reset();
    itemType.value = type;
    updateFormForType(type);
});

document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");

    if (!button) return;

    const id = button.dataset.remove;
    const removed = items.find(i => i.id === id);
    items = items.filter(i => i.id !== id);
    saveItems(removed ? `"${removed.name}" removido.` : "Item removido.");
    renderAll();
});

document.querySelector("#clear-all").addEventListener("click", () => {
    items = defaultItems.map(item => ({ ...item, id: generateId() }));
    saveItems("Dados originais restaurados.");
    renderAll();
    itemForm.reset();
    itemType.value = "course";
    updateFormForType("course");
});

document.querySelector("#print-resume").addEventListener("click", () => {
    window.print();
});

document.querySelector("#export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "curriculo-gabriel-backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
    statusMessage.textContent = "Cópia de segurança gerada.";
});

importInput.addEventListener("change", async () => {
    const [file] = importInput.files;

    if (!file) {
        return;
    }

    try {
        const imported = JSON.parse(await file.text());

        if (Array.isArray(imported)) {
            if (imported.length > 0 && imported[0].type) {
                items = imported.map(formatItem);
            } else {
                items = imported.map(c => ({
                    id: c.id || generateId(),
                    type: "course",
                    name: c.name || "Curso",
                    school: c.school || "",
                    start: c.start || "",
                    status: c.status || "Em curso",
                    end: "",
                    present: false,
                    description: c.description || ""
                }));
            }
        } else if (imported && typeof imported === "object") {
            const merged = [];
            if (Array.isArray(imported.courses)) {
                imported.courses.forEach(c => merged.push({
                    id: c.id || generateId(), type: "course",
                    name: c.name || "Curso", school: c.school || "",
                    start: c.start || "", status: c.status || "Em curso",
                    end: "", present: false, description: c.description || ""
                }));
            }
            if (Array.isArray(imported.academic)) {
                imported.academic.forEach(a => merged.push({
                    id: a.id || generateId(), type: "academic",
                    name: a.course || a.name || "Formação", school: a.school || "",
                    start: a.start || "", status: a.status || "Completo",
                    end: "", present: false, description: a.description || ""
                }));
            }
            if (Array.isArray(imported.work)) {
                imported.work.forEach(w => merged.push({
                    id: w.id || generateId(), type: "work",
                    name: w.role || w.name || "Experiência", school: w.company || w.school || "",
                    start: w.start || "", status: "",
                    end: w.end || "", present: w.present || false,
                    description: w.description || ""
                }));
            }
            items = merged;
        } else {
            throw new Error("Formato invalido");
        }

        items = items.map(formatItem);
        saveItems("Backup importado com sucesso.");
        renderAll();
    } catch {
        statusMessage.textContent = "Não consegui importar esse arquivo.";
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
        status: item.type !== "work" ? (item.status || "Em curso") : "",
        end: item.type === "work" ? (item.end || "") : "",
        present: item.type === "work" ? (item.present || false) : false,
        description: item.description || ""
    };
}

renderAll();
