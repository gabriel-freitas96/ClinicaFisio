const state = {
    role: 'admin',
    page: 'dashboard',
    appointments: [],
    patients: [],
    assessments: [],
    payments: []
};

const defaultPatients = [
    {
        id: 1,
        name: 'Pedro Alves',
        phone: '(83) 98888-1111',
        goal: 'Dor lombar'
    },
    {
        id: 2,
        name: 'Carlos Rodrigo',
        phone: '(83) 97777-2222',
        goal: 'Reabilitação de joelho'
    },
    {
        id: 3,
        name: 'Fernanda Souza',
        phone: '(83) 96666-3333',
        goal: 'Fortalecimento'
    }
];

const defaultAppointments = [
    {
        id: 1,
        patientId: 1,
        date: '2026-09-01',
        time: '08:00',
        type: 'Fisioterapia',
        status: 'Confirmada',
        note: 'Mobilidade lombar'
    },
    {
        id: 2,
        patientId: 2,
        date: '2026-09-01',
        time: '10:00',
        type: 'Retorno',
        status: 'Pendente',
        note: 'Reavaliar amplitude do joelho'
    },
    {
        id: 3,
        patientId: 3,
        date: '2026-09-02',
        time: '14:30',
        type: 'Avaliação inicial',
        status: 'Confirmada',
        note: 'Avaliação postural'
    }
];

const defaultAssessments = [
    {
        id: 1,
        patientId: 1,
        date: '2026-08-28',
        weight: '68.4',
        height: '164',
        pain: '3',
        mobility: 'Boa',
        note: 'Boa evolução da mobilidade. Manter exercícios de estabilização do core e alongamentos orientados.'
    },
    {
        id: 2,
        patientId: 2,
        date: '2026-08-25',
        weight: '81.2',
        height: '178',
        pain: '5',
        mobility: 'Regular',
        note: 'Redução da dor após o ciclo inicial. Evolução positiva da amplitude de movimento.'
    }
];

const defaultPayments = [
    {
        id: 1,
        patientId: 1,
        description: 'Sessão de fisioterapia',
        date: '2026-09-01',
        value: 90,
        status: 'Pago',
        method: 'Pix'
    },
    {
        id: 2,
        patientId: 2,
        description: 'Pacote 4 sessões',
        date: '2026-09-01',
        value: 320,
        status: 'Pendente',
        method: 'Pix'
    },
    {
        id: 3,
        patientId: 3,
        description: 'Avaliação inicial',
        date: '2026-09-02',
        value: 120,
        status: 'Pendente',
        method: 'Cartão'
    }
];

function loadData() {
    state.patients =
        JSON.parse(localStorage.getItem('jf_patients') || 'null') ||
        defaultPatients;

    state.appointments =
        JSON.parse(localStorage.getItem('jf_appointments') || 'null') ||
        defaultAppointments;

    state.assessments =
        JSON.parse(localStorage.getItem('jf_assessments') || 'null') ||
        defaultAssessments;

    state.payments =
        JSON.parse(localStorage.getItem('jf_payments') || 'null') ||
        defaultPayments;
}

function saveData() {
    localStorage.setItem(
        'jf_patients',
        JSON.stringify(state.patients)
    );

    localStorage.setItem(
        'jf_appointments',
        JSON.stringify(state.appointments)
    );

    localStorage.setItem(
        'jf_assessments',
        JSON.stringify(state.assessments)
    );

    localStorage.setItem(
        'jf_payments',
        JSON.stringify(state.payments)
    );
}

function login() {
    const roleElement = document.getElementById('loginRole');

    if (!roleElement) {
        console.error('Elemento #loginRole não encontrado.');
        return;
    }

    state.role = roleElement.value;

    const loginScreen = document.getElementById('loginScreen');
    const app = document.getElementById('app');
    const adminMenu = document.getElementById('adminMenu');
    const userMenu = document.getElementById('userMenu');

    if (!loginScreen || !app) {
        console.error('Elementos #loginScreen ou #app não encontrados.');
        return;
    }

    loginScreen.classList.add('d-none');
    app.classList.remove('d-none');

    if (adminMenu) {
        adminMenu.classList.toggle(
            'd-none',
            state.role !== 'admin'
        );
    }

    if (userMenu) {
        userMenu.classList.toggle(
            'd-none',
            state.role !== 'user'
        );
    }

    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profileAvatar = document.getElementById('profileAvatar');

    if (profileName) {
        profileName.textContent =
            state.role === 'admin'
                ? 'Joelma Negreiros'
                : 'Gabriel Lacerda';
    }

    if (profileRole) {
        profileRole.textContent =
            state.role === 'admin'
                ? 'Administradora'
                : 'Paciente';
    }

    if (profileAvatar) {
        profileAvatar.textContent =
            state.role === 'admin'
                ? 'JN'
                : 'GL';
    }

    state.page =
        state.role === 'admin'
            ? 'dashboard'
            : 'meu-dashboard';

    activateMenu();
    renderPage();
}

function logout() {
    const app = document.getElementById('app');
    const loginScreen = document.getElementById('loginScreen');

    if (app) {
        app.classList.add('d-none');
    }

    if (loginScreen) {
        loginScreen.classList.remove('d-none');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');

    localStorage.setItem(
        'jf_dark',
        document.body.classList.contains('dark-mode')
    );
}

function patientName(id) {
    const patient = state.patients.find(
        patient => patient.id == id
    );

    return patient?.name || 'Paciente';
}

function formatDate(date) {
    if (!date) {
        return '-';
    }

    return new Date(
        date + 'T00:00:00'
    ).toLocaleDateString('pt-BR');
}

function money(value) {
    return Number(value).toLocaleString(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    );
}

function today() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

function statusBadge(status) {
    let className = 'badge-pending';

    if (
        status === 'Confirmada' ||
        status === 'Pago'
    ) {
        className = 'badge-confirmed';
    }

    if (status === 'Cancelada') {
        className = 'badge-cancelled';
    }

    return `
        <span class="badge-soft ${className}">
            ${status}
        </span>
    `;
}

function activateMenu() {
    const menuLinks =
        document.querySelectorAll(
            '.menu-link[data-page]'
        );

    menuLinks.forEach(button => {
        button.classList.toggle(
            'active',
            button.dataset.page === state.page
        );

        button.onclick = () => {
            state.page = button.dataset.page;

            activateMenu();
            renderPage();

            if (window.innerWidth < 992) {
                toggleSidebar();
            }
        };
    });
}

function renderPage() {
    const titles = {
        dashboard: 'Dashboard',
        agenda: 'Agenda e consultas',
        pacientes: 'Pacientes',
        avaliacoes: 'Avaliações físicas',
        pagamentos: 'Pagamentos',
        relatorios: 'Relatórios',
        'meu-dashboard': 'Minha área',
        'minhas-consultas': 'Minhas consultas',
        'minhas-avaliacoes': 'Minhas avaliações',
        'meus-pagamentos': 'Meus pagamentos'
    };

    const pageTitle =
        document.getElementById('pageTitle');

    const breadcrumb =
        document.getElementById('breadcrumb');

    const todayDate =
        document.getElementById('todayDate');

    if (pageTitle) {
        pageTitle.textContent =
            titles[state.page] || 'Página';
    }

    if (breadcrumb) {
        breadcrumb.textContent =
            state.role === 'admin'
                ? 'Gestão da clínica'
                : 'Área do paciente';
    }

    if (todayDate) {
        todayDate.textContent =
            new Date().toLocaleDateString(
                'pt-BR',
                {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }
            );
    }

    const views = {
        dashboard: adminDashboard,
        agenda: agenda,
        pacientes: patients,
        avaliacoes: assessments,
        pagamentos: payments,
        relatorios: reports,
        'meu-dashboard': userDashboard,
        'minhas-consultas': userAppointments,
        'minhas-avaliacoes': userAssessments,
        'meus-pagamentos': userPayments
    };

    const pageContent =
        document.getElementById('pageContent');

    if (!pageContent) {
        console.error(
            'Elemento #pageContent não encontrado.'
        );
        return;
    }

    if (!views[state.page]) {
        pageContent.innerHTML = `
            <div class="alert alert-danger">
                Página não encontrada.
            </div>
        `;
        return;
    }

    pageContent.innerHTML =
        views[state.page]();
}

function adminDashboard() {
    const currentDate = today();

    const appointmentsToday =
        state.appointments.filter(
            appointment =>
                appointment.date === currentDate
        );

    const received =
        state.payments
            .filter(
                payment =>
                    payment.status === 'Pago'
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.value),
                0
            );

    const pending =
        state.payments
            .filter(
                payment =>
                    payment.status === 'Pendente'
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.value),
                0
            );

    const nextAppointments =
        state.appointments
            .filter(
                appointment =>
                    appointment.date >= currentDate
            )
            .sort(
                (a, b) =>
                    (a.date + a.time)
                        .localeCompare(
                            b.date + b.time
                        )
            )
            .slice(0, 5);

    return `
        <div class="hero">

            <div class="row align-items-center">

                <div class="col-lg-8">

                    <h1>
                        Bom dia,venha conhecer a clinica de fisioterapia e agende sua consulta.
                    </h1>

                    <p>
                        Tenha uma visão rápida da agenda,
                        evolução dos pacientes e situação
                        financeira da clínica.
                    </p>

                    <button
                        class="btn btn-light"
                        onclick="openAppointmentModal()"
                    >
                        <i class="bi bi-calendar-plus me-2"></i>
                        Agendar consulta
                    </button>

                </div>

                <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">

                    <i
                        class="bi bi-heart-pulse"
                        style="font-size:90px;opacity:.2"
                    ></i>

                </div>

            </div>

        </div>

        <div class="row g-3 mt-1">

            <div class="col-md-6 col-xl-3">
                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-calendar-check"></i>
                    </div>

                    <div class="stat-value">
                        ${appointmentsToday.length}
                    </div>

                    <div class="stat-label">
                        Consultas hoje
                    </div>

                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-people"></i>
                    </div>

                    <div class="stat-value">
                        ${state.patients.length}
                    </div>

                    <div class="stat-label">
                        Pacientes cadastrados
                    </div>

                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-wallet2"></i>
                    </div>

                    <div class="stat-value">
                        ${money(received)}
                    </div>

                    <div class="stat-label">
                        Recebido
                    </div>

                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>

                    <div class="stat-value">
                        ${money(pending)}
                    </div>

                    <div class="stat-label">
                        A receber
                    </div>

                </div>
            </div>

        </div>

        <div class="section-title">
            Próximos atendimentos
        </div>

        <div class="panel">
            ${appointmentList(nextAppointments)}
        </div>
    `;
}

function appointmentList(list) {
    if (!list.length) {
        return `
            <div class="empty-state">

                <i class="bi bi-calendar-x d-block mb-2"></i>

                Nenhuma consulta encontrada.

            </div>
        `;
    }

    return list.map(appointment => {

        const initials =
            patientName(appointment.patientId)
                .split(' ')
                .map(name => name[0])
                .slice(0, 2)
                .join('');

        return `
            <div class="appointment-row">

                <div class="time-box">

                    ${appointment.time}

                    <small class="d-block text-muted">
                        ${formatDate(appointment.date)}
                    </small>

                </div>

                <div class="patient-avatar">
                    ${initials}
                </div>

                <div class="flex-grow-1">

                    <strong>
                        ${patientName(appointment.patientId)}
                    </strong>

                    <div class="text-muted small">
                        ${appointment.type}
                        ·
                        ${appointment.note || 'Sem observações'}
                    </div>

                </div>

                ${statusBadge(appointment.status)}

            </div>
        `;
    }).join('');
}

function agenda() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">

            <div>
                <p class="text-muted mb-0">
                    Organize horários, tipos de atendimento
                    e status.
                </p>
            </div>

            <button
                class="btn btn-primary"
                onclick="openAppointmentModal()"
            >
                <i class="bi bi-plus-lg me-2"></i>
                Nova consulta
            </button>

        </div>

        <div class="panel">

            <div class="row g-3 mb-3">

                <div class="col-md-5">

                    <input
                        id="agendaSearch"
                        class="form-control"
                        placeholder="Buscar paciente..."
                        oninput="filterAgenda()"
                    >

                </div>

                <div class="col-md-3">

                    <input
                        id="agendaDate"
                        class="form-control"
                        type="date"
                        value="${today()}"
                        onchange="filterAgenda()"
                    >

                </div>

                <div class="col-md-4">

                    <select
                        id="agendaStatus"
                        class="form-select"
                        onchange="filterAgenda()"
                    >

                        <option value="">
                            Todos os status
                        </option>

                        <option>
                            Confirmada
                        </option>

                        <option>
                            Pendente
                        </option>

                        <option>
                            Cancelada
                        </option>

                    </select>

                </div>

            </div>

            <div id="agendaResults">
                ${agendaTable(state.appointments)}
            </div>

        </div>
    `;
}

function agendaTable(list) {
    if (!list.length) {
        return `
            <div class="empty-state">

                <i class="bi bi-calendar2-x d-block mb-2"></i>

                Nenhum agendamento para os filtros selecionados.

            </div>
        `;
    }

    const sortedList = [...list].sort(
        (a, b) =>
            (a.date + a.time)
                .localeCompare(
                    b.date + b.time
                )
    );

    return `
        <div class="table-responsive">

            <table class="table align-middle">

                <thead>

                    <tr>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Paciente</th>
                        <th>Atendimento</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>

                </thead>

                <tbody>

                    ${sortedList.map(appointment => `

                        <tr>

                            <td>
                                ${formatDate(appointment.date)}
                            </td>

                            <td>
                                <strong>
                                    ${appointment.time}
                                </strong>
                            </td>

                            <td>
                                ${patientName(appointment.patientId)}
                            </td>

                            <td>
                                ${appointment.type}
                            </td>

                            <td>
                                ${statusBadge(appointment.status)}
                            </td>

                            <td>

                                <select
                                    class="form-select form-select-sm"
                                    onchange="
                                        changeAppointmentStatus(
                                            ${appointment.id},
                                            this.value
                                        )
                                    "
                                >

                                    <option
                                        ${appointment.status === 'Confirmada' ? 'selected' : ''}
                                    >
                                        Confirmada
                                    </option>

                                    <option
                                        ${appointment.status === 'Pendente' ? 'selected' : ''}
                                    >
                                        Pendente
                                    </option>

                                    <option
                                        ${appointment.status === 'Cancelada' ? 'selected' : ''}
                                    >
                                        Cancelada
                                    </option>

                                </select>

                            </td>

                        </tr>

                    `).join('')}

                </tbody>

            </table>

        </div>
    `;
}

function filterAgenda() {
    const search =
        (
            document.getElementById('agendaSearch')?.value ||
            ''
        ).toLowerCase();

    const date =
        document.getElementById('agendaDate')?.value ||
        '';

    const status =
        document.getElementById('agendaStatus')?.value ||
        '';

    const filteredList =
        state.appointments.filter(appointment => {

            const matchesSearch =
                !search ||
                patientName(
                    appointment.patientId
                )
                    .toLowerCase()
                    .includes(search);

            const matchesDate =
                !date ||
                appointment.date === date;

            const matchesStatus =
                !status ||
                appointment.status === status;

            return (
                matchesSearch &&
                matchesDate &&
                matchesStatus
            );
        });

    const results =
        document.getElementById('agendaResults');

    if (results) {
        results.innerHTML =
            agendaTable(filteredList);
    }
}

function changeAppointmentStatus(id, status) {
    const appointment =
        state.appointments.find(
            item => item.id === id
        );

    if (!appointment) {
        return;
    }

    appointment.status = status;

    saveData();

    toast(
        'Status atualizado com sucesso.',
        'success'
    );

    filterAgenda();
}

function patients() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">

            <p class="text-muted mb-0">
                Cadastro e acompanhamento básico
                dos pacientes.
            </p>

            <button
                class="btn btn-primary"
                onclick="addPatient()"
            >

                <i class="bi bi-person-plus me-2"></i>
                Novo paciente

            </button>

        </div>

        <div class="table-card">

            <div class="table-responsive">

                <table class="table align-middle">

                    <thead>

                        <tr>
                            <th>Paciente</th>
                            <th>Telefone</th>
                            <th>Objetivo</th>
                            <th>Consultas</th>
                            <th>Última avaliação</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${state.patients.map(patient => {

                            const count =
                                state.appointments.filter(
                                    appointment =>
                                        appointment.patientId === patient.id
                                ).length;

                            const lastAssessment =
                                state.assessments
                                    .filter(
                                        assessment =>
                                            assessment.patientId === patient.id
                                    )
                                    .sort(
                                        (a, b) =>
                                            b.date.localeCompare(a.date)
                                    )[0];

                            return `
                                <tr>

                                    <td>
                                        <strong>
                                            ${patient.name}
                                        </strong>
                                    </td>

                                    <td>
                                        ${patient.phone}
                                    </td>

                                    <td>
                                        ${patient.goal}
                                    </td>

                                    <td>
                                        ${count}
                                    </td>

                                    <td>
                                        ${
                                            lastAssessment
                                                ? formatDate(lastAssessment.date)
                                                : '—'
                                        }
                                    </td>

                                </tr>
                            `;
                        }).join('')}

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function addPatient() {
    const name =
        prompt('Nome do paciente:');

    if (!name) {
        return;
    }

    const phone =
        prompt('Telefone:') ||
        'Não informado';

    const goal =
        prompt('Objetivo/tratamento:') ||
        'Acompanhamento fisioterapêutico';

    state.patients.push({
        id: Date.now(),
        name,
        phone,
        goal
    });

    saveData();

    renderPage();

    toast(
        'Paciente cadastrado.',
        'success'
    );
}

function assessments() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">

            <div>

                <p class="text-muted mb-0">
                    Registre evolução, medidas,
                    observações e fotos de antes/depois.
                </p>

            </div>

            <button
                class="btn btn-primary"
                onclick="openAssessmentModal()"
            >

                <i class="bi bi-clipboard-plus me-2"></i>
                Nova avaliação

            </button>

        </div>

        <div class="row g-3">

            ${
                state.assessments
                    .map(
                        assessment =>
                            assessmentCard(
                                assessment,
                                false
                            )
                    )
                    .join('')
            }

        </div>
    `;
}

function assessmentCard(assessment, user) {
    return `
        <div class="col-xl-6">

            <div class="assessment-card">

                <div class="assessment-head">

                    <div>

                        <strong>
                            ${patientName(assessment.patientId)}
                        </strong>

                        <div class="text-muted small">
                            ${formatDate(assessment.date)}
                        </div>

                    </div>

                    <span class="badge-soft badge-confirmed">
                        Evolução
                    </span>

                </div>

                <div class="row g-0">

                    <div class="col-md-5">

                        <div class="photo-grid">

                            <div>

                                <small class="text-muted">
                                    Antes
                                </small>

                                <div class="photo-box">

                                    ${
                                        assessment.before
                                            ? `
                                                <img
                                                    src="${assessment.before}"
                                                    alt="Antes"
                                                >
                                            `
                                            : `
                                                <i class="bi bi-person-bounding-box fs-2"></i>
                                            `
                                    }

                                </div>

                            </div>

                            <div>

                                <small class="text-muted">
                                    Depois
                                </small>

                                <div class="photo-box">

                                    ${
                                        assessment.after
                                            ? `
                                                <img
                                                    src="${assessment.after}"
                                                    alt="Depois"
                                                >
                                            `
                                            : `
                                                <i class="bi bi-person-check fs-2"></i>
                                            `
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="col-md-7 p-3">

                        <div class="row g-2 mb-3">

                            <div class="col-4">

                                <div class="metric">

                                    <small>
                                        Peso
                                    </small>

                                    <strong>
                                        ${assessment.weight || '—'} kg
                                    </strong>

                                </div>

                            </div>

                            <div class="col-4">

                                <div class="metric">

                                    <small>
                                        Dor
                                    </small>

                                    <strong>
                                        ${assessment.pain || '—'}/10
                                    </strong>

                                </div>

                            </div>

                            <div class="col-4">

                                <div class="metric">

                                    <small>
                                        Mobilidade
                                    </small>

                                    <strong class="fs-6">
                                        ${assessment.mobility || '—'}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        <small class="text-muted">
                            Observações
                        </small>

                        <p class="small mt-1 mb-0">
                            ${
                                assessment.note ||
                                'Sem observações.'
                            }
                        </p>

                    </div>

                </div>

            </div>

        </div>
    `;
}

function payments() {
    const received =
        state.payments
            .filter(
                payment =>
                    payment.status === 'Pago'
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.value),
                0
            );

    const pending =
        state.payments
            .filter(
                payment =>
                    payment.status === 'Pendente'
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.value),
                0
            );

    return `
        <div class="row g-3 mb-3">

            <div class="col-md-6">

                <div class="stat-card kpi">

                    <div class="stat-value">
                        ${money(received)}
                    </div>

                    <div class="stat-label">
                        Total recebido
                    </div>

                </div>

            </div>

            <div class="col-md-6">

                <div class="stat-card kpi">

                    <div class="stat-value">
                        ${money(pending)}
                    </div>

                    <div class="stat-label">
                        Total a receber
                    </div>

                </div>

            </div>

        </div>

        <div class="table-card">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <strong>
                        Controle financeiro
                    </strong>

                    <div class="text-muted small">
                        Acompanhe cobranças e pagamentos
                        dos pacientes.
                    </div>

                </div>

                <button
                    class="btn btn-primary btn-sm"
                    onclick="addPayment()"
                >

                    <i class="bi bi-plus-lg me-1"></i>
                    Lançar pagamento

                </button>

            </div>

            <div class="table-responsive">

                <table class="table align-middle">

                    <thead>

                        <tr>
                            <th>Paciente</th>
                            <th>Descrição</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Método</th>
                            <th>Status</th>
                            <th></th>
                        </tr>

                    </thead>

                    <tbody>

                        ${state.payments.map(payment => `

                            <tr>

                                <td>
                                    <strong>
                                        ${patientName(payment.patientId)}
                                    </strong>
                                </td>

                                <td>
                                    ${payment.description}
                                </td>

                                <td>
                                    ${formatDate(payment.date)}
                                </td>

                                <td>
                                    ${money(payment.value)}
                                </td>

                                <td>
                                    ${payment.method}
                                </td>

                                <td>
                                    ${statusBadge(payment.status)}
                                </td>

                                <td>

                                    <button
                                        class="btn btn-sm btn-light"
                                        onclick="
                                            togglePayment(
                                                ${payment.id}
                                            )
                                        "
                                    >
                                        ${
                                            payment.status === 'Pago'
                                                ? 'Marcar pendente'
                                                : 'Marcar pago'
                                        }
                                    </button>

                                </td>

                            </tr>

                        `).join('')}

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function addPayment() {
    const options =
        state.patients
            .map(
                patient =>
                    `${patient.id}: ${patient.name}`
            )
            .join('\n');

    const id =
        Number(
            prompt(
                `Digite o ID do paciente:\n${options}`
            )
        );

    if (
        !state.patients.some(
            patient => patient.id === id
        )
    ) {
        toast(
            'Paciente não encontrado.',
            'danger'
        );

        return;
    }

    const value =
        Number(
            prompt(
                'Valor (R$):',
                '90'
            )
        );

    if (!value) {
        return;
    }

    const description =
        prompt(
            'Descrição:',
            'Sessão de fisioterapia'
        ) || 'Serviço';

    state.payments.push({
        id: Date.now(),
        patientId: id,
        description,
        date: today(),
        value,
        status: 'Pendente',
        method: 'Pix'
    });

    saveData();

    renderPage();

    toast(
        'Lançamento financeiro criado.',
        'success'
    );
}

function togglePayment(id) {
    const payment =
        state.payments.find(
            item => item.id === id
        );

    if (!payment) {
        return;
    }

    payment.status =
        payment.status === 'Pago'
            ? 'Pendente'
            : 'Pago';

    saveData();

    renderPage();

    toast(
        'Pagamento atualizado.',
        'success'
    );
}

function reports() {
    const total =
        state.payments.reduce(
            (sum, payment) =>
                sum + Number(payment.value),
            0
        );

    const paid =
        state.payments
            .filter(
                payment =>
                    payment.status === 'Pago'
            )
            .reduce(
                (sum, payment) =>
                    sum + Number(payment.value),
                0
            );

    const cancelled =
        state.appointments.filter(
            appointment =>
                appointment.status === 'Cancelada'
        ).length;

    const paymentRate =
        total
            ? Math.round((paid / total) * 100)
            : 0;

    const confirmed =
        state.appointments.filter(
            appointment =>
                appointment.status === 'Confirmada'
        ).length;

    const pending =
        state.appointments.filter(
            appointment =>
                appointment.status === 'Pendente'
        ).length;

    const patientsWithAssessment =
        new Set(
            state.assessments.map(
                assessment =>
                    assessment.patientId
            )
        ).size;

    return `
        <div class="row g-3">

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-cash-stack"></i>
                    </div>

                    <div class="stat-value">
                        ${money(total)}
                    </div>

                    <div class="stat-label">
                        Valor lançado
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-graph-up-arrow"></i>
                    </div>

                    <div class="stat-value">
                        ${paymentRate}%
                    </div>

                    <div class="stat-label">
                        Taxa de recebimento
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-calendar-x"></i>
                    </div>

                    <div class="stat-value">
                        ${cancelled}
                    </div>

                    <div class="stat-label">
                        Consultas canceladas
                    </div>

                </div>

            </div>

        </div>

        <div class="section-title">
            Resumo do sistema
        </div>

        <div class="panel">

            <div class="row g-3">

                <div class="col-md-6">

                    <h6>
                        Atendimentos por status
                    </h6>

                    <p class="mb-1">
                        Confirmadas:
                        <strong>
                            ${confirmed}
                        </strong>
                    </p>

                    <p class="mb-1">
                        Pendentes:
                        <strong>
                            ${pending}
                        </strong>
                    </p>

                    <p>
                        Canceladas:
                        <strong>
                            ${cancelled}
                        </strong>
                    </p>

                </div>

                <div class="col-md-6">

                    <h6>
                        Pacientes com avaliação
                    </h6>

                    <p class="mb-0">

                        ${patientsWithAssessment}
                        de
                        ${state.patients.length}

                        pacientes possuem avaliação registrada.

                    </p>

                </div>

            </div>

        </div>
    `;
}

function userDashboard() {
    const patient = state.patients[0];

    if (!patient) {
        return `
            <div class="alert alert-warning">
                Nenhum paciente cadastrado.
            </div>
        `;
    }

    const next =
        state.appointments
            .filter(
                appointment =>
                    appointment.patientId === patient.id &&
                    appointment.date >= today()
            )
            .sort(
                (a, b) =>
                    (a.date + a.time)
                        .localeCompare(
                            b.date + b.time
                        )
            )[0];

    const last =
        state.assessments
            .filter(
                assessment =>
                    assessment.patientId === patient.id
            )
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            )[0];

    return `
        <div class="hero">

            <h1>
                Olá, ${patient.name.split(' ')[0]}! 🌿
            </h1>

            <p>
                Acompanhe suas consultas,
                avaliações físicas e orientações
                da equipe da Clínica Joelma Negreiros.
            </p>

            <button
                class="btn btn-light"
                onclick="
                    state.page='minhas-consultas';
                    activateMenu();
                    renderPage();
                "
            >

                <i class="bi bi-calendar-check me-2"></i>

                Ver minhas consultas

            </button>

        </div>

        <div class="row g-3 mt-1">

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-calendar-heart"></i>
                    </div>

                    <div class="stat-value">
                        ${
                            state.appointments.filter(
                                appointment =>
                                    appointment.patientId === patient.id
                            ).length
                        }
                    </div>

                    <div class="stat-label">
                        Consultas registradas
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-file-medical"></i>
                    </div>

                    <div class="stat-value">
                        ${
                            state.assessments.filter(
                                assessment =>
                                    assessment.patientId === patient.id
                            ).length
                        }
                    </div>

                    <div class="stat-label">
                        Avaliações físicas
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-heart-pulse"></i>
                    </div>

                    <div class="stat-value">
                        ${last?.pain ?? '—'}
                    </div>

                    <div class="stat-label">
                        Dor na última avaliação (0–10)
                    </div>

                </div>

            </div>

        </div>

        <div class="section-title">
            Próxima consulta
        </div>

        <div class="panel">

            ${
                next
                    ? `
                        <div class="d-flex flex-wrap align-items-center gap-3">

                            <div class="patient-avatar">
                                <i class="bi bi-calendar2-check"></i>
                            </div>

                            <div class="flex-grow-1">

                                <strong>
                                    ${formatDate(next.date)}
                                    às
                                    ${next.time}
                                </strong>

                                <div class="text-muted small">
                                    ${next.type}
                                </div>

                            </div>

                            ${statusBadge(next.status)}

                        </div>
                    `
                    : `
                        <div class="empty-state py-3">
                            Nenhuma consulta futura agendada.
                        </div>
                    `
            }

        </div>

        <div class="section-title">
            Última orientação
        </div>

        <div class="panel">

            <p class="mb-0">
                ${
                    last?.note ||
                    'Sua fisioterapeuta ainda não registrou uma observação.'
                }
            </p>

        </div>
    `;
}

function userAppointments() {
    const patient = state.patients[0];

    if (!patient) {
        return `
            <div class="alert alert-warning">
                Nenhum paciente cadastrado.
            </div>
        `;
    }

    const list =
        state.appointments.filter(
            appointment =>
                appointment.patientId === patient.id
        );

    return `
        <div class="panel">

            <h5 class="mb-1">
                Minhas consultas
            </h5>

            <p class="text-muted small">
                Histórico e próximos atendimentos.
            </p>

            ${
                list.length
                    ? `
                        <div class="table-responsive">

                            <table class="table">

                                <thead>

                                    <tr>
                                        <th>Data</th>
                                        <th>Horário</th>
                                        <th>Atendimento</th>
                                        <th>Status</th>
                                        <th>Observação</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    ${[...list]
                                        .sort(
                                            (a, b) =>
                                                (b.date + b.time)
                                                    .localeCompare(
                                                        a.date + a.time
                                                    )
                                        )
                                        .map(appointment => `

                                            <tr>

                                                <td>
                                                    ${formatDate(appointment.date)}
                                                </td>

                                                <td>
                                                    ${appointment.time}
                                                </td>

                                                <td>
                                                    ${appointment.type}
                                                </td>

                                                <td>
                                                    ${statusBadge(appointment.status)}
                                                </td>

                                                <td>
                                                    ${
                                                        appointment.note ||
                                                        '—'
                                                    }
                                                </td>

                                            </tr>

                                        `).join('')}

                                </tbody>

                            </table>

                        </div>
                    `
                    : `
                        <div class="empty-state">
                            Nenhuma consulta registrada.
                        </div>
                    `
            }

        </div>
    `;
}

function userAssessments() {
    const patient = state.patients[0];

    if (!patient) {
        return `
            <div class="alert alert-warning">
                Nenhum paciente cadastrado.
            </div>
        `;
    }

    const list =
        state.assessments
            .filter(
                assessment =>
                    assessment.patientId === patient.id
            )
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            );

    return `
        <div class="mb-3">

            <p class="text-muted">
                Aqui aparecem as avaliações e
                observações liberadas pela clínica.
            </p>

        </div>

        <div class="row g-3">

            ${
                list.length
                    ? list
                        .map(
                            assessment =>
                                assessmentCard(
                                    assessment,
                                    true
                                )
                        )
                        .join('')
                    : `
                        <div class="col-12">

                            <div class="panel empty-state">
                                Nenhuma avaliação disponível.
                            </div>

                        </div>
                    `
            }

        </div>
    `;
}

function userPayments() {
    const patient = state.patients[0];

    if (!patient) {
        return `
            <div class="alert alert-warning">
                Nenhum paciente cadastrado.
            </div>
        `;
    }

    const list =
        state.payments.filter(
            payment =>
                payment.patientId === patient.id
        );

    return `
        <div class="panel">

            <h5>
                Meus pagamentos
            </h5>

            <p class="text-muted small">
                Consulte valores e situação das cobranças.
            </p>

            <div class="table-responsive">

                <table class="table">

                    <thead>

                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Método</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            list.length
                                ? list.map(payment => `

                                    <tr>

                                        <td>
                                            ${formatDate(payment.date)}
                                        </td>

                                        <td>
                                            ${payment.description}
                                        </td>

                                        <td>
                                            ${money(payment.value)}
                                        </td>

                                        <td>
                                            ${payment.method}
                                        </td>

                                        <td>
                                            ${statusBadge(payment.status)}
                                        </td>

                                    </tr>

                                `).join('')
                                : `
                                    <tr>

                                        <td
                                            colspan="5"
                                            class="text-center text-muted"
                                        >
                                            Nenhum pagamento registrado.
                                        </td>

                                    </tr>
                                `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function fillPatientSelect(id) {
    const element =
        document.getElementById(id);

    if (!element) {
        console.error(
            `Elemento #${id} não encontrado.`
        );
        return;
    }

    element.innerHTML =
        state.patients
            .map(
                patient =>
                    `<option value="${patient.id}">
                        ${patient.name}
                    </option>`
            )
            .join('');
}

function openAppointmentModal() {
    fillPatientSelect(
        'appointmentPatient'
    );

    const date =
        document.getElementById(
            'appointmentDate'
        );

    if (date) {
        date.value = today();
    }

    const modalElement =
        document.getElementById(
            'appointmentModal'
        );

    if (!modalElement) {
        console.error(
            'Modal #appointmentModal não encontrado.'
        );
        return;
    }

    const modal =
        new bootstrap.Modal(modalElement);

    modal.show();
}

function saveAppointment() {
    const form =
        document.getElementById(
            'appointmentForm'
        );

    if (!form) {
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patient =
        document.getElementById(
            'appointmentPatient'
        );

    const type =
        document.getElementById(
            'appointmentType'
        );

    const date =
        document.getElementById(
            'appointmentDate'
        );

    const time =
        document.getElementById(
            'appointmentTime'
        );

    const note =
        document.getElementById(
            'appointmentNote'
        );

    state.appointments.push({
        id: Date.now(),
        patientId: Number(patient.value),
        type: type.value,
        date: date.value,
        time: time.value,
        status: 'Pendente',
        note: note.value
    });

    saveData();

    const modalElement =
        document.getElementById(
            'appointmentModal'
        );

    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );

    if (modal) {
        modal.hide();
    }

    form.reset();

    renderPage();

    toast(
        'Consulta agendada com sucesso.',
        'success'
    );
}

function previewImage(input, target) {
    const box =
        document.getElementById(target);

    if (!box || !input.files[0]) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = event => {
        box.innerHTML = `
            <img
                src="${event.target.result}"
                alt="Pré-visualização"
            >
        `;
    };

    reader.readAsDataURL(
        input.files[0]
    );
}

function openAssessmentModal() {
    fillPatientSelect(
        'assessmentPatient'
    );

    const modalElement =
        document.getElementById(
            'assessmentModal'
        );

    if (!modalElement) {
        console.error(
            'Modal #assessmentModal não encontrado.'
        );
        return;
    }

    const modal =
        new bootstrap.Modal(modalElement);

    modal.show();
}

function saveAssessment() {
    const form =
        document.getElementById(
            'assessmentForm'
        );

    if (!form) {
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patient =
        document.getElementById(
            'assessmentPatient'
        );

    const weight =
        document.getElementById(
            'weight'
        );

    const height =
        document.getElementById(
            'height'
        );

    const pain =
        document.getElementById(
            'pain'
        );

    const mobility =
        document.getElementById(
            'mobility'
        );

    const note =
        document.getElementById(
            'assessmentNote'
        );

    const beforePhoto =
        document.getElementById(
            'beforePhoto'
        );

    const afterPhoto =
        document.getElementById(
            'afterPhoto'
        );

    const readImage = input => {
        return new Promise(resolve => {

            if (!input || !input.files[0]) {
                resolve('');
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                event =>
                    resolve(
                        event.target.result
                    );

            reader.readAsDataURL(
                input.files[0]
            );
        });
    };

    Promise.all([
        readImage(beforePhoto),
        readImage(afterPhoto)
    ]).then(([before, after]) => {

        state.assessments.push({
            id: Date.now(),
            patientId: Number(patient.value),
            date: today(),
            weight: weight.value,
            height: height.value,
            pain: pain.value,
            mobility: mobility.value,
            note: note.value,
            before,
            after
        });

        saveData();

        const modalElement =
            document.getElementById(
                'assessmentModal'
            );

        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );

        if (modal) {
            modal.hide();
        }

        form.reset();

        const beforePreview =
            document.getElementById(
                'beforePreview'
            );

        const afterPreview =
            document.getElementById(
                'afterPreview'
            );

        if (beforePreview) {
            beforePreview.innerHTML = `
                <i class="bi bi-image"></i>
                <span>Pré-visualização</span>
            `;
        }

        if (afterPreview) {
            afterPreview.innerHTML = `
                <i class="bi bi-image"></i>
                <span>Pré-visualização</span>
            `;
        }

        renderPage();

        toast(
            'Avaliação registrada e disponível na área do paciente.',
            'success'
        );
    });
}

function toast(message, type = 'success') {
    const toastArea =
        document.getElementById(
            'toastArea'
        );

    if (!toastArea) {
        return;
    }

    const element =
        document.createElement('div');

    element.className =
        `toast align-items-center text-bg-${type} border-0`;

    element.innerHTML = `
        <div class="d-flex">

            <div class="toast-body">

                <i class="bi bi-check-circle me-2"></i>

                ${message}

            </div>

            <button
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
            ></button>

        </div>
    `;

    toastArea.appendChild(element);

    const toastInstance =
        new bootstrap.Toast(
            element,
            {
                delay: 2800
            }
        );

    toastInstance.show();

    element.addEventListener(
        'hidden.bs.toast',
        () => element.remove()
    );
}

window.login = login;
window.logout = logout;
window.toggleSidebar = toggleSidebar;
window.toggleTheme = toggleTheme;
window.openAppointmentModal = openAppointmentModal;
window.saveAppointment = saveAppointment;
window.filterAgenda = filterAgenda;
window.changeAppointmentStatus = changeAppointmentStatus;
window.addPatient = addPatient;
window.openAssessmentModal = openAssessmentModal;
window.saveAssessment = saveAssessment;
window.previewImage = previewImage;
window.addPayment = addPayment;
window.togglePayment = togglePayment;

loadData();

if (
    localStorage.getItem('jf_dark') === 'true'
) {
    document.body.classList.add('dark-mode');
}