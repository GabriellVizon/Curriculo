const storageKey = "gabriel-curriculo-cursos";
const UNLOCK_KEY = "gabriel-curriculo-unlocked";
const PANEL_PASSWORD = "gvizon2026";

function generateId() {
    try {
        return crypto.randomUUID();
    } catch {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }
}

const defaultCourses = [
    {
        id: generateId(),
        name: "Projeto Barracred Conecta",
        school: "Barracred Conecta",
        start: "2025-09",
        status: "Em curso",
        description: "Curso direcionado a programação, desenvolvimento pessoal e desenvolvimento profissional."
    },
    {
        id: generateId(),
        name: "Desenvolvimento de Sistemas",
        school: "Etec",
        start: "2026-03",
        status: "Em curso",
        description: "Curso técnico direcionado a programação, tecnologia e desenvolvimento profissional."
    },
    {
        id: generateId(),
        name: "Ativa Juventude",
        school: "Ativa Juventude",
        start: "2022-02",
        status: "Concluído",
        description: "Curso focado em desenvolvimento profissional e preparacao para o mercado de trabalho."
    },
    {
        id: generateId(),
        name: "Inglês",
        school: "Centro de Linguas",
        start: "2023-09",
        status: "Em curso",
        description: "Aprendizagem do idioma ingles com foco em comunicacao e compreensao. Aulas aos sabados, das 07:00 as 12:00, com conclusao prevista para 06/2026."
    }
];

const appShell = document.querySelector(".app-shell");
const form = document.querySelector("#course-form");
const coursesList = document.querySelector("#courses-list");
const counter = document.querySelector("#course-counter");
const statusMessage = document.querySelector("#save-status");
const importInput = document.querySelector("#import-data");
const adminUnlock = document.querySelector("#admin-unlock");

let courses = loadCourses();

function loadCourses() {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
        return defaultCourses.map((c) => ({ ...c, id: generateId() }));
    }

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : defaultCourses.map((c) => ({ ...c, id: generateId() }));
    } catch {
        return defaultCourses.map((c) => ({ ...c, id: generateId() }));
    }
}

function saveCourses(message = "Alterações salvas automaticamente.") {
    localStorage.setItem(storageKey, JSON.stringify(courses));
    statusMessage.textContent = message;
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

function formatMonth(monthValue) {
    if (!monthValue) {
        return "Periodo nao informado";
    }

    const [year, month] = monthValue.split("-");
    const date = new Date(Number(year), Number(month) - 1);

    return new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        year: "numeric"
    }).format(date).replace(".", "");
}

function getCoursePeriod(course) {
    const start = formatMonth(course.start);
    return `${start} - ${course.status}`;
}

function renderCourses() {
    coursesList.innerHTML = "";

    courses.forEach((course) => {
        const item = document.createElement("article");
        item.className = "timeline-item";
        item.innerHTML = `
            <div class="item-header">
                <div>
                    <h3 class="item-title">
                        <i class="bx bxs-book"></i>
                        ${escapeHtml(course.name)}
                    </h3>
                    ${course.school ? `<p class="item-meta">${escapeHtml(course.school)}</p>` : ""}
                </div>
                <span class="item-date">${escapeHtml(getCoursePeriod(course))}</span>
            </div>
            <p class="item-description">${escapeHtml(course.description || "Descrição não informada.")}</p>
            <div class="course-actions">
                <button type="button" data-remove="${course.id}">
                    <i class="bx bx-trash"></i>
                    Remover
                </button>
            </div>
        `;

        coursesList.appendChild(item);
    });

    counter.textContent = `${courses.length} ${courses.length === 1 ? "curso" : "cursos"}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function readFormCourse() {
    return {
        id: generateId(),
        name: document.querySelector("#course-name").value.trim(),
        school: document.querySelector("#course-school").value.trim(),
        start: document.querySelector("#course-start").value,
        status: document.querySelector("#course-status").value,
        description: document.querySelector("#course-description").value.trim()
    };
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const course = readFormCourse();
    courses.unshift(course);
    saveCourses(`Curso "${course.name}" adicionado ao currículo.`);
    renderCourses();
    form.reset();
    document.querySelector("#course-status").value = "Em curso";
});

coursesList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");

    if (!button) {
        return;
    }

    courses = courses.filter((course) => course.id !== button.dataset.remove);
    saveCourses("Curso removido.");
    renderCourses();
});

document.querySelector("#clear-courses").addEventListener("click", () => {
    courses = defaultCourses.map((course) => ({ ...course, id: generateId() }));
    saveCourses("Cursos originais restaurados.");
    renderCourses();
});

document.querySelector("#print-resume").addEventListener("click", () => {
    window.print();
});

document.querySelector("#export-data").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(courses, null, 2)], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "curriculo-gabriel-cursos.json";
    link.click();
    URL.revokeObjectURL(link.href);
    statusMessage.textContent = "Cópia dos cursos gerada.";
});

importInput.addEventListener("change", async () => {
    const [file] = importInput.files;

    if (!file) {
        return;
    }

    try {
        const imported = JSON.parse(await file.text());

        if (!Array.isArray(imported)) {
            throw new Error("Arquivo invalido");
        }

        courses = imported.map((course) => ({
            id: course.id || generateId(),
            name: course.name || "Curso sem nome",
            school: course.school || "",
            start: course.start || "",
            status: course.status || "Em curso",
            description: course.description || ""
        }));

        saveCourses("Cópia importada com sucesso.");
        renderCourses();
    } catch {
        statusMessage.textContent = "Não consegui importar esse arquivo.";
    } finally {
        importInput.value = "";
    }
});

renderCourses();
