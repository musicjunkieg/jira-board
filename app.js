/**
 * Jira Kanban Board Mockup Tool
 * A responsive tool to mock up Jira Data Center Kanban Board layouts
 */

// State Management
const state = {
    boardName: 'My Kanban Board',
    projectKey: 'PROJ',
    issueCounter: 1,
    columns: [],
    issues: [],
    swimlanesEnabled: false,
    swimlaneType: 'component',
    displayOptions: {
        showAvatars: true,
        showPriority: true,
        showLabels: true,
        showEstimates: true,
        showDueDate: false
    },
    theme: 'light',
    activeFilter: 'all',
    searchQuery: '',
    // Backlog state
    currentView: 'board',
    selectedIssues: [],
    backlogFilters: {
        component: '',
        type: '',
        assignee: '',
        search: ''
    },
    detailPanelIssueId: null
};

// Default columns
const defaultColumns = [
    { id: 'col-1', name: 'To Do', wip: 0, color: '#0052CC' },
    { id: 'col-2', name: 'In Progress', wip: 5, color: '#FF991F' },
    { id: 'col-3', name: 'In Review', wip: 3, color: '#6554C0' },
    { id: 'col-4', name: 'Done', wip: 0, color: '#36B37E' }
];

// Available components
const components = ['Internal', 'Client', 'Service'];

// Sample issues for demo (rank field for backlog ordering, columnId: 'backlog' for backlog items)
const sampleIssues = [
    // Board issues
    { id: 'issue-1', key: 'PROJ-1', type: 'story', priority: 'high', summary: 'Implement user authentication flow', description: 'Add login, logout, and session management', assignee: 'john', estimate: 8, labels: ['auth', 'security'], epic: '', dueDate: '', columnId: 'col-1', component: 'Internal', rank: 1 },
    { id: 'issue-2', key: 'PROJ-2', type: 'bug', priority: 'highest', summary: 'Fix memory leak in data processing module', description: '', assignee: 'jane', estimate: 5, labels: ['bug', 'performance'], epic: '', dueDate: '2026-01-15', columnId: 'col-2', component: 'Service', rank: 2 },
    { id: 'issue-3', key: 'PROJ-3', type: 'task', priority: 'medium', summary: 'Update documentation for API endpoints', description: '', assignee: 'bob', estimate: 3, labels: ['docs'], epic: '', dueDate: '', columnId: 'col-2', component: 'Client', rank: 3 },
    { id: 'issue-4', key: 'PROJ-4', type: 'epic', priority: 'high', summary: 'User Management System', description: 'Complete user management features', assignee: 'alice', estimate: 21, labels: [], epic: '', dueDate: '', columnId: 'col-1', component: 'Internal', rank: 4 },
    { id: 'issue-5', key: 'PROJ-5', type: 'story', priority: 'low', summary: 'Add dark mode support', description: '', assignee: '', estimate: 5, labels: ['ui', 'enhancement'], epic: '', dueDate: '', columnId: 'col-3', component: 'Client', rank: 5 },
    { id: 'issue-6', key: 'PROJ-6', type: 'subtask', priority: 'medium', summary: 'Write unit tests for auth module', description: '', assignee: 'john', estimate: 3, labels: ['testing'], epic: '', dueDate: '', columnId: 'col-2', component: 'Internal', rank: 6 },
    { id: 'issue-7', key: 'PROJ-7', type: 'story', priority: 'medium', summary: 'Implement password reset functionality', description: '', assignee: 'jane', estimate: 5, labels: ['auth'], epic: '', dueDate: '', columnId: 'col-4', component: 'Service', rank: 7 },
    { id: 'issue-8', key: 'PROJ-8', type: 'bug', priority: 'high', summary: 'Fix responsive layout issues on mobile', description: '', assignee: '', estimate: 2, labels: ['ui', 'mobile'], epic: '', dueDate: '', columnId: 'col-1', component: 'Client', rank: 8 },
    // Backlog issues
    { id: 'issue-9', key: 'PROJ-9', type: 'story', priority: 'medium', summary: 'Implement user profile page', description: 'Create a user profile page where users can view and edit their information', assignee: '', estimate: 5, labels: ['ui', 'user'], epic: '', dueDate: '', columnId: 'backlog', component: 'Client', rank: 1 },
    { id: 'issue-10', key: 'PROJ-10', type: 'bug', priority: 'low', summary: 'Fix date picker alignment on Safari', description: '', assignee: 'bob', estimate: 2, labels: ['ui', 'browser'], epic: '', dueDate: '', columnId: 'backlog', component: 'Client', rank: 2 },
    { id: 'issue-11', key: 'PROJ-11', type: 'task', priority: 'high', summary: 'Set up CI/CD pipeline', description: 'Configure automated testing and deployment', assignee: 'alice', estimate: 8, labels: ['devops'], epic: '', dueDate: '', columnId: 'backlog', component: 'Internal', rank: 3 },
    { id: 'issue-12', key: 'PROJ-12', type: 'story', priority: 'medium', summary: 'Add email notification system', description: 'Implement transactional emails for user actions', assignee: '', estimate: 13, labels: ['notifications'], epic: '', dueDate: '', columnId: 'backlog', component: 'Service', rank: 4 },
    { id: 'issue-13', key: 'PROJ-13', type: 'task', priority: 'low', summary: 'Optimize database queries', description: 'Review and optimize slow database queries', assignee: 'jane', estimate: 5, labels: ['performance', 'database'], epic: '', dueDate: '', columnId: 'backlog', component: 'Service', rank: 5 },
    { id: 'issue-14', key: 'PROJ-14', type: 'story', priority: 'highest', summary: 'Implement two-factor authentication', description: 'Add 2FA support using TOTP', assignee: 'john', estimate: 8, labels: ['auth', 'security'], epic: '', dueDate: '', columnId: 'backlog', component: 'Internal', rank: 6 },
    { id: 'issue-15', key: 'PROJ-15', type: 'bug', priority: 'medium', summary: 'Session timeout not working correctly', description: '', assignee: '', estimate: 3, labels: ['auth'], epic: '', dueDate: '', columnId: 'backlog', component: 'Internal', rank: 7 },
    { id: 'issue-16', key: 'PROJ-16', type: 'story', priority: 'low', summary: 'Add export to CSV functionality', description: 'Allow users to export their data as CSV files', assignee: '', estimate: 3, labels: ['feature'], epic: '', dueDate: '', columnId: 'backlog', component: 'Client', rank: 8 }
];

// DOM Elements
const elements = {
    board: document.getElementById('board'),
    boardName: document.getElementById('boardName'),
    settingsPanel: document.getElementById('settingsPanel'),
    settingsBtn: document.getElementById('settingsBtn'),
    closeSettings: document.getElementById('closeSettings'),
    issueModal: document.getElementById('issueModal'),
    columnModal: document.getElementById('columnModal'),
    overlay: document.getElementById('overlay'),
    toastContainer: document.getElementById('toastContainer'),
    searchInput: document.getElementById('searchInput'),
    swimlaneToggle: document.getElementById('swimlaneToggle'),
    swimlaneType: document.getElementById('swimlaneType'),
    addIssueBtn: document.getElementById('addIssueBtn'),
    addColumnBtn: document.getElementById('addColumnBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    importFile: document.getElementById('importFile'),
    menuToggle: document.getElementById('menuToggle'),
    // Backlog elements
    boardContainer: document.getElementById('boardContainer'),
    backlogContainer: document.getElementById('backlogContainer'),
    backlogList: document.getElementById('backlogList'),
    backlogEmpty: document.getElementById('backlogEmpty'),
    issueDetailPanel: document.getElementById('issueDetailPanel'),
    bulkActions: document.getElementById('bulkActions'),
    backlogFilters: document.getElementById('backlogFilters'),
    selectedCount: document.getElementById('selectedCount'),
    selectAllBacklog: document.getElementById('selectAllBacklog')
};

// Icon Templates
const icons = {
    story: `<svg viewBox="0 0 16 16" fill="#36B37E"><path d="M2 2h12v12H2z"/></svg>`,
    bug: `<svg viewBox="0 0 16 16" fill="#FF5630"><circle cx="8" cy="8" r="6"/></svg>`,
    task: `<svg viewBox="0 0 16 16" fill="#4C9AFF"><path d="M3 3h10v10H3z"/><path fill="#fff" d="M6 7l2 2 4-4-1-1-3 3-1-1z"/></svg>`,
    epic: `<svg viewBox="0 0 16 16" fill="#6554C0"><path d="M5 2l6 6-6 6z"/></svg>`,
    subtask: `<svg viewBox="0 0 16 16" fill="#00B8D9"><path d="M4 4h8v8H4z"/></svg>`,
    highest: `<svg viewBox="0 0 16 16" fill="#FF5630"><path d="M8 3l5 5H3z"/><path d="M8 8l5 5H3z"/></svg>`,
    high: `<svg viewBox="0 0 16 16" fill="#FF7452"><path d="M8 4l5 5H3z"/></svg>`,
    medium: `<svg viewBox="0 0 16 16" fill="#FFAB00"><path d="M3 7h10v2H3z"/></svg>`,
    low: `<svg viewBox="0 0 16 16" fill="#2684FF"><path d="M8 12l-5-5h10z"/></svg>`,
    lowest: `<svg viewBox="0 0 16 16" fill="#4C9AFF"><path d="M8 8l-5-5h10z"/><path d="M8 13l-5-5h10z"/></svg>`,
    drag: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    delete: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    calendar: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14 2h-1V1h-2v1H5V1H3v1H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h12v9z"/></svg>`
};

// Initialize Application
function init() {
    loadState();
    renderBoard();
    renderBacklog();
    setupEventListeners();
    setupBacklogEventListeners();
    updateColumnSelect();
    updateEpicSelect();
    applyTheme();
    switchView(state.currentView);
}

// Load State from LocalStorage
function loadState() {
    const saved = localStorage.getItem('jiraKanbanMockup');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
        elements.boardName.textContent = state.boardName;
    } else {
        state.columns = [...defaultColumns];
        state.issues = [...sampleIssues];
        state.issueCounter = 17; // Updated for 16 sample issues
    }
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem('jiraKanbanMockup', JSON.stringify(state));
}

// Render Board
function renderBoard() {
    elements.board.innerHTML = '';

    if (state.swimlanesEnabled) {
        renderBoardWithSwimlanes();
    } else {
        renderBoardWithoutSwimlanes();
        // Add column placeholder (only in non-swimlane view)
        const placeholder = document.createElement('div');
        placeholder.className = 'add-column-placeholder';
        placeholder.innerHTML = '<span>+ Add Column</span>';
        placeholder.addEventListener('click', () => openColumnModal());
        elements.board.appendChild(placeholder);
    }

    setupDragAndDrop();
    updateWipIndicators();
}

// Render Board without Swimlanes
function renderBoardWithoutSwimlanes() {
    state.columns.forEach(column => {
        const columnEl = createColumnElement(column);
        const columnBody = columnEl.querySelector('.column-body');

        const columnIssues = getFilteredIssues().filter(issue => issue.columnId === column.id);
        columnIssues.forEach(issue => {
            columnBody.appendChild(createIssueCard(issue));
        });

        if (columnIssues.length === 0) {
            columnBody.innerHTML = `
                <div class="column-empty">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                    </svg>
                    <p>Drop issues here</p>
                </div>
            `;
        }

        elements.board.appendChild(columnEl);
    });
}

// Render Board with Swimlanes (Grid Layout: columns on top, swimlanes on left)
function renderBoardWithSwimlanes() {
    const swimlanes = getSwimlaneGroups();

    // Create swimlane grid container
    const swimlaneGrid = document.createElement('div');
    swimlaneGrid.className = 'swimlane-grid';
    swimlaneGrid.style.gridTemplateColumns = `200px repeat(${state.columns.length}, 1fr)`;

    // Create column headers row
    const headerRow = document.createElement('div');
    headerRow.className = 'swimlane-grid-header-row';

    // Empty cell for swimlane label column
    const cornerCell = document.createElement('div');
    cornerCell.className = 'swimlane-grid-corner';
    headerRow.appendChild(cornerCell);

    // Column headers
    state.columns.forEach(column => {
        const headerCell = document.createElement('div');
        headerCell.className = 'swimlane-grid-column-header';

        const issueCount = state.issues.filter(i => i.columnId === column.id && i.columnId !== 'backlog').length;
        const wipText = column.wip > 0 ? `/ ${column.wip}` : '';
        const wipClass = column.wip > 0 && issueCount > column.wip ? 'over-limit' : '';

        headerCell.innerHTML = `
            <div class="column-color" style="background-color: ${column.color}"></div>
            <span class="column-title">${column.name}</span>
            <span class="column-count">${issueCount}</span>
            ${column.wip > 0 ? `<span class="column-wip ${wipClass}">${wipText}</span>` : ''}
            <button class="column-action-btn edit-column" title="Edit Column">
                ${icons.edit}
            </button>
        `;

        headerCell.querySelector('.edit-column').addEventListener('click', (e) => {
            e.stopPropagation();
            openColumnModal(column);
        });

        headerRow.appendChild(headerCell);
    });

    swimlaneGrid.appendChild(headerRow);

    // Create swimlane rows
    swimlanes.forEach((swimlane) => {
        const swimlaneRow = document.createElement('div');
        swimlaneRow.className = 'swimlane-grid-row';
        swimlaneRow.dataset.swimlane = swimlane.id;

        const issueCount = getFilteredIssues().filter(i => getSwimlaneValue(i) === swimlane.id).length;

        // Swimlane label cell (row header)
        const labelCell = document.createElement('div');
        labelCell.className = 'swimlane-grid-label';
        labelCell.innerHTML = `
            <div class="swimlane-label-content" data-swimlane="${swimlane.id}">
                <svg class="swimlane-toggle" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5H7z"/>
                </svg>
                <span class="swimlane-title">${swimlane.name}</span>
                <span class="swimlane-count">(${issueCount})</span>
            </div>
        `;
        swimlaneRow.appendChild(labelCell);

        // Create cells for each column in this swimlane row
        state.columns.forEach(column => {
            const cell = document.createElement('div');
            cell.className = 'swimlane-grid-cell';
            cell.dataset.columnId = column.id;
            cell.dataset.swimlane = swimlane.id;

            const cellBody = document.createElement('div');
            cellBody.className = 'column-body';
            cellBody.dataset.columnId = column.id;
            cellBody.dataset.swimlane = swimlane.id;

            const columnIssues = getFilteredIssues().filter(
                issue => issue.columnId === column.id && getSwimlaneValue(issue) === swimlane.id
            );

            columnIssues.forEach(issue => {
                cellBody.appendChild(createIssueCard(issue));
            });

            cell.appendChild(cellBody);
            swimlaneRow.appendChild(cell);
        });

        swimlaneGrid.appendChild(swimlaneRow);
    });

    elements.board.appendChild(swimlaneGrid);

    // Setup swimlane collapse
    document.querySelectorAll('.swimlane-label-content').forEach(label => {
        label.addEventListener('click', () => {
            const swimlaneId = label.dataset.swimlane;
            const row = label.closest('.swimlane-grid-row');
            label.classList.toggle('collapsed');
            row.classList.toggle('collapsed');
        });
    });
}

// Get Swimlane Groups
function getSwimlaneGroups() {
    const groups = [];

    switch (state.swimlaneType) {
        case 'component':
            // Add each component as a swimlane
            components.forEach(c => {
                groups.push({
                    id: c,
                    name: c
                });
            });
            // Add "No Component" for issues without a component
            groups.push({
                id: 'no-component',
                name: 'No Component'
            });
            break;
        case 'assignee':
            const assignees = ['', 'john', 'jane', 'bob', 'alice'];
            assignees.forEach(a => {
                groups.push({
                    id: a || 'unassigned',
                    name: a ? getAssigneeName(a) : 'Unassigned'
                });
            });
            break;
        case 'priority':
            ['highest', 'high', 'medium', 'low', 'lowest'].forEach(p => {
                groups.push({
                    id: p,
                    name: p.charAt(0).toUpperCase() + p.slice(1)
                });
            });
            break;
        case 'epic':
            const epics = new Set(['']);
            state.issues.filter(i => i.type === 'epic').forEach(e => epics.add(e.key));
            epics.forEach(e => {
                groups.push({
                    id: e || 'no-epic',
                    name: e || 'No Epic'
                });
            });
            break;
        default:
            groups.push({ id: 'all', name: 'All Issues' });
    }

    return groups;
}

// Get Swimlane Value for Issue
function getSwimlaneValue(issue) {
    switch (state.swimlaneType) {
        case 'component':
            return issue.component || 'no-component';
        case 'assignee':
            return issue.assignee || 'unassigned';
        case 'priority':
            return issue.priority;
        case 'epic':
            return issue.epic || 'no-epic';
        default:
            return 'all';
    }
}

// Create Column Element
function createColumnElement(column, inSwimlane = false) {
    const columnEl = document.createElement('div');
    columnEl.className = 'column';
    columnEl.dataset.columnId = column.id;

    const issueCount = state.issues.filter(i => i.columnId === column.id).length;
    const wipText = column.wip > 0 ? `/ ${column.wip}` : '';
    const wipClass = column.wip > 0 && issueCount > column.wip ? 'over-limit' : '';

    columnEl.innerHTML = `
        <div class="column-header" draggable="${!inSwimlane}">
            <div class="column-title-wrap">
                <div class="column-color" style="background-color: ${column.color}"></div>
                <span class="column-title">${column.name}</span>
                <span class="column-count">${issueCount}</span>
                ${column.wip > 0 ? `<span class="column-wip ${wipClass}">${wipText}</span>` : ''}
            </div>
            <div class="column-actions">
                <button class="column-action-btn edit-column" title="Edit Column">
                    ${icons.edit}
                </button>
            </div>
        </div>
        <div class="column-body" data-column-id="${column.id}"></div>
    `;

    // Edit column button
    columnEl.querySelector('.edit-column').addEventListener('click', (e) => {
        e.stopPropagation();
        openColumnModal(column);
    });

    return columnEl;
}

// Create Issue Card
function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.dataset.issueId = issue.id;
    card.dataset.type = issue.type;
    card.draggable = true;

    // Check if filtered
    if (!matchesFilter(issue) || !matchesSearch(issue)) {
        card.classList.add('hidden');
    }

    let labelsHtml = '';
    if (state.displayOptions.showLabels && issue.labels.length > 0) {
        labelsHtml = `
            <div class="issue-labels">
                ${issue.labels.map(l => `<span class="issue-label">${l}</span>`).join('')}
            </div>
        `;
    }

    let dueDateHtml = '';
    if (state.displayOptions.showDueDate && issue.dueDate) {
        const isOverdue = new Date(issue.dueDate) < new Date();
        dueDateHtml = `
            <span class="issue-due-date ${isOverdue ? 'overdue' : ''}">
                ${icons.calendar}
                ${formatDate(issue.dueDate)}
            </span>
        `;
    }

    let estimateHtml = '';
    if (state.displayOptions.showEstimates && issue.estimate) {
        estimateHtml = `<span class="issue-estimate">${issue.estimate}</span>`;
    }

    let epicHtml = '';
    if (issue.epic) {
        const epicIssue = state.issues.find(i => i.key === issue.epic);
        if (epicIssue) {
            epicHtml = `<span class="issue-epic-tag" title="${epicIssue.summary}">${issue.epic}</span>`;
        }
    }

    let componentHtml = '';
    if (issue.component) {
        componentHtml = `<span class="issue-component-tag" data-component="${issue.component.toLowerCase()}">${issue.component}</span>`;
    }

    let assigneeHtml = '';
    if (state.displayOptions.showAvatars && issue.assignee) {
        assigneeHtml = `
            <div class="issue-assignee ${issue.assignee}" title="${getAssigneeName(issue.assignee)}">
                ${issue.assignee.charAt(0).toUpperCase()}
            </div>
        `;
    }

    card.innerHTML = `
        <div class="issue-header">
            <div class="issue-type-priority">
                <span class="issue-type-icon" title="${issue.type}">${icons[issue.type]}</span>
                ${state.displayOptions.showPriority ? `<span class="issue-priority-icon" title="${issue.priority}">${icons[issue.priority]}</span>` : ''}
            </div>
            <span class="issue-key">${issue.key}</span>
        </div>
        <div class="issue-summary">${escapeHtml(issue.summary)}</div>
        ${labelsHtml}
        <div class="issue-footer">
            <div class="issue-meta">
                ${componentHtml}
                ${estimateHtml}
                ${epicHtml}
                ${dueDateHtml}
            </div>
            ${assigneeHtml}
        </div>
    `;

    // Double click to edit
    card.addEventListener('dblclick', () => openIssueModal(issue));

    return card;
}

// Get Filtered Issues
function getFilteredIssues() {
    return state.issues.filter(issue => matchesFilter(issue) && matchesSearch(issue));
}

// Match Filter
function matchesFilter(issue) {
    switch (state.activeFilter) {
        case 'my':
            return issue.assignee === 'john'; // Simulated current user
        case 'recent':
            return true; // Would normally filter by update date
        default:
            return true;
    }
}

// Match Search
function matchesSearch(issue) {
    if (!state.searchQuery) return true;
    const query = state.searchQuery.toLowerCase();
    return (
        issue.key.toLowerCase().includes(query) ||
        issue.summary.toLowerCase().includes(query) ||
        issue.labels.some(l => l.toLowerCase().includes(query)) ||
        (issue.component && issue.component.toLowerCase().includes(query))
    );
}

// Setup Drag and Drop
function setupDragAndDrop() {
    let draggedElement = null;
    let draggedIssueId = null;

    // Issue drag
    document.querySelectorAll('.issue-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedElement = card;
            draggedIssueId = card.dataset.issueId;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedIssueId);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            draggedElement = null;
            draggedIssueId = null;
            document.querySelectorAll('.column-body').forEach(col => {
                col.classList.remove('drag-over');
            });
        });
    });

    // Column drop zones
    document.querySelectorAll('.column-body').forEach(columnBody => {
        columnBody.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            columnBody.classList.add('drag-over');

            // Find position to insert
            const afterElement = getDragAfterElement(columnBody, e.clientY);
            const draggingCard = document.querySelector('.dragging');

            if (draggingCard && afterElement) {
                columnBody.insertBefore(draggingCard, afterElement);
            } else if (draggingCard) {
                columnBody.appendChild(draggingCard);
            }
        });

        columnBody.addEventListener('dragleave', (e) => {
            if (!columnBody.contains(e.relatedTarget)) {
                columnBody.classList.remove('drag-over');
            }
        });

        columnBody.addEventListener('drop', (e) => {
            e.preventDefault();
            columnBody.classList.remove('drag-over');

            const issueId = e.dataTransfer.getData('text/plain');
            const newColumnId = columnBody.dataset.columnId;

            // Update issue's column
            const issue = state.issues.find(i => i.id === issueId);
            if (issue) {
                issue.columnId = newColumnId;
                saveState();
                updateWipIndicators();
                showToast(`Moved ${issue.key} to ${getColumnName(newColumnId)}`);
            }
        });
    });

    // Column reordering
    document.querySelectorAll('.column-header[draggable="true"]').forEach(header => {
        header.addEventListener('dragstart', (e) => {
            const column = header.closest('.column');
            draggedElement = column;
            column.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', column.dataset.columnId);
        });

        header.addEventListener('dragend', () => {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        });
    });

    elements.board.addEventListener('dragover', (e) => {
        if (draggedElement && draggedElement.classList.contains('column')) {
            e.preventDefault();
            const afterElement = getColumnAfterElement(e.clientX);
            if (afterElement) {
                elements.board.insertBefore(draggedElement, afterElement);
            } else {
                const placeholder = document.querySelector('.add-column-placeholder');
                elements.board.insertBefore(draggedElement, placeholder);
            }
        }
    });

    elements.board.addEventListener('drop', (e) => {
        if (draggedElement && draggedElement.classList.contains('column')) {
            e.preventDefault();
            // Update column order in state
            const newOrder = [];
            document.querySelectorAll('.column').forEach(col => {
                const colData = state.columns.find(c => c.id === col.dataset.columnId);
                if (colData) newOrder.push(colData);
            });
            state.columns = newOrder;
            saveState();
        }
    });
}

// Get element after drag position (for cards)
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.issue-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Get column after drag position
function getColumnAfterElement(x) {
    const columns = [...document.querySelectorAll('.column:not(.dragging)')];

    return columns.reduce((closest, column) => {
        const box = column.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset, element: column };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update WIP Indicators
function updateWipIndicators() {
    document.querySelectorAll('.column').forEach(columnEl => {
        const columnId = columnEl.dataset.columnId;
        const column = state.columns.find(c => c.id === columnId);
        if (!column) return;

        const count = state.issues.filter(i => i.columnId === columnId).length;
        const countEl = columnEl.querySelector('.column-count');
        const wipEl = columnEl.querySelector('.column-wip');

        if (countEl) countEl.textContent = count;

        if (wipEl && column.wip > 0) {
            if (count > column.wip) {
                wipEl.classList.add('over-limit');
                columnEl.querySelector('.column-header').style.borderBottomColor = '#FF5630';
            } else {
                wipEl.classList.remove('over-limit');
                columnEl.querySelector('.column-header').style.borderBottomColor = column.color;
            }
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Board name editing
    elements.boardName.addEventListener('blur', () => {
        state.boardName = elements.boardName.textContent.trim() || 'My Kanban Board';
        elements.boardName.textContent = state.boardName;
        saveState();
    });

    elements.boardName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            elements.boardName.blur();
        }
    });

    // Settings panel
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettings.addEventListener('click', closeSettings);

    // Overlay click
    elements.overlay.addEventListener('click', () => {
        closeSettings();
        closeIssueModal();
        closeColumnModal();
    });

    // Quick filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeFilter = btn.dataset.filter;
            renderBoard();
        });
    });

    // Search
    elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterIssues();
    });

    // Swimlane toggle
    elements.swimlaneToggle.addEventListener('change', (e) => {
        state.swimlanesEnabled = e.target.checked;
        elements.swimlaneType.disabled = !e.target.checked;
        saveState();
        renderBoard();
    });

    elements.swimlaneType.addEventListener('change', (e) => {
        state.swimlaneType = e.target.value;
        saveState();
        renderBoard();
    });

    // Add issue button
    elements.addIssueBtn.addEventListener('click', () => openIssueModal());

    // Add column button
    elements.addColumnBtn.addEventListener('click', () => openColumnModal());

    // Issue modal
    document.getElementById('closeModal').addEventListener('click', closeIssueModal);
    document.getElementById('cancelIssue').addEventListener('click', closeIssueModal);
    document.getElementById('saveIssue').addEventListener('click', saveIssue);
    document.getElementById('deleteIssue').addEventListener('click', deleteIssue);

    // Column modal
    document.getElementById('closeColumnModal').addEventListener('click', closeColumnModal);
    document.getElementById('cancelColumn').addEventListener('click', closeColumnModal);
    document.getElementById('saveColumn').addEventListener('click', saveColumn);
    document.getElementById('deleteColumn').addEventListener('click', deleteColumn);

    // Export/Import
    elements.exportBtn.addEventListener('click', exportBoard);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', importBoard);

    // Theme
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.theme = e.target.value;
            applyTheme();
            saveState();
        });
    });

    // Display options
    ['showAvatars', 'showPriority', 'showLabels', 'showEstimates', 'showDueDate'].forEach(opt => {
        const el = document.getElementById(opt);
        if (el) {
            el.checked = state.displayOptions[opt];
            el.addEventListener('change', (e) => {
                state.displayOptions[opt] = e.target.checked;
                saveState();
                renderBoard();
            });
        }
    });

    // Project settings
    document.getElementById('projectKey').addEventListener('change', (e) => {
        state.projectKey = e.target.value.toUpperCase();
        saveState();
    });

    document.getElementById('issueCounter').addEventListener('change', (e) => {
        state.issueCounter = parseInt(e.target.value) || 1;
        saveState();
    });

    // Add column in settings
    document.getElementById('addColumnSettings').addEventListener('click', () => {
        openColumnModal();
    });

    // Menu toggle (mobile)
    elements.menuToggle.addEventListener('click', () => {
        openSettings();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSettings();
            closeIssueModal();
            closeColumnModal();
        }

        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            elements.searchInput.focus();
        }

        // Ctrl/Cmd + N for new issue
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openIssueModal();
        }
    });
}

// Filter Issues (for search)
function filterIssues() {
    document.querySelectorAll('.issue-card').forEach(card => {
        const issueId = card.dataset.issueId;
        const issue = state.issues.find(i => i.id === issueId);
        if (issue && matchesFilter(issue) && matchesSearch(issue)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Open Settings Panel
function openSettings() {
    elements.settingsPanel.classList.add('open');
    elements.overlay.classList.add('open');
    renderColumnSettings();

    // Update form values
    document.getElementById('projectKey').value = state.projectKey;
    document.getElementById('issueCounter').value = state.issueCounter;
    document.querySelector(`input[name="theme"][value="${state.theme}"]`).checked = true;
}

// Close Settings Panel
function closeSettings() {
    elements.settingsPanel.classList.remove('open');
    elements.overlay.classList.remove('open');
}

// Render Column Settings
function renderColumnSettings() {
    const container = document.getElementById('columnSettings');
    container.innerHTML = '';

    state.columns.forEach((column, index) => {
        const item = document.createElement('div');
        item.className = 'column-setting-item';
        item.innerHTML = `
            <span class="drag-handle">${icons.drag}</span>
            <input type="text" value="${escapeHtml(column.name)}" class="column-name-input" data-id="${column.id}">
            <input type="number" value="${column.wip}" min="0" class="wip-input" data-id="${column.id}" title="WIP Limit">
            <input type="color" value="${column.color}" class="column-color-input" data-id="${column.id}">
            <button class="delete-btn" data-id="${column.id}" ${state.columns.length <= 1 ? 'disabled' : ''}>
                ${icons.delete}
            </button>
        `;

        // Event listeners
        item.querySelector('.column-name-input').addEventListener('change', (e) => {
            const col = state.columns.find(c => c.id === e.target.dataset.id);
            if (col) {
                col.name = e.target.value;
                saveState();
                renderBoard();
            }
        });

        item.querySelector('.wip-input').addEventListener('change', (e) => {
            const col = state.columns.find(c => c.id === e.target.dataset.id);
            if (col) {
                col.wip = parseInt(e.target.value) || 0;
                saveState();
                renderBoard();
            }
        });

        item.querySelector('.column-color-input').addEventListener('change', (e) => {
            const col = state.columns.find(c => c.id === e.target.dataset.id);
            if (col) {
                col.color = e.target.value;
                saveState();
                renderBoard();
            }
        });

        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            const colId = e.currentTarget.dataset.id;
            if (state.columns.length > 1) {
                state.columns = state.columns.filter(c => c.id !== colId);
                // Move issues to first column
                state.issues.forEach(issue => {
                    if (issue.columnId === colId) {
                        issue.columnId = state.columns[0].id;
                    }
                });
                saveState();
                renderBoard();
                renderColumnSettings();
            }
        });

        container.appendChild(item);
    });
}

// Open Issue Modal
let editingIssueId = null;

function openIssueModal(issue = null, defaultColumnId = null) {
    editingIssueId = issue ? issue.id : null;

    const modal = elements.issueModal;
    const title = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveIssue');
    const deleteBtn = document.getElementById('deleteIssue');

    if (issue) {
        title.textContent = `Edit ${issue.key}`;
        saveBtn.textContent = 'Update Issue';
        deleteBtn.style.display = 'block';

        document.getElementById('issueType').value = issue.type;
        document.getElementById('issuePriority').value = issue.priority;
        document.getElementById('issueSummary').value = issue.summary;
        document.getElementById('issueDescription').value = issue.description || '';
        document.getElementById('issueAssignee').value = issue.assignee || '';
        document.getElementById('issueEstimate').value = issue.estimate || '';
        document.getElementById('issueComponent').value = issue.component || '';
        document.getElementById('issueEpic').value = issue.epic || '';
        document.getElementById('issueDueDate').value = issue.dueDate || '';
        document.getElementById('issueLabels').value = issue.labels.join(', ');
        document.getElementById('issueColumn').value = issue.columnId;
    } else {
        title.textContent = 'Create Issue';
        saveBtn.textContent = 'Create Issue';
        deleteBtn.style.display = 'none';

        document.getElementById('issueType').value = 'story';
        document.getElementById('issuePriority').value = 'medium';
        document.getElementById('issueSummary').value = '';
        document.getElementById('issueDescription').value = '';
        document.getElementById('issueAssignee').value = '';
        document.getElementById('issueEstimate').value = '';
        document.getElementById('issueComponent').value = '';
        document.getElementById('issueEpic').value = '';
        document.getElementById('issueDueDate').value = '';
        document.getElementById('issueLabels').value = '';
        document.getElementById('issueColumn').value = defaultColumnId || state.columns[0]?.id || '';
    }

    updateEpicSelect();
    modal.classList.add('open');
    elements.overlay.classList.add('open');
    document.getElementById('issueSummary').focus();
}

// Close Issue Modal
function closeIssueModal() {
    elements.issueModal.classList.remove('open');
    elements.overlay.classList.remove('open');
    editingIssueId = null;
}

// Save Issue
function saveIssue() {
    const summary = document.getElementById('issueSummary').value.trim();
    if (!summary) {
        showToast('Please enter a summary', 'error');
        return;
    }

    const labelsStr = document.getElementById('issueLabels').value;
    const labels = labelsStr ? labelsStr.split(',').map(l => l.trim()).filter(l => l) : [];

    if (editingIssueId) {
        // Update existing issue
        const issue = state.issues.find(i => i.id === editingIssueId);
        if (issue) {
            issue.type = document.getElementById('issueType').value;
            issue.priority = document.getElementById('issuePriority').value;
            issue.summary = summary;
            issue.description = document.getElementById('issueDescription').value;
            issue.assignee = document.getElementById('issueAssignee').value;
            issue.estimate = document.getElementById('issueEstimate').value;
            issue.component = document.getElementById('issueComponent').value;
            issue.epic = document.getElementById('issueEpic').value;
            issue.dueDate = document.getElementById('issueDueDate').value;
            issue.labels = labels;
            issue.columnId = document.getElementById('issueColumn').value;

            showToast(`${issue.key} updated`);
        }
    } else {
        // Create new issue
        const newColumnId = document.getElementById('issueColumn').value;

        // Calculate rank for backlog items
        let rank = 0;
        if (newColumnId === 'backlog') {
            const backlogIssues = state.issues.filter(i => i.columnId === 'backlog');
            rank = backlogIssues.length > 0 ? Math.max(...backlogIssues.map(i => i.rank || 0)) + 1 : 1;
        }

        const newIssue = {
            id: `issue-${Date.now()}`,
            key: `${state.projectKey}-${state.issueCounter}`,
            type: document.getElementById('issueType').value,
            priority: document.getElementById('issuePriority').value,
            summary: summary,
            description: document.getElementById('issueDescription').value,
            assignee: document.getElementById('issueAssignee').value,
            estimate: document.getElementById('issueEstimate').value,
            component: document.getElementById('issueComponent').value,
            epic: document.getElementById('issueEpic').value,
            dueDate: document.getElementById('issueDueDate').value,
            labels: labels,
            columnId: newColumnId,
            rank: rank
        };

        state.issues.push(newIssue);
        state.issueCounter++;

        showToast(`${newIssue.key} created`, 'success');
    }

    saveState();
    renderBoard();
    renderBacklog();
    closeIssueModal();
}

// Delete Issue
function deleteIssue() {
    if (editingIssueId) {
        const issue = state.issues.find(i => i.id === editingIssueId);
        if (issue && confirm(`Delete ${issue.key}?`)) {
            state.issues = state.issues.filter(i => i.id !== editingIssueId);
            saveState();
            renderBoard();
            renderBacklog();
            closeIssueModal();
            showToast(`${issue.key} deleted`);
        }
    }
}

// Update Column Select
function updateColumnSelect() {
    const select = document.getElementById('issueColumn');
    select.innerHTML = '';

    // Add Backlog option
    const backlogOption = document.createElement('option');
    backlogOption.value = 'backlog';
    backlogOption.textContent = 'Backlog';
    select.appendChild(backlogOption);

    // Add column options
    state.columns.forEach(col => {
        const option = document.createElement('option');
        option.value = col.id;
        option.textContent = col.name;
        select.appendChild(option);
    });
}

// Update Epic Select
function updateEpicSelect() {
    const select = document.getElementById('issueEpic');
    select.innerHTML = '<option value="">None</option>';
    state.issues.filter(i => i.type === 'epic').forEach(epic => {
        const option = document.createElement('option');
        option.value = epic.key;
        option.textContent = `${epic.key}: ${epic.summary}`;
        select.appendChild(option);
    });
}

// Open Column Modal
let editingColumnId = null;

function openColumnModal(column = null) {
    editingColumnId = column ? column.id : null;

    const modal = elements.columnModal;
    const title = document.getElementById('columnModalTitle');
    const saveBtn = document.getElementById('saveColumn');
    const deleteBtn = document.getElementById('deleteColumn');

    if (column) {
        title.textContent = 'Edit Column';
        saveBtn.textContent = 'Update Column';
        deleteBtn.style.display = state.columns.length > 1 ? 'block' : 'none';

        document.getElementById('columnName').value = column.name;
        document.getElementById('columnWip').value = column.wip;
        document.getElementById('columnColor').value = column.color;
    } else {
        title.textContent = 'Add Column';
        saveBtn.textContent = 'Add Column';
        deleteBtn.style.display = 'none';

        document.getElementById('columnName').value = '';
        document.getElementById('columnWip').value = 0;
        document.getElementById('columnColor').value = '#0052CC';
    }

    modal.classList.add('open');
    elements.overlay.classList.add('open');
    document.getElementById('columnName').focus();
}

// Close Column Modal
function closeColumnModal() {
    elements.columnModal.classList.remove('open');
    elements.overlay.classList.remove('open');
    editingColumnId = null;
}

// Save Column
function saveColumn() {
    const name = document.getElementById('columnName').value.trim();
    if (!name) {
        showToast('Please enter a column name', 'error');
        return;
    }

    if (editingColumnId) {
        // Update existing column
        const column = state.columns.find(c => c.id === editingColumnId);
        if (column) {
            column.name = name;
            column.wip = parseInt(document.getElementById('columnWip').value) || 0;
            column.color = document.getElementById('columnColor').value;

            showToast('Column updated');
        }
    } else {
        // Create new column
        const newColumn = {
            id: `col-${Date.now()}`,
            name: name,
            wip: parseInt(document.getElementById('columnWip').value) || 0,
            color: document.getElementById('columnColor').value
        };

        state.columns.push(newColumn);
        showToast('Column added', 'success');
    }

    saveState();
    renderBoard();
    updateColumnSelect();
    closeColumnModal();

    if (elements.settingsPanel.classList.contains('open')) {
        renderColumnSettings();
    }
}

// Delete Column
function deleteColumn() {
    if (editingColumnId && state.columns.length > 1) {
        const column = state.columns.find(c => c.id === editingColumnId);
        const issueCount = state.issues.filter(i => i.columnId === editingColumnId).length;

        if (confirm(`Delete "${column.name}"? ${issueCount > 0 ? `${issueCount} issues will be moved to the first column.` : ''}`)) {
            // Move issues to first column (excluding this one)
            const targetColumn = state.columns.find(c => c.id !== editingColumnId);
            state.issues.forEach(issue => {
                if (issue.columnId === editingColumnId) {
                    issue.columnId = targetColumn.id;
                }
            });

            state.columns = state.columns.filter(c => c.id !== editingColumnId);
            saveState();
            renderBoard();
            updateColumnSelect();
            closeColumnModal();

            if (elements.settingsPanel.classList.contains('open')) {
                renderColumnSettings();
            }

            showToast('Column deleted');
        }
    }
}

// Export Board
function exportBoard() {
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        boardName: state.boardName,
        projectKey: state.projectKey,
        issueCounter: state.issueCounter,
        columns: state.columns,
        issues: state.issues,
        displayOptions: state.displayOptions,
        theme: state.theme
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jira-kanban-mockup-${state.projectKey.toLowerCase()}-${formatDateForFile(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Board exported successfully', 'success');
}

// Import Board
function importBoard(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importData = JSON.parse(event.target.result);

            if (!importData.columns || !importData.issues) {
                throw new Error('Invalid file format');
            }

            state.boardName = importData.boardName || 'Imported Board';
            state.projectKey = importData.projectKey || 'PROJ';
            state.issueCounter = importData.issueCounter || 1;
            state.columns = importData.columns;
            state.issues = importData.issues;
            state.displayOptions = importData.displayOptions || state.displayOptions;
            state.theme = importData.theme || 'light';

            elements.boardName.textContent = state.boardName;
            applyTheme();
            saveState();
            renderBoard();
            updateColumnSelect();

            showToast('Board imported successfully', 'success');
        } catch (error) {
            showToast('Failed to import board: Invalid file', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
}

// Apply Theme
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
}

// Show Toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility Functions
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getAssigneeName(id) {
    const names = {
        john: 'John Doe',
        jane: 'Jane Smith',
        bob: 'Bob Johnson',
        alice: 'Alice Williams'
    };
    return names[id] || 'Unassigned';
}

function getColumnName(id) {
    const col = state.columns.find(c => c.id === id);
    return col ? col.name : 'Unknown';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateForFile(date) {
    return date.toISOString().split('T')[0];
}

// ===== BACKLOG FUNCTIONALITY =====

// Switch between Board and Backlog views
function switchView(view) {
    state.currentView = view;

    // Update tab states
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });

    // Show/hide containers
    if (elements.boardContainer) {
        elements.boardContainer.style.display = view === 'board' ? 'block' : 'none';
    }
    if (elements.backlogContainer) {
        elements.backlogContainer.style.display = view === 'backlog' ? 'flex' : 'none';
    }

    // Show/hide board-specific toolbar elements
    const swimlaneControls = document.querySelector('.swimlane-controls');
    const toolbar = document.querySelector('.toolbar');
    if (swimlaneControls) {
        swimlaneControls.style.display = view === 'board' ? 'flex' : 'none';
    }
    if (toolbar) {
        toolbar.style.display = view === 'board' ? 'flex' : 'none';
    }

    // Render the appropriate view
    if (view === 'backlog') {
        renderBacklog();
    }

    saveState();
}

// Render Backlog
function renderBacklog() {
    if (!elements.backlogList) return;

    const backlogIssues = getFilteredBacklogIssues();
    elements.backlogList.innerHTML = '';

    if (backlogIssues.length === 0) {
        if (elements.backlogEmpty) elements.backlogEmpty.style.display = 'flex';
        return;
    }

    if (elements.backlogEmpty) elements.backlogEmpty.style.display = 'none';

    // Sort by rank
    backlogIssues.sort((a, b) => (a.rank || 0) - (b.rank || 0));

    backlogIssues.forEach((issue, index) => {
        const row = createBacklogRow(issue, index + 1);
        elements.backlogList.appendChild(row);
    });

    setupBacklogDragAndDrop();
    updateBulkActionsVisibility();
}

// Get Filtered Backlog Issues
function getFilteredBacklogIssues() {
    return state.issues.filter(issue => {
        // Must be in backlog
        if (issue.columnId !== 'backlog') return false;

        // Apply component filter
        if (state.backlogFilters.component && issue.component !== state.backlogFilters.component) {
            return false;
        }

        // Apply type filter
        if (state.backlogFilters.type && issue.type !== state.backlogFilters.type) {
            return false;
        }

        // Apply assignee filter
        if (state.backlogFilters.assignee) {
            if (state.backlogFilters.assignee === 'unassigned' && issue.assignee) {
                return false;
            } else if (state.backlogFilters.assignee !== 'unassigned' && issue.assignee !== state.backlogFilters.assignee) {
                return false;
            }
        }

        // Apply search filter
        if (state.backlogFilters.search) {
            const search = state.backlogFilters.search.toLowerCase();
            return (
                issue.key.toLowerCase().includes(search) ||
                issue.summary.toLowerCase().includes(search) ||
                (issue.component && issue.component.toLowerCase().includes(search)) ||
                issue.labels.some(l => l.toLowerCase().includes(search))
            );
        }

        return true;
    });
}

// Create Backlog Row
function createBacklogRow(issue, displayRank) {
    const row = document.createElement('div');
    row.className = 'backlog-row';
    row.dataset.issueId = issue.id;
    row.draggable = true;

    if (state.selectedIssues.includes(issue.id)) {
        row.classList.add('selected');
    }

    const statusBadge = getStatusBadge(issue.columnId);
    const assigneeHtml = issue.assignee
        ? `<div class="backlog-assignee-avatar ${issue.assignee}">${issue.assignee.charAt(0).toUpperCase()}</div>
           <span class="backlog-assignee-name">${getAssigneeName(issue.assignee)}</span>`
        : '<span class="backlog-assignee-name" style="color: var(--neutral-300)">Unassigned</span>';

    const componentHtml = issue.component
        ? `<span class="issue-component-tag" data-component="${issue.component.toLowerCase()}">${issue.component}</span>`
        : '<span style="color: var(--neutral-300)">-</span>';

    row.innerHTML = `
        <div class="backlog-cell checkbox-cell">
            <input type="checkbox" class="issue-checkbox" data-issue-id="${issue.id}" ${state.selectedIssues.includes(issue.id) ? 'checked' : ''}>
        </div>
        <div class="backlog-cell rank-cell" title="Drag to reorder">
            <div class="rank-handle">
                ${icons.drag}
                <span class="rank-number">${displayRank}</span>
            </div>
        </div>
        <div class="backlog-cell type-cell" title="${issue.type}">
            ${icons[issue.type]}
        </div>
        <div class="backlog-cell key-cell">${issue.key}</div>
        <div class="backlog-cell summary-cell" title="${escapeHtml(issue.summary)}">${escapeHtml(issue.summary)}</div>
        <div class="backlog-cell component-cell">${componentHtml}</div>
        <div class="backlog-cell priority-cell" title="${issue.priority}">
            ${icons[issue.priority]}
        </div>
        <div class="backlog-cell status-cell">
            ${statusBadge}
        </div>
        <div class="backlog-cell assignee-cell">
            ${assigneeHtml}
        </div>
        <div class="backlog-cell estimate-cell">
            ${issue.estimate ? `<span class="backlog-estimate-badge">${issue.estimate}</span>` : '-'}
        </div>
    `;

    // Click to select/show details
    row.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') return;
        showIssueDetail(issue.id);
    });

    // Checkbox change
    row.querySelector('.issue-checkbox').addEventListener('change', (e) => {
        e.stopPropagation();
        toggleIssueSelection(issue.id, e.target.checked);
    });

    return row;
}

// Get Status Badge HTML
function getStatusBadge(columnId) {
    if (columnId === 'backlog') {
        return '<span class="backlog-status-badge backlog">Backlog</span>';
    }
    const column = state.columns.find(c => c.id === columnId);
    if (!column) return '<span class="backlog-status-badge backlog">Backlog</span>';

    let statusClass = 'todo';
    if (column.name.toLowerCase().includes('progress') || column.name.toLowerCase().includes('review')) {
        statusClass = 'in-progress';
    } else if (column.name.toLowerCase().includes('done') || column.name.toLowerCase().includes('complete')) {
        statusClass = 'done';
    }

    return `<span class="backlog-status-badge ${statusClass}">${column.name}</span>`;
}

// Setup Backlog Drag and Drop for Ranking
function setupBacklogDragAndDrop() {
    let draggedRow = null;
    let draggedIssueId = null;

    document.querySelectorAll('.backlog-row').forEach(row => {
        row.addEventListener('dragstart', (e) => {
            draggedRow = row;
            draggedIssueId = row.dataset.issueId;
            row.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedIssueId);
        });

        row.addEventListener('dragend', () => {
            row.classList.remove('dragging');
            document.querySelectorAll('.backlog-row').forEach(r => r.classList.remove('drag-over'));
            draggedRow = null;
            draggedIssueId = null;
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedRow || draggedRow === row) return;

            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            document.querySelectorAll('.backlog-row').forEach(r => r.classList.remove('drag-over'));

            if (e.clientY < midY) {
                row.classList.add('drag-over');
            } else {
                row.classList.add('drag-over');
            }
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedIssueId) return;

            const targetId = row.dataset.issueId;
            if (draggedIssueId === targetId) return;

            // Reorder issues
            reorderBacklogIssue(draggedIssueId, targetId);
        });
    });
}

// Reorder Backlog Issue
function reorderBacklogIssue(draggedId, targetId) {
    const backlogIssues = state.issues
        .filter(i => i.columnId === 'backlog')
        .sort((a, b) => (a.rank || 0) - (b.rank || 0));

    const draggedIndex = backlogIssues.findIndex(i => i.id === draggedId);
    const targetIndex = backlogIssues.findIndex(i => i.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item and insert at target position
    const [draggedIssue] = backlogIssues.splice(draggedIndex, 1);
    backlogIssues.splice(targetIndex, 0, draggedIssue);

    // Update ranks
    backlogIssues.forEach((issue, index) => {
        issue.rank = index + 1;
    });

    saveState();
    renderBacklog();
    showToast('Issue reranked', 'success');
}

// Toggle Issue Selection
function toggleIssueSelection(issueId, selected) {
    if (selected) {
        if (!state.selectedIssues.includes(issueId)) {
            state.selectedIssues.push(issueId);
        }
    } else {
        state.selectedIssues = state.selectedIssues.filter(id => id !== issueId);
    }

    // Update row styling
    const row = document.querySelector(`.backlog-row[data-issue-id="${issueId}"]`);
    if (row) {
        row.classList.toggle('selected', selected);
    }

    updateBulkActionsVisibility();
    updateSelectAllCheckbox();
}

// Update Bulk Actions Visibility
function updateBulkActionsVisibility() {
    if (!elements.bulkActions || !elements.backlogFilters || !elements.selectedCount) return;

    const hasSelection = state.selectedIssues.length > 0;
    elements.bulkActions.style.display = hasSelection ? 'flex' : 'none';
    elements.backlogFilters.style.display = hasSelection ? 'none' : 'flex';
    elements.selectedCount.textContent = `${state.selectedIssues.length} selected`;
}

// Update Select All Checkbox
function updateSelectAllCheckbox() {
    if (!elements.selectAllBacklog) return;

    const backlogIssues = getFilteredBacklogIssues();
    const allSelected = backlogIssues.length > 0 && backlogIssues.every(i => state.selectedIssues.includes(i.id));
    const someSelected = backlogIssues.some(i => state.selectedIssues.includes(i.id));

    elements.selectAllBacklog.checked = allSelected;
    elements.selectAllBacklog.indeterminate = someSelected && !allSelected;
}

// Select All Backlog Issues
function selectAllBacklogIssues(selected) {
    const backlogIssues = getFilteredBacklogIssues();

    if (selected) {
        state.selectedIssues = backlogIssues.map(i => i.id);
    } else {
        state.selectedIssues = [];
    }

    renderBacklog();
}

// Clear Selection
function clearSelection() {
    state.selectedIssues = [];
    renderBacklog();
}

// Show Issue Detail Panel
function showIssueDetail(issueId) {
    const issue = state.issues.find(i => i.id === issueId);
    if (!issue || !elements.issueDetailPanel) return;

    state.detailPanelIssueId = issueId;

    // Update detail panel content
    document.getElementById('detailIssueKey').textContent = issue.key;
    document.getElementById('detailSummary').textContent = issue.summary;
    document.getElementById('detailDescriptionText').textContent = issue.description || 'No description';
    document.getElementById('detailType').innerHTML = `${icons[issue.type]} <span style="margin-left: 4px; text-transform: capitalize;">${issue.type}</span>`;
    document.getElementById('detailPriority').innerHTML = `${icons[issue.priority]} <span style="margin-left: 4px; text-transform: capitalize;">${issue.priority}</span>`;
    document.getElementById('detailComponent').textContent = issue.component || '';
    document.getElementById('detailAssignee').textContent = issue.assignee ? getAssigneeName(issue.assignee) : '';
    document.getElementById('detailEstimate').textContent = issue.estimate || '';
    document.getElementById('detailStatus').innerHTML = getStatusBadge(issue.columnId);
    document.getElementById('detailLabels').textContent = issue.labels.length > 0 ? issue.labels.join(', ') : '';
    document.getElementById('detailEpic').textContent = issue.epic || '';
    document.getElementById('detailDueDate').textContent = issue.dueDate ? formatDate(issue.dueDate) : '';
    document.getElementById('detailRank').textContent = issue.rank || '';

    elements.issueDetailPanel.classList.remove('hidden');
    elements.issueDetailPanel.classList.add('open');

    // Highlight selected row
    document.querySelectorAll('.backlog-row').forEach(row => {
        row.style.borderLeft = row.dataset.issueId === issueId ? '3px solid var(--jira-blue)' : '';
    });
}

// Close Issue Detail Panel
function closeIssueDetailPanel() {
    if (elements.issueDetailPanel) {
        elements.issueDetailPanel.classList.add('hidden');
        elements.issueDetailPanel.classList.remove('open');
    }
    state.detailPanelIssueId = null;

    // Remove highlight from rows
    document.querySelectorAll('.backlog-row').forEach(row => {
        row.style.borderLeft = '';
    });
}

// Send Issues to Board
function sendIssuesToBoard(issueIds, targetColumnId = null) {
    const columnId = targetColumnId || state.columns[0]?.id;
    if (!columnId) {
        showToast('No columns available', 'error');
        return;
    }

    issueIds.forEach(id => {
        const issue = state.issues.find(i => i.id === id);
        if (issue) {
            issue.columnId = columnId;
        }
    });

    state.selectedIssues = state.selectedIssues.filter(id => !issueIds.includes(id));
    saveState();
    renderBacklog();
    renderBoard();
    showToast(`${issueIds.length} issue(s) sent to board`, 'success');
}

// Bulk Delete Issues
function bulkDeleteIssues(issueIds) {
    if (!confirm(`Delete ${issueIds.length} issue(s)?`)) return;

    state.issues = state.issues.filter(i => !issueIds.includes(i.id));
    state.selectedIssues = [];
    saveState();
    renderBacklog();
    showToast(`${issueIds.length} issue(s) deleted`, 'success');
}

// Setup Backlog Event Listeners
function setupBacklogEventListeners() {
    // View tabs
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    // Backlog filters
    const componentFilter = document.getElementById('backlogComponentFilter');
    const typeFilter = document.getElementById('backlogTypeFilter');
    const assigneeFilter = document.getElementById('backlogAssigneeFilter');
    const backlogSearch = document.getElementById('backlogSearchInput');

    if (componentFilter) {
        componentFilter.addEventListener('change', (e) => {
            state.backlogFilters.component = e.target.value;
            renderBacklog();
        });
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            state.backlogFilters.type = e.target.value;
            renderBacklog();
        });
    }

    if (assigneeFilter) {
        assigneeFilter.addEventListener('change', (e) => {
            state.backlogFilters.assignee = e.target.value;
            renderBacklog();
        });
    }

    if (backlogSearch) {
        backlogSearch.addEventListener('input', (e) => {
            state.backlogFilters.search = e.target.value;
            renderBacklog();
        });
    }

    // Select all checkbox
    if (elements.selectAllBacklog) {
        elements.selectAllBacklog.addEventListener('change', (e) => {
            selectAllBacklogIssues(e.target.checked);
        });
    }

    // Bulk actions
    const bulkMoveBtn = document.getElementById('bulkMoveToBoard');
    const bulkDeleteBtn = document.getElementById('bulkDelete');
    const clearSelectionBtn = document.getElementById('clearSelection');

    if (bulkMoveBtn) {
        bulkMoveBtn.addEventListener('click', () => {
            sendIssuesToBoard([...state.selectedIssues]);
        });
    }

    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', () => {
            bulkDeleteIssues([...state.selectedIssues]);
        });
    }

    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelection);
    }

    // Detail panel buttons
    const closeDetailBtn = document.getElementById('closeDetailPanel');
    const detailSendBtn = document.getElementById('detailSendToBoard');
    const detailEditBtn = document.getElementById('detailEditIssue');

    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', closeIssueDetailPanel);
    }

    if (detailSendBtn) {
        detailSendBtn.addEventListener('click', () => {
            if (state.detailPanelIssueId) {
                sendIssuesToBoard([state.detailPanelIssueId]);
                closeIssueDetailPanel();
            }
        });
    }

    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', () => {
            if (state.detailPanelIssueId) {
                const issue = state.issues.find(i => i.id === state.detailPanelIssueId);
                if (issue) {
                    closeIssueDetailPanel();
                    openIssueModal(issue);
                }
            }
        });
    }

    // Add backlog issue button
    const addBacklogIssueBtn = document.getElementById('addBacklogIssue');
    if (addBacklogIssueBtn) {
        addBacklogIssueBtn.addEventListener('click', () => {
            openIssueModal(null, 'backlog');
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
