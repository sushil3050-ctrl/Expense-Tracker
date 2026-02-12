let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentChart = null;
let currentViz = 'pie';
let currentCurrency = localStorage.getItem('currency') || 'INR';

const categoryColors = {
    food: '#f59e0b', transport: '#3b82f6', entertainment: '#8b5cf6',
    bills: '#ef4444', shopping: '#10b981', healthcare: '#ec4899', others: '#64748b'
};

const categoryLabels = {
    food: '🍔 Food', transport: '🚗 Transport', entertainment: '🎬 Entertainment',
    bills: '💡 Bills', shopping: '🛍️ Shopping', healthcare: '🏥 Healthcare', others: '📦 Others'
};

const currencyConfig = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' }
};

function getCurrencySymbol() {
    return currencyConfig[currentCurrency].symbol;
}

function formatAmount(amount) {
    return `${getCurrencySymbol()}${amount.toFixed(2)}`;
}

function changeCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('currency', currency);
    renderExpenses();
    updateSummary();
    renderChart();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('date').valueAsDate = new Date();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    // Load saved currency
    const savedCurrency = localStorage.getItem('currency') || 'INR';
    currentCurrency = savedCurrency;
    document.getElementById('currency-selector').value = savedCurrency;
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    renderExpenses();
    updateSummary();
    renderChart();
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
    renderChart();
}

function updateThemeButton(theme) {
    document.getElementById('theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    document.getElementById('theme-text').textContent = theme === 'dark' ? 'Light' : 'Dark';
}

function addExpense(event) {
    event.preventDefault();
    const expense = {
        id: Date.now(),
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value || '-'
    };
    expenses.unshift(expense);
    saveExpenses();
    document.getElementById('expense-form').reset();
    document.getElementById('date').valueAsDate = new Date();
    renderExpenses();
    updateSummary();
    renderChart();
}

function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
    renderExpenses();
    updateSummary();
    renderChart();
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
    const tbody = document.getElementById('expense-list');
    const emptyState = document.getElementById('empty-state');
    const table = document.getElementById('expense-table');

    if (expenses.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        table.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    table.style.display = 'table';

    tbody.innerHTML = expenses.map(expense => `
        <tr>
            <td>${formatDate(expense.date)}</td>
            <td><span class="category-badge category-${expense.category}">${categoryLabels[expense.category]}</span></td>
            <td>${escapeHtml(expense.description)}</td>
            <td class="amount">${formatAmount(expense.amount)}</td>
            <td>
                <div class="actions">
                    <button class="btn-icon" onclick="deleteExpense(${expense.id})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateSummary() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const avg = count > 0 ? total / count : 0;

    document.getElementById('total-amount').textContent = formatAmount(total);
    document.getElementById('total-count').textContent = count;
    document.getElementById('avg-amount').textContent = formatAmount(avg);
}

function switchViz(type, element) {
    currentViz = type;
    document.querySelectorAll('.viz-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
    renderChart();
}

function renderChart() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    if (currentChart) currentChart.destroy();

    if (expenses.length === 0) {
        document.getElementById('viz-content').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <h3>No data to visualize</h3>
                <p>Add expenses to see visualizations</p>
            </div>`;
        return;
    }

    document.getElementById('viz-content').innerHTML = `<div class="chart-container"><canvas id="chart-canvas"></canvas></div>`;
    const ctx = document.getElementById('chart-canvas').getContext('2d');

    if (currentViz === 'pie') renderPieChart(ctx, textColor);
    else if (currentViz === 'line') renderLineChart(ctx, textColor, gridColor);
    else if (currentViz === 'stats') renderStats();
}

function renderPieChart(ctx, textColor) {
    const categoryTotals = {};
    expenses.forEach(e => categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount);

    currentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals).map(cat => categoryLabels[cat]),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: Object.keys(categoryTotals).map(cat => categoryColors[cat]),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            return `${getCurrencySymbol()}${value.toFixed(2)} (${((value / total) * 100).toFixed(1)}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderLineChart(ctx, textColor, gridColor) {
    const dailyTotals = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dailyTotals[date.toISOString().split('T')[0]] = 0;
    }
    expenses.forEach(e => { if (dailyTotals.hasOwnProperty(e.date)) dailyTotals[e.date] += e.amount; });

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(dailyTotals).map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }),
            datasets: [{
                label: 'Daily Spending',
                data: Object.values(dailyTotals),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: textColor, maxTicksLimit: 10 } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => `${getCurrencySymbol()}${v}` } }
            }
        }
    });
}

function renderStats() {
    const categoryTotals = {};
    expenses.forEach(e => categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    const maxExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
    
    document.getElementById('viz-content').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">Total Spent</div><div class="stat-value">${formatAmount(total)}</div></div>
            <div class="stat-card"><div class="stat-label">Transactions</div><div class="stat-value">${expenses.length}</div></div>
            <div class="stat-card"><div class="stat-label">Average per Day</div><div class="stat-value">${formatAmount(total / 30)}</div></div>
            <div class="stat-card"><div class="stat-label">Highest Expense</div><div class="stat-value">${formatAmount(maxExpense)}</div></div>
            <div class="stat-card"><div class="stat-label">Top Category</div><div class="stat-value">${sorted[0] ? categoryLabels[sorted[0][0]].split(' ')[1] : '-'}</div></div>
            <div class="stat-card"><div class="stat-label">Categories Used</div><div class="stat-value">${Object.keys(categoryTotals).length}</div></div>
        </div>`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}