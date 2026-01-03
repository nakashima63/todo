// TODOアプリのメインロジック
class TodoApp {
    constructor() {
        this.todos = this.loadFromLocalStorage();
        this.currentFilter = 'all';
        this.searchQuery = '';

        this.initElements();
        this.attachEventListeners();
        this.render();
    }

    initElements() {
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.prioritySelect = document.getElementById('priority');
        this.dueDateInput = document.getElementById('due-date');
        this.todoList = document.getElementById('todo-list');
        this.searchInput = document.getElementById('search-input');
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.totalCount = document.getElementById('total-count');
        this.activeCount = document.getElementById('active-count');
        this.completedCount = document.getElementById('completed-count');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }

    handleSubmit(e) {
        e.preventDefault();

        const text = this.input.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value,
            dueDate: this.dueDateInput.value || null,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveToLocalStorage();
        this.render();

        // フォームをリセット
        this.input.value = '';
        this.dueDateInput.value = '';
        this.prioritySelect.value = 'medium';
        this.input.focus();
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.render();
    }

    handleFilter(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    clearCompleted() {
        if (confirm('完了済みのタスクをすべて削除しますか？')) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.render();
        }
    }

    getFilteredTodos() {
        let filtered = this.todos;

        // フィルターを適用
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        // 検索を適用
        if (this.searchQuery) {
            filtered = filtered.filter(t =>
                t.text.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();

        // リストをクリア
        this.todoList.innerHTML = '';

        // 空の状態を表示
        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-icon">📝</div>
                <p>${this.searchQuery ? '検索結果がありません' : 'タスクがありません'}</p>
            `;
            this.todoList.appendChild(emptyState);
        } else {
            // TODOアイテムを表示
            filteredTodos.forEach(todo => {
                const li = this.createTodoElement(todo);
                this.todoList.appendChild(li);
            });
        }

        // 統計を更新
        this.updateStats();
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item priority-${todo.priority}`;
        if (todo.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const content = document.createElement('div');
        content.className = 'todo-content';

        const text = document.createElement('div');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const meta = document.createElement('div');
        meta.className = 'todo-meta';

        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority-badge priority-${todo.priority}`;
        priorityBadge.textContent = this.getPriorityLabel(todo.priority);
        meta.appendChild(priorityBadge);

        if (todo.dueDate) {
            const dueDate = document.createElement('span');
            dueDate.className = 'due-date';
            const isOverdue = new Date(todo.dueDate) < new Date() && !todo.completed;
            if (isOverdue) {
                dueDate.classList.add('overdue');
                dueDate.textContent = `期限: ${this.formatDate(todo.dueDate)} (期限切れ)`;
            } else {
                dueDate.textContent = `期限: ${this.formatDate(todo.dueDate)}`;
            }
            meta.appendChild(dueDate);
        }

        content.appendChild(text);
        content.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(actions);

        return li;
    }

    getPriorityLabel(priority) {
        const labels = {
            low: '低',
            medium: '中',
            high: '高'
        };
        return labels[priority] || priority;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        this.totalCount.textContent = `総タスク: ${total}`;
        this.activeCount.textContent = `未完了: ${active}`;
        this.completedCount.textContent = `完了: ${completed}`;
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('todos');
        return data ? JSON.parse(data) : [];
    }
}

// アプリを初期化
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
