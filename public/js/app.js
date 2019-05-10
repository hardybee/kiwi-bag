
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;
	
	var urlFilter;

	function uuid () {
		/*jshint bitwise:false */
		var i, random;
		var uuid = '';

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				uuid += '-';
			}
			uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
		}
		return uuid;
	};

	function pluralize(count, word) {
		return count === 1 ? word : word + 's';
	};
	
	
	function store(namespace, data) {
		if (arguments.length > 1) {
			return localStorage.setItem(namespace, JSON.stringify(data));
		} else {
			var store = localStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		}
	};
	
	var todos = store('todos-jquery');

	function getActiveTodos() {
		return todos.filter(function(todo) {
			return !todo.completed;
		});
	};

	function renderFooter() {
		var todoCount = todos.length;
		var activeTodoCount = getActiveTodos().length;
		var footer = document.getElementById('footer');
		var template = footerTemplate({
			activeTodoCount: activeTodoCount,
			activeTodoWord: pluralize(activeTodoCount, 'item'),
			completedTodos: todoCount - activeTodoCount,
			filter: urlFilter
		});
		footer.innerHTML = template;

		if (todoCount > 0) {
			footer.classList.add('is-visible');
		} else {
			footer.classList.remove('is-visible');
		}

	};

	function getFilteredTodos() {
		if (urlFilter === 'active') {
			return getActiveTodos();
		}

		if (urlFilter === 'completed') {
			return getCompletedTodos();
		}

		return todos;
	};
	
	function render() {
		var todos = getFilteredTodos();

		var todoList = document.querySelector('#todo-list');
		todoList.innerHTML = todoTemplate(todos);
		var mainEl = document.querySelector('#main');
		if (todos.length > 0) {
			mainEl.classList.add('is-visible');
		} else {
			mainEl.classList.remove('is-visible');
		}

		var toggleAll = document.querySelector('#toggleAll');
		if (toggleAll) {
			if (getActiveTodos().length === 0) {
				toggleAll.checked = false;
			} else {
				toggleAll.checked = true;
			}
		};

		renderFooter();
		var newTodo = document.querySelector('#new-todo');
		newTodo.focus;
		store('todos-jquery', todos);
	};
	
	var todoTemplate = '';
	var footerTemplate = '';
	var todoSource = document.querySelector('#todo-template');
	todoTemplate = Handlebars.compile(todoSource.innerHTML);
	var footerSource = document.querySelector('#footer-template');
	footerTemplate = Handlebars.compile(footerSource.innerHTML);

	function getCompletedTodos() {
		return todos.filter(function (todo) {
			return todo.completed;
		});
	};

	function destroyCompleted(e) {
		if (e.target.getAttribute('id') == 'clear-completed') {
			todos = getActiveTodos();
			urlFilter = 'all';
			render();
		}
	};

	function edit (e) {
		var listItem = e.target.closest('li');
		listItem.classList.add('editing');
		var input = listItem.querySelector('.edit');
		input.focus();
		input.selectionStart = input.selectionEnd = input.value.length;
	};

	function create(e) {
		var input = e.target;
		var val = input.value;

		if (e.key !== 'Enter' || !val) {
			return;
		}

		todos.push({
			id: uuid(),
			title: val,
			completed: false
		});

		input.value = '';

		render();
	};

	function toggleAll(e) {
		var isChecked = e.target.checked;

		todos.forEach(function (todo) {
			todo.completed = isChecked;
		});

		render();
	};

	function indexFromEl(el) {
		var id = el.closest('li').getAttribute('data-id');	
		var i = todos.length;

		while (i--) {
			if (todos[i].id === id) {
				return i;
			}
		}
	};

	function toggle(e) {
		if (e.target.matches('.toggle')) {
			var i = indexFromEl(e.target);
			todos[i].completed = !todos[i].completed;
			render();
		}
	};

	function editKeyup(e) {

		if (e.target.matches('.edit')) {
			if (e.key === 'Enter') {
				e.target.blur();
			}

			if (e.key === 'Escape') {
				e.target.setAttribute('abort', true);
				e.target.blur();
			}
		}
	};

	function destroy(e) {
		if (e.target.matches('.destroy')) {
			todos.splice(indexFromEl(e.target), 1);
			render();
		}
	}

	function update(e) {
		if (e.target.matches('.edit')) {
			var el = e.target;
			var val = el.value.trim();
			if (!val) {
				destroy(e);
				return;
			}
			if (el.hasAttribute('abort')) {
				el.setAttribute('abort', false);
			} else {
				todos[indexFromEl(el)].title = val;
			}
			render();
		};
	};

	function bindEvents() {
		var newTodoEl = document.querySelector('#new-todo');
		newTodoEl.addEventListener('keyup', create);

		var toggleAllEl = document.querySelector('#toggle-all');
		toggleAllEl.addEventListener('change', toggleAll);

		var footerEl = document.querySelector('#footer');
		footerEl.addEventListener('click', destroyCompleted);
				
		var todoList = document.querySelector('#todo-list');
		todoList.addEventListener('change', toggle);
		todoList.addEventListener('dblclick', edit);
		todoList.addEventListener('keyup', editKeyup);
		todoList.addEventListener('focusout', update);
		todoList.addEventListener('click', destroy);
	};

	var routes = {
		'/:filter': function (filter = 'all') {
			urlFilter = filter;
			this.filter = urlFilter;
			
			render();
		}
	};
		
	var router = Router(routes);
	router.init('/all');

	bindEvents();