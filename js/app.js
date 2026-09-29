let editingPatientId = null;
let editingAssessmentId = null;

const state = {
    role: 'admin',
    page: 'dashboard',
    currentPatientId: null,
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

const defaultAccounts = [
    {
        email: 'paciente@joelmafisioterapia.com',
        password: '123456',
        patientId: 1
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
        JSON.parse(
            localStorage.getItem('jf_patients') || 'null'
        ) || defaultPatients;

    state.appointments =
        JSON.parse(
            localStorage.getItem('jf_appointments') || 'null'
        ) || defaultAppointments;

    state.assessments =
        JSON.parse(
            localStorage.getItem('jf_assessments') || 'null'
        ) || defaultAssessments;

    state.payments =
        JSON.parse(
            localStorage.getItem('jf_payments') || 'null'
        ) || defaultPayments;

    if (!localStorage.getItem('jf_accounts')) {
        localStorage.setItem(
            'jf_accounts',
            JSON.stringify(defaultAccounts)
        );
    }
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
    const email =
        document
            .getElementById('loginEmail')
            ?.value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById('loginPassword')?.value;

    const role =
        document.getElementById('loginRole')?.value;

    if (!email || !password) {
        toast(
            'Informe seu e-mail e sua senha.',
            'danger'
        );
        return;
    }

    if (role === 'admin') {

        if (
            email !== 'admin@joelmafisioterapia.com' ||
            password !== '123456'
        ) {
            toast(
                'E-mail ou senha da administradora inválidos.',
                'danger'
            );
            return;
        }

        state.currentPatientId = null;

    } else {

        const accounts =
            JSON.parse(
                localStorage.getItem('jf_accounts') || '[]'
            );

        const account =
            accounts.find(
                item =>
                    item.email === email &&
                    item.password === password
            );

        if (!account) {
            toast(
                'E-mail ou senha inválidos. Crie uma conta para continuar.',
                'danger'
            );
            return;
        }

        state.currentPatientId =
            account.patientId;
    }

    state.role = role;

    const loginScreen =
        document.getElementById(
            'loginScreen'
        );

    const app =
        document.getElementById(
            'app'
        );

    const adminMenu =
        document.getElementById(
            'adminMenu'
        );

    const userMenu =
        document.getElementById(
            'userMenu'
        );

    if (!loginScreen || !app) {
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

    const patient =
        state.patients.find(
            item =>
                item.id ===
                state.currentPatientId
        );

    const profileName =
        document.getElementById(
            'profileName'
        );

    const profileRole =
        document.getElementById(
            'profileRole'
        );

    const profileAvatar =
        document.getElementById(
            'profileAvatar'
        );

    if (profileName) {
        profileName.textContent =
            state.role === 'admin'
                ? 'Joelma Negreiros'
                : (
                    patient?.name ||
                    'Paciente'
                );
    }

    if (profileRole) {
        profileRole.textContent =
            state.role === 'admin'
                ? 'Administradora'
                : 'Paciente';
    }

    if (profileAvatar) {

        const name =
            state.role === 'admin'
                ? 'Joelma Negreiros'
                : (
                    patient?.name ||
                    'Paciente'
                );

        profileAvatar.textContent =
            name
                .split(' ')
                .map(
                    item =>
                        item[0]
                )
                .slice(0, 2)
                .join('')
                .toUpperCase();
    }

    state.page =
        state.role === 'admin'
            ? 'dashboard'
            : 'meu-dashboard';

    activateMenu();
    renderPage();
}

function openRegisterModal() {
    const modal =
        document.getElementById(
            'registerModal'
        );

    if (modal) {
        new bootstrap.Modal(
            modal
        ).show();
    }
}

function registerPatient() {
    const form =
        document.getElementById(
            'registerForm'
        );

    if (
        !form ||
        !form.checkValidity()
    ) {
        form?.reportValidity();
        return;
    }

    const name =
        document
            .getElementById(
                'registerName'
            )
            .value
            .trim();

    const phone =
        document
            .getElementById(
                'registerPhone'
            )
            .value
            .trim();

    const goal =
        document
            .getElementById(
                'registerGoal'
            )
            .value
            .trim() ||
        'Acompanhamento fisioterapêutico';

    const email =
        document
            .getElementById(
                'registerEmail'
            )
            .value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById(
            'registerPassword'
        ).value;

    const accounts =
        JSON.parse(
            localStorage.getItem(
                'jf_accounts'
            ) || '[]'
        );

    if (
        email ===
            'admin@joelmafisioterapia.com' ||
        accounts.some(
            item =>
                item.email ===
                email
        )
    ) {
        toast(
            'Este e-mail já está cadastrado.',
            'danger'
        );
        return;
    }

    const patientId =
        Date.now();

    state.patients.push({
        id: patientId,
        name,
        phone,
        goal
    });

    accounts.push({
        email,
        password,
        patientId
    });

    localStorage.setItem(
        'jf_accounts',
        JSON.stringify(accounts)
    );

    saveData();

    const modalElement =
        document.getElementById(
            'registerModal'
        );

    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );

    if (modal) {
        modal.hide();
    }

    form.reset();

    document.getElementById(
        'loginEmail'
    ).value = email;

    document.getElementById(
        'loginPassword'
    ).value = password;

    document.getElementById(
        'loginRole'
    ).value = 'user';

    toast(
        'Conta criada. Agora entre no sistema.',
        'success'
    );
}

function logout() {
    const app =
        document.getElementById(
            'app'
        );

    const loginScreen =
        document.getElementById(
            'loginScreen'
        );

    if (app) {
        app.classList.add(
            'd-none'
        );
    }

    if (loginScreen) {
        loginScreen.classList.remove(
            'd-none'
        );
    }

    state.role = 'admin';
    state.currentPatientId = null;
}

function toggleSidebar() {
    const sidebar =
        document.getElementById(
            'sidebar'
        );

    if (sidebar) {
        sidebar.classList.toggle(
            'open'
        );
    }
}

function toggleTheme() {
    document.body.classList.toggle(
        'dark-mode'
    );

    localStorage.setItem(
        'jf_dark',
        document.body.classList.contains(
            'dark-mode'
        )
    );
}

function patientName(id) {
    const patient =
        state.patients.find(
            patient =>
                patient.id == id
        );

    return (
        patient?.name ||
        'Paciente'
    );
}

function formatDate(date) {
    if (!date) {
        return '-';
    }

    return new Date(
        date + 'T00:00:00'
    ).toLocaleDateString(
        'pt-BR'
    );
}

function money(value) {
    return Number(
        value
    ).toLocaleString(
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

    let className =
        'badge-pending';

    if (
        status === 'Confirmada' ||
        status === 'Pago'
    ) {
        className =
            'badge-confirmed';
    }

    if (
        status === 'Cancelada'
    ) {
        className =
            'badge-cancelled';
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

    menuLinks.forEach(
        button => {

            button.classList.toggle(
                'active',
                button.dataset.page ===
                    state.page
            );

            button.onclick = () => {

                state.page =
                    button.dataset.page;

                activateMenu();
                renderPage();

                if (
                    window.innerWidth <
                    992
                ) {
                    toggleSidebar();
                }
            };
        }
    );
}

function renderPage() {

    const titles = {

        dashboard:
            'Início',

        agenda:
            'Agenda e consultas',

        pacientes:
            'Pacientes',

        avaliacoes:
            'Avaliações físicas',

        pagamentos:
            'Pagamentos',

        relatorios:
            'Relatórios',

        'meu-dashboard':
            'Minha área',

        'minhas-consultas':
            'Minhas consultas',

        'minhas-avaliacoes':
            'Minhas avaliações',

        'meus-pagamentos':
            'Meus pagamentos'
    };

    const pageTitle =
        document.getElementById(
            'pageTitle'
        );

    const breadcrumb =
        document.getElementById(
            'breadcrumb'
        );

    const todayDate =
        document.getElementById(
            'todayDate'
        );

    if (pageTitle) {
        pageTitle.textContent =
            titles[state.page] ||
            'Página';
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

        dashboard:
            adminDashboard,

        agenda:
            agenda,

        pacientes:
            patients,

        avaliacoes:
            assessments,

        pagamentos:
            payments,

        relatorios:
            reports,

        'meu-dashboard':
            userDashboard,

        'minhas-consultas':
            userAppointments,

        'minhas-avaliacoes':
            userAssessments,

        'meus-pagamentos':
            userPayments
    };

    const pageContent =
        document.getElementById(
            'pageContent'
        );

    if (!pageContent) {
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

    const currentDate =
        today();

    const appointmentsToday =
        state.appointments.filter(
            appointment =>
                appointment.date ===
                currentDate
        );

    const received =
        state.payments
            .filter(
                payment =>
                    payment.status ===
                    'Pago'
            )
            .reduce(
                (
                    sum,
                    payment
                ) =>
                    sum +
                    Number(
                        payment.value
                    ),
                0
            );

    const pending =
        state.payments
            .filter(
                payment =>
                    payment.status ===
                    'Pendente'
            )
            .reduce(
                (
                    sum,
                    payment
                ) =>
                    sum +
                    Number(
                        payment.value
                    ),
                0
            );

    const nextAppointments =
        state.appointments
            .filter(
                appointment =>
                    appointment.date >=
                    currentDate
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    (
                        a.date +
                        a.time
                    ).localeCompare(
                        b.date +
                        b.time
                    )
            )
            .slice(0, 5);


    return `
        <div class="hero">

            <div class="row align-items-center">

                <div class="col-lg-8">

                    <h1>
                        Bom dia, Joelma, sua clínica organizada em um só lugar.
                    </h1>

                    <p>
                        Acompanhe sua agenda, seus pacientes e a rotina da clínica com praticidade.
                    </p>

                    <button
                        class="btn btn-light"
                        onclick="openAppointmentModal()"
                    >
                        Agendar consulta
                    </button>

                </div>

                <div class="col-lg-4 d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0">

                    <div class="hero-logo">

                        <img
                            src="assets/img2.png"
                            alt="Joelma Negreiros Fisioterapeuta"
                        >

                    </div>

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

    return list
        .map(
            appointment => {

                const initials =
                    patientName(
                        appointment.patientId
                    )
                        .split(' ')
                        .map(
                            name =>
                                name[0]
                        )
                        .slice(0, 2)
                        .join('');

                return `
                    <div class="appointment-row">

                        <div class="time-box">
                            ${appointment.time}
                        </div>

                        <div class="patient-avatar">
                            ${initials}
                        </div>

                        <div class="flex-grow-1">

                            <strong>
                                ${patientName(appointment.patientId)}
                            </strong>

                            <div class="text-muted small">

                                ${formatDate(appointment.date)}
                                ·
                                ${appointment.type}

                                ${
                                    appointment.note
                                        ? ` · ${appointment.note}`
                                        : ''
                                }

                            </div>

                        </div>

                        ${statusBadge(
                            appointment.status
                        )}

                    </div>
                `;
            }
        )
        .join('');
}

function agenda() {

    return `
        <div class="table-card">

            <div class="row g-2 mb-3">

                <div class="col-md-5">

                    <input
                        id="agendaSearch"
                        class="form-control"
                        placeholder="Pesquisar paciente"
                        oninput="filterAgenda()"
                    >

                </div>

                <div class="col-md-3">

                    <input
                        id="agendaDate"
                        type="date"
                        class="form-control"
                        onchange="filterAgenda()"
                    >

                </div>

                <div class="col-md-2">

                    <select
                        id="agendaStatus"
                        class="form-select"
                        onchange="filterAgenda()"
                    >

                        <option value="">
                            Todos
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

                <div class="col-md-2">

                    <button
                        class="btn btn-primary w-100"
                        onclick="openAppointmentModal()"
                    >
                        Agendar
                    </button>

                </div>

            </div>

            <div id="agendaResults">

                ${agendaTable(
                    state.appointments
                )}

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

    const sortedList =
        [...list].sort(
            (a, b) =>
                (
                    a.date +
                    a.time
                ).localeCompare(
                    b.date +
                    b.time
                )
        );

    return `
        <div class="table-responsive">

            <table class="table align-middle">

                <thead>

                    <tr>

                        <th>
                            Data
                        </th>

                        <th>
                            Horário
                        </th>

                        <th>
                            Paciente
                        </th>

                        <th>
                            Atendimento
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Ação
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${sortedList
                        .map(
                            appointment => `
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
                                        ${statusBadge(
                                            appointment.status
                                        )}
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
                            `
                        )
                        .join('')}

                </tbody>

            </table>

        </div>
    `;
}

function filterAgenda() {

    const search =
        (
            document.getElementById(
                'agendaSearch'
            )?.value ||
            ''
        ).toLowerCase();

    const date =
        document.getElementById(
            'agendaDate'
        )?.value ||
        '';

    const status =
        document.getElementById(
            'agendaStatus'
        )?.value ||
        '';

    const filteredList =
        state.appointments.filter(
            appointment => {

                const matchesSearch =
                    !search ||
                    patientName(
                        appointment.patientId
                    )
                        .toLowerCase()
                        .includes(search);

                const matchesDate =
                    !date ||
                    appointment.date ===
                    date;

                const matchesStatus =
                    !status ||
                    appointment.status ===
                    status;

                return (
                    matchesSearch &&
                    matchesDate &&
                    matchesStatus
                );
            }
        );

    const results =
        document.getElementById(
            'agendaResults'
        );

    if (results) {
        results.innerHTML =
            agendaTable(
                filteredList
            );
    }
}

function changeAppointmentStatus(
    id,
    status
) {

    const appointment =
        state.appointments.find(
            item =>
                item.id === id
        );

    if (!appointment) {
        return;
    }

    appointment.status =
        status;

    saveData();

    toast(
        'Status atualizado com sucesso.',
        'success'
    );

    filterAgenda();
}

function patients() {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
            <p class="text-muted mb-0">
                Cadastro e acompanhamento básico dos pacientes.
            </p>
            <button
                class="btn btn-primary"
                type="button"
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
                            <th class="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.patients.length
                            ? state.patients.map(patient => {
                                const count = state.appointments.filter(
                                    appointment => appointment.patientId === patient.id
                                ).length;

                                const lastAssessment = state.assessments
                                    .filter(assessment => assessment.patientId === patient.id)
                                    .sort((a, b) => b.date.localeCompare(a.date))[0];

                                return `
                                    <tr>
                                        <td><strong>${patient.name}</strong></td>
                                        <td>${patient.phone || 'Não informado'}</td>
                                        <td>${patient.goal || 'Acompanhamento fisioterapêutico'}</td>
                                        <td>${count}</td>
                                        <td>${lastAssessment ? formatDate(lastAssessment.date) : 'Nenhuma'}</td>
                                        <td class="text-end text-nowrap">
                                            <div class="d-inline-flex gap-2">
                                                <button
                                                    class="btn btn-sm btn-outline-primary"
                                                    type="button"
                                                    onclick="editPatient(${Number(patient.id)})"
                                                    aria-label="Editar paciente ${patient.name}"
                                                >
                                                    <i class="bi bi-pencil-square me-1"></i>Editar
                                                </button>
                                                <button
                                                    class="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onclick="deletePatient(${Number(patient.id)})"
                                                    aria-label="Excluir paciente ${patient.name}"
                                                >
                                                    <i class="bi bi-trash me-1"></i>Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')
                            : `
                                <tr>
                                    <td colspan="6" class="text-center text-muted py-4">
                                        Nenhum paciente cadastrado.
                                    </td>
                                </tr>
                            `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function addPatient() {
    openPatientModal();
}

function editPatient(id) {
    if (state.role !== 'admin') {
        return;
    }

    openPatientModal(id);
}

function openPatientModal(patientId = null) {
    if (state.role !== 'admin') {
        return;
    }

    const form = document.getElementById('patientForm');
    const modalElement = document.getElementById('patientModal');
    if (!form || !modalElement) {
        return;
    }

    form.reset();
    editingPatientId = patientId === null ? null : Number(patientId);

    const patient = editingPatientId === null
        ? null
        : state.patients.find(item => item.id === editingPatientId);

    if (editingPatientId !== null && !patient) {
        editingPatientId = null;
        toast('Paciente não encontrado.', 'danger');
        return;
    }

    document.getElementById('patientModalTitle').textContent =
        patient ? 'Editar paciente' : 'Cadastrar paciente';
    document.getElementById('patientSaveButton').textContent =
        patient ? 'Salvar alterações' : 'Cadastrar paciente';

    if (patient) {
        document.getElementById('patientName').value = patient.name || '';
        document.getElementById('patientPhone').value = patient.phone || '';
        document.getElementById('patientGoal').value = patient.goal || '';
    }

    bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

function savePatient() {
    if (state.role !== 'admin') {
        return;
    }

    const form = document.getElementById('patientForm');
    if (!form) {
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const goal = document.getElementById('patientGoal').value.trim() ||
        'Acompanhamento fisioterapêutico';

    if (!name) {
        toast('Informe o nome do paciente.', 'warning');
        return;
    }

    if (editingPatientId !== null) {
        const index = state.patients.findIndex(
            item => item.id === editingPatientId
        );

        if (index === -1) {
            toast('Paciente não encontrado.', 'danger');
            return;
        }

        state.patients[index] = {
            ...state.patients[index],
            name,
            phone: phone || 'Não informado',
            goal
        };
    } else {
        state.patients.push({
            id: Date.now(),
            name,
            phone: phone || 'Não informado',
            goal
        });
    }

    const wasEditing = editingPatientId !== null;
    saveData();
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById('patientModal')
    ).hide();
    form.reset();
    editingPatientId = null;
    renderPage();
    toast(
        wasEditing ? 'Dados do paciente atualizados.' : 'Paciente cadastrado.',
        'success'
    );
}

function deletePatient(id) {
    if (state.role !== 'admin') {
        return;
    }

    const patient = state.patients.find(item => item.id === Number(id));
    if (!patient) {
        toast('Paciente não encontrado.', 'danger');
        return;
    }

    if (!confirm(`Deseja realmente excluir o paciente ${patient.name}? Essa ação também removerá consultas, avaliações e pagamentos vinculados.`)) {
        return;
    }

    state.patients = state.patients.filter(item => item.id !== patient.id);
    state.appointments = state.appointments.filter(
        appointment => appointment.patientId !== patient.id
    );
    state.assessments = state.assessments.filter(
        assessment => assessment.patientId !== patient.id
    );
    state.payments = state.payments.filter(
        payment => payment.patientId !== patient.id
    );

    const accounts = JSON.parse(localStorage.getItem('jf_accounts') || '[]');
    localStorage.setItem(
        'jf_accounts',
        JSON.stringify(accounts.filter(account => account.patientId !== patient.id))
    );

    saveData();
    renderPage();
    toast('Paciente excluído com sucesso.', 'success');
}

function assessments() {

    return `
        <div class="d-flex justify-content-between align-items-center mb-3">

            <div>

                <p class="text-muted mb-0">
                    Registre evolução, medidas, observações e fotos de antes e depois.
                </p>

            </div>

            <button
                class="btn btn-primary"
                onclick="openAssessmentModal()"
            >
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

function assessmentCard(
    assessment,
    user
) {

    return `
        <div class="col-xl-6">

            <div class="assessment-card">

                <div class="assessment-head">

                    <div>

                        <strong>
                            ${patientName(
                                assessment.patientId
                            )}
                        </strong>

                        <div class="text-muted small">
                            ${formatDate(
                                assessment.date
                            )}
                        </div>

                    </div>

                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="badge-soft badge-confirmed">
                            Evolução
                        </span>
                        ${user ? '' : `
                            <button
                                class="btn btn-sm btn-outline-primary"
                                type="button"
                                onclick="openAssessmentModal(${Number(assessment.id)})"
                                aria-label="Editar avaliação de ${patientName(assessment.patientId)}"
                            >
                                <i class="bi bi-pencil-square me-1"></i>Editar
                            </button>
                        `}
                    </div>

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
                                                <i class="bi bi-image"></i>
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
                                                <i class="bi bi-image"></i>
                                            `
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="col-md-7 p-3">

                        <div class="row g-2 mb-3">

                            <div class="col-6">

                                <div class="metric">

                                    <small>
                                        Peso
                                    </small>

                                    <strong>
                                        ${
                                            assessment.weight
                                                ? `${assessment.weight} kg`
                                                : '—'
                                        }
                                    </strong>

                                </div>

                            </div>

                            <div class="col-6">

                                <div class="metric">

                                    <small>
                                        Altura
                                    </small>

                                    <strong>
                                        ${
                                            assessment.height
                                                ? `${assessment.height} cm`
                                                : '—'
                                        }
                                    </strong>

                                </div>

                            </div>

                            <div class="col-6">

                                <div class="metric">

                                    <small>
                                        Dor
                                    </small>

                                    <strong>
                                        ${
                                            assessment.pain ||
                                            '—'
                                        }
                                    </strong>

                                </div>

                            </div>

                            <div class="col-6">

                                <div class="metric">

                                    <small>
                                        Mobilidade
                                    </small>

                                    <strong>
                                        ${
                                            assessment.mobility ||
                                            '—'
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        ${assessment.bodyFat || assessment.muscleMass || assessment.bodyWater || assessment.visceralFat || assessment.basalMetabolism ? `
                            <div class="mb-3">
                                <small class="text-muted">Bioimpedância</small>
                                <div class="row g-2 mt-1">
                                    <div class="col-6 col-lg-4">
                                        <div class="metric"><small>Gordura corporal</small><strong>${assessment.bodyFat ? `${assessment.bodyFat}%` : '—'}</strong></div>
                                    </div>
                                    <div class="col-6 col-lg-4">
                                        <div class="metric"><small>Massa muscular</small><strong>${assessment.muscleMass ? `${assessment.muscleMass} kg` : '—'}</strong></div>
                                    </div>
                                    <div class="col-6 col-lg-4">
                                        <div class="metric"><small>Água corporal</small><strong>${assessment.bodyWater ? `${assessment.bodyWater}%` : '—'}</strong></div>
                                    </div>
                                    <div class="col-6 col-lg-4">
                                        <div class="metric"><small>Gordura visceral</small><strong>${assessment.visceralFat || '—'}</strong></div>
                                    </div>
                                    <div class="col-6 col-lg-4">
                                        <div class="metric"><small>Metabolismo basal</small><strong>${assessment.basalMetabolism ? `${assessment.basalMetabolism} kcal` : '—'}</strong></div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}

                        <div>

                            <small class="text-muted">
                                Observações
                            </small>

                            <p class="mb-0 mt-1">
                                ${
                                    assessment.note ||
                                    'Nenhuma observação.'
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    `;
}

function payments() {

    const total =
        state.payments.reduce(
            (
                sum,
                payment
            ) =>
                sum +
                Number(
                    payment.value
                ),
            0
        );

    const paid =
        state.payments
            .filter(
                payment =>
                    payment.status ===
                    'Pago'
            )
            .reduce(
                (
                    sum,
                    payment
                ) =>
                    sum +
                    Number(
                        payment.value
                    ),
                0
            );

    const pending =
        state.payments
            .filter(
                payment =>
                    payment.status ===
                    'Pendente'
            )
            .reduce(
                (
                    sum,
                    payment
                ) =>
                    sum +
                    Number(
                        payment.value
                    ),
                0
            );

    return `
        <div class="row g-3 mb-3">

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-label">
                        Total registrado
                    </div>

                    <div class="stat-value">
                        ${money(total)}
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-label">
                        Recebido
                    </div>

                    <div class="stat-value">
                        ${money(paid)}
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-label">
                        A receber
                    </div>

                    <div class="stat-value">
                        ${money(pending)}
                    </div>

                </div>

            </div>

        </div>

        <div class="d-flex justify-content-end mb-3">

            <button
                class="btn btn-primary"
                onclick="addPayment()"
            >
                Novo pagamento
            </button>

        </div>

        <div class="table-card">

            <div class="table-responsive">

                <table class="table align-middle">

                    <thead>

                        <tr>

                            <th>
                                Data
                            </th>

                            <th>
                                Paciente
                            </th>

                            <th>
                                Descrição
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Método
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Ação
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            state.payments.length
                                ? state.payments
                                    .map(
                                        payment => `
                                            <tr>

                                                <td>
                                                    ${formatDate(
                                                        payment.date
                                                    )}
                                                </td>

                                                <td>
                                                    ${patientName(
                                                        payment.patientId
                                                    )}
                                                </td>

                                                <td>
                                                    ${payment.description}
                                                </td>

                                                <td>
                                                    ${money(
                                                        payment.value
                                                    )}
                                                </td>

                                                <td>
                                                    ${payment.method}
                                                </td>

                                                <td>
                                                    ${statusBadge(
                                                        payment.status
                                                    )}
                                                </td>

                                                <td>

                                                    <button
                                                        class="btn btn-sm btn-outline-primary"
                                                        onclick="togglePayment(${payment.id})"
                                                    >
                                                        Alterar
                                                    </button>

                                                </td>

                                            </tr>
                                        `
                                    )
                                    .join('')
                                : `
                                    <tr>

                                        <td
                                            colspan="7"
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

function reports() {

    const confirmed =
        state.appointments.filter(
            appointment =>
                appointment.status ===
                'Confirmada'
        ).length;

    const pending =
        state.appointments.filter(
            appointment =>
                appointment.status ===
                'Pendente'
        ).length;

    const cancelled =
        state.appointments.filter(
            appointment =>
                appointment.status ===
                'Cancelada'
        ).length;

    const patientsWithAssessment =
        state.patients.filter(
            patient =>
                state.assessments.some(
                    assessment =>
                        assessment.patientId ===
                        patient.id
                )
        ).length;

    return `
        <div class="row g-3">

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-label">
                        Consultas confirmadas
                    </div>

                    <div class="stat-value">
                        ${confirmed}
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-label">
                        Consultas pendentes
                    </div>

                    <div class="stat-value">
                        ${pending}
                    </div>

                </div>

            </div>

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-label">
                        Consultas canceladas
                    </div>

                    <div class="stat-value">
                        ${cancelled}
                    </div>

                </div>

            </div>

        </div>

        <div class="section-title">
            Avaliações
        </div>

        <div class="panel">

            <p class="mb-0">
                ${patientsWithAssessment}
                de
                ${state.patients.length}
                pacientes possuem avaliação registrada.
            </p>

        </div>
    `;
}

function userDashboard() {

    const patient =
        state.patients.find(
            item =>
                item.id ===
                state.currentPatientId
        ) ||
        state.patients[0];

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
                    appointment.patientId ===
                    patient.id &&
                    appointment.date >=
                    today()
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    (
                        a.date +
                        a.time
                    ).localeCompare(
                        b.date +
                        b.time
                    )
            )[0];

    const last =
        state.assessments
            .filter(
                assessment =>
                    assessment.patientId ===
                    patient.id
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.date.localeCompare(
                        a.date
                    )
            )[0];

    return `
        <div class="hero">

            <div class="row align-items-center">

                <div class="col-lg-8">

                    <h1>
                        Olá, ${patient.name}.
                    </h1>

                    <p>
                        Acompanhe suas consultas, avaliações e informações da clínica.
                    </p>

                    <button
                        class="btn btn-light"
                        onclick="openAppointmentModal()"
                    >
                        Agendar consulta
                    </button>

                </div>

                <div class="col-lg-4 d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0">

                    <div class="hero-logo">

                        <img
                            src="assets/img2.png"
                            alt="Joelma Negreiros Fisioterapeuta"
                        >

                    </div>

                </div>

            </div>

        </div>

        <div class="row g-3 mt-1">

            <div class="col-md-4">

                <div class="stat-card">

                    <div class="stat-icon">
                        <i class="bi bi-calendar-check"></i>
                    </div>

                    <div class="stat-value">

                        ${
                            state.appointments.filter(
                                appointment =>
                                    appointment.patientId ===
                                    patient.id
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
                                    assessment.patientId ===
                                    patient.id
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
                        Dor na última avaliação
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
                                    ${formatDate(
                                        next.date
                                    )}
                                    às
                                    ${next.time}
                                </strong>

                                <div class="text-muted small">
                                    ${next.type}
                                </div>

                            </div>

                            ${statusBadge(
                                next.status
                            )}

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

    const patient =
        state.patients.find(
            item =>
                item.id ===
                state.currentPatientId
        ) ||
        state.patients[0];

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
                appointment.patientId ===
                patient.id
        );

    return `
        <div class="panel">

            <div class="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h5 class="mb-1">
                        Minhas consultas
                    </h5>

                    <p class="text-muted small mb-0">
                        Histórico e próximos atendimentos.
                    </p>

                </div>

                <button
                    class="btn btn-primary"
                    onclick="openAppointmentModal()"
                >
                    Agendar consulta
                </button>

            </div>

            ${
                list.length
                    ? `
                        <div class="table-responsive">

                            <table class="table">

                                <thead>

                                    <tr>

                                        <th>
                                            Data
                                        </th>

                                        <th>
                                            Horário
                                        </th>

                                        <th>
                                            Atendimento
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Observação
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    ${[...list]
                                        .sort(
                                            (
                                                a,
                                                b
                                            ) =>
                                                (
                                                    b.date +
                                                    b.time
                                                ).localeCompare(
                                                    a.date +
                                                    a.time
                                                )
                                        )
                                        .map(
                                            appointment => `
                                                <tr>

                                                    <td>
                                                        ${formatDate(
                                                            appointment.date
                                                        )}
                                                    </td>

                                                    <td>
                                                        ${appointment.time}
                                                    </td>

                                                    <td>
                                                        ${appointment.type}
                                                    </td>

                                                    <td>
                                                        ${statusBadge(
                                                            appointment.status
                                                        )}
                                                    </td>

                                                    <td>
                                                        ${
                                                            appointment.note ||
                                                            '—'
                                                        }
                                                    </td>

                                                </tr>
                                            `
                                        )
                                        .join('')}

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

    const patient =
        state.patients.find(
            item =>
                item.id ===
                state.currentPatientId
        ) ||
        state.patients[0];

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
                    assessment.patientId ===
                    patient.id
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.date.localeCompare(
                        a.date
                    )
            );

    return `
        <div class="mb-3">

            <p class="text-muted">
                Aqui aparecem suas avaliações e observações liberadas pela clínica.
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

    const patient =
        state.patients.find(
            item =>
                item.id ===
                state.currentPatientId
        ) ||
        state.patients[0];

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
                payment.patientId ===
                patient.id
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

                            <th>
                                Data
                            </th>

                            <th>
                                Descrição
                            </th>

                            <th>
                                Valor
                            </th>

                            <th>
                                Método
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            list.length
                                ? list
                                    .map(
                                        payment => `
                                            <tr>

                                                <td>
                                                    ${formatDate(
                                                        payment.date
                                                    )}
                                                </td>

                                                <td>
                                                    ${payment.description}
                                                </td>

                                                <td>
                                                    ${money(
                                                        payment.value
                                                    )}
                                                </td>

                                                <td>
                                                    ${payment.method}
                                                </td>

                                                <td>
                                                    ${statusBadge(
                                                        payment.status
                                                    )}
                                                </td>

                                            </tr>
                                        `
                                    )
                                    .join('')
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
        document.getElementById(
            id
        );

    if (!element) {
        return;
    }

    element.innerHTML =
        state.patients
            .map(
                patient =>
                    `
                        <option
                            value="${patient.id}"
                        >
                            ${patient.name}
                        </option>
                    `
            )
            .join('');
}

function openAppointmentModal() {

    fillPatientSelect(
        'appointmentPatient'
    );

    const patientSelect =
        document.getElementById(
            'appointmentPatient'
        );

    if (patientSelect) {

        if (
            state.role === 'user' &&
            state.currentPatientId
        ) {

            patientSelect.value =
                String(
                    state.currentPatientId
                );

            patientSelect.disabled =
                true;

        } else {

            patientSelect.disabled =
                false;
        }
    }

    const date =
        document.getElementById(
            'appointmentDate'
        );

    if (date) {
        date.value =
            today();
    }

    const modalElement =
        document.getElementById(
            'appointmentModal'
        );

    if (!modalElement) {
        return;
    }

    const modal =
        new bootstrap.Modal(
            modalElement
        );

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

    const patientId =
        state.role === 'user' &&
        state.currentPatientId
            ? state.currentPatientId
            : Number(
                patient.value
            );

    state.appointments.push({
        id: Date.now(),
        patientId,
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

    if (patient) {
        patient.disabled =
            false;
    }

    renderPage();

    toast(
        'Consulta agendada com sucesso.',
        'success'
    );
}

function setAssessmentPhotoPreview(targetId, source, label) {
    const box = document.getElementById(targetId);
    if (!box) {
        return;
    }

    box.innerHTML = source
        ? `<img src="${source}" alt="Foto ${label}">`
        : '<i class="bi bi-image"></i><span>Pré-visualização</span>';
}

function resetAssessmentForm() {
    const form = document.getElementById('assessmentForm');
    if (form) {
        form.reset();
    }

    setAssessmentPhotoPreview('beforePreview', '', 'do antes');
    setAssessmentPhotoPreview('afterPreview', '', 'do depois');
    editingAssessmentId = null;

    const date = document.getElementById('assessmentDate');
    if (date) {
        date.value = today();
    }

    const title = document.getElementById('assessmentModalTitle');
    const saveButton = document.getElementById('assessmentSaveButton');
    if (title) {
        title.innerHTML = '<i class="bi bi-clipboard2-pulse me-2"></i> Registrar avaliação física';
    }
    if (saveButton) {
        saveButton.textContent = 'Salvar avaliação';
    }
}

function openAssessmentModal(assessmentId = null) {
    if (state.role !== 'admin') {
        return;
    }

    if (!state.patients.length) {
        toast('Cadastre um paciente antes de registrar uma avaliação.', 'warning');
        return;
    }

    const form = document.getElementById('assessmentForm');
    const modalElement = document.getElementById('assessmentModal');
    if (!form || !modalElement) {
        return;
    }

    resetAssessmentForm();
    fillPatientSelect('assessmentPatient');
    editingAssessmentId = assessmentId === null ? null : Number(assessmentId);

    const assessment = editingAssessmentId === null
        ? null
        : state.assessments.find(item => item.id === editingAssessmentId);

    if (editingAssessmentId !== null && !assessment) {
        editingAssessmentId = null;
        toast('Avaliação não encontrada.', 'danger');
        return;
    }

    if (assessment) {
        document.getElementById('assessmentPatient').value = String(assessment.patientId);
        document.getElementById('assessmentDate').value = assessment.date || today();
        document.getElementById('weight').value = assessment.weight || '';
        document.getElementById('height').value = assessment.height || '';
        document.getElementById('pain').value = assessment.pain || '';
        document.getElementById('mobility').value = assessment.mobility || '';
        document.getElementById('bodyFat').value = assessment.bodyFat || '';
        document.getElementById('muscleMass').value = assessment.muscleMass || '';
        document.getElementById('bodyWater').value = assessment.bodyWater || '';
        document.getElementById('visceralFat').value = assessment.visceralFat || '';
        document.getElementById('basalMetabolism').value = assessment.basalMetabolism || '';
        document.getElementById('assessmentNote').value = assessment.note || '';
        setAssessmentPhotoPreview('beforePreview', assessment.before || '', 'do antes');
        setAssessmentPhotoPreview('afterPreview', assessment.after || '', 'do depois');

        document.getElementById('assessmentModalTitle').innerHTML = '<i class="bi bi-clipboard2-pulse me-2"></i> Editar avaliação física';
        document.getElementById('assessmentSaveButton').textContent = 'Salvar alterações';
    }

    bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

async function saveAssessment() {
    if (state.role !== 'admin') {
        return;
    }

    const form = document.getElementById('assessmentForm');
    if (!form) {
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patient = document.getElementById('assessmentPatient');
    const date = document.getElementById('assessmentDate');
    const beforePhoto = document.getElementById('beforePhoto');
    const afterPhoto = document.getElementById('afterPhoto');
    const existing = editingAssessmentId === null
        ? null
        : state.assessments.find(item => item.id === editingAssessmentId);

    if (editingAssessmentId !== null && !existing) {
        toast('Avaliação não encontrada.', 'danger');
        return;
    }

    const readImage = input => new Promise((resolve, reject) => {
        if (!input || !input.files || !input.files[0]) {
            resolve('');
            return;
        }

        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = () => reject(new Error('Não foi possível ler uma das imagens.'));
        reader.readAsDataURL(input.files[0]);
    });

    try {
        const [newBefore, newAfter] = await Promise.all([
            readImage(beforePhoto),
            readImage(afterPhoto)
        ]);

        const data = {
            ...(existing || {}),
            id: existing ? existing.id : Date.now(),
            patientId: Number(patient.value),
            date: date.value || today(),
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            pain: document.getElementById('pain').value,
            mobility: document.getElementById('mobility').value,
            bodyFat: document.getElementById('bodyFat')?.value || '',
            muscleMass: document.getElementById('muscleMass')?.value || '',
            bodyWater: document.getElementById('bodyWater')?.value || '',
            visceralFat: document.getElementById('visceralFat')?.value || '',
            basalMetabolism: document.getElementById('basalMetabolism')?.value || '',
            note: document.getElementById('assessmentNote').value,
            before: newBefore || (existing && existing.before) || '',
            after: newAfter || (existing && existing.after) || ''
        };

        if (existing) {
            const index = state.assessments.findIndex(item => item.id === existing.id);
            state.assessments[index] = data;
        } else {
            state.assessments.push(data);
        }

        const wasEditing = Boolean(existing);
        saveData();
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById('assessmentModal')
        ).hide();
        resetAssessmentForm();
        renderPage();
        toast(
            wasEditing ? 'Avaliação atualizada com sucesso.' : 'Avaliação registrada e disponível na área do paciente.',
            'success'
        );
    } catch (error) {
        toast(error.message || 'Não foi possível salvar a avaliação.', 'danger');
    }
}

function previewImage(
    input,
    target
) {

    const box =
        document.getElementById(
            target
        );

    if (
        !box ||
        !input.files[0]
    ) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        event => {

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

function addPayment() {

    if (!state.patients.length) {
        return;
    }

    const patientId =
        Number(
            prompt(
                'ID do paciente:'
            )
        );

    const patient =
        state.patients.find(
            item =>
                item.id ===
                patientId
        );

    if (!patient) {
        toast(
            'Paciente não encontrado.',
            'danger'
        );
        return;
    }

    const description =
        prompt(
            'Descrição:'
        ) ||
        'Pagamento';

    const value =
        Number(
            prompt(
                'Valor:'
            )
        );

    if (
        !value ||
        value <= 0
    ) {
        return;
    }

    const method =
        prompt(
            'Método de pagamento:'
        ) ||
        'Pix';

    state.payments.push({
        id: Date.now(),
        patientId,
        description,
        date: today(),
        value,
        status: 'Pendente',
        method
    });

    saveData();
    renderPage();

    toast(
        'Pagamento registrado.',
        'success'
    );
}

function togglePayment(id) {

    const payment =
        state.payments.find(
            item =>
                item.id === id
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
        'Status do pagamento atualizado.',
        'success'
    );
}

function toast(
    message,
    type = 'success'
) {

    const toastArea =
        document.getElementById(
            'toastArea'
        );

    if (!toastArea) {
        return;
    }

    const element =
        document.createElement(
            'div'
        );

    element.className =
        `toast align-items-center text-bg-${type} border-0`;

    element.innerHTML = `
        <div class="d-flex">

            <div class="toast-body">
                ${message}
            </div>

            <button
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
            ></button>

        </div>
    `;

    toastArea.appendChild(
        element
    );

    const toastInstance =
        new bootstrap.Toast(
            element,
            {
                delay:2800
            }
        );

    toastInstance.show();

    element.addEventListener(
        'hidden.bs.toast',
        () =>
            element.remove()
    );
}

window.login =
    login;

window.logout =
    logout;

window.toggleSidebar =
    toggleSidebar;

window.toggleTheme =
    toggleTheme;

window.openRegisterModal =
    openRegisterModal;

window.registerPatient =
    registerPatient;

window.openAppointmentModal =
    openAppointmentModal;

window.saveAppointment =
    saveAppointment;

window.filterAgenda =
    filterAgenda;

window.changeAppointmentStatus =
    changeAppointmentStatus;

window.addPatient =
    addPatient;

window.openPatientModal =
    openPatientModal;

window.editPatient =
    editPatient;

window.savePatient =
    savePatient;

window.deletePatient =
    deletePatient;

window.openAssessmentModal =
    openAssessmentModal;

window.saveAssessment =
    saveAssessment;
/////
window.previewImage =
    previewImage;

window.addPayment =
    addPayment;

window.togglePayment =
    togglePayment;

loadData();

if (
    localStorage.getItem(
        'jf_dark'
    ) === 'true'
) {
    document.body.classList.add(
        'dark-mode'
    );
}
