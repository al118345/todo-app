/**
 * Created by fmixagent on 01/03/2017.
 */
var TodoApp;
(function (TodoApp) {
    var TodoList = (function () {
        function TodoList() {
            var _this = this;
            // APP PRIVATE VARS
            this._todoList = []; // List of todos
            this._idCounter = 0; // For the next todo to save
            // Add new todo
            this.saveNewTodo = function () {
                console.log("//SAVE NEW TODO");
                // Recover todo data
                var todoTxt = _this.$newTodoInput.val();
                // Update list if new todo introduced
                if (todoTxt != "") {
                    // Update todo list
                    var newTodo = {
                        id: _this._idCounter,
                        todoTxt: todoTxt
                    };
                    _this.addTodo(newTodo, true);
                    // Empty input field
                    _this.$newTodoInput.val("");
                }
            };
            this.onLoadTodosDataSuccess = function (data) {
                var i;
                var nTodos;
                var currentTodoData;
                nTodos = data.length;
                for (i = 0; i < nTodos; i++) {
                    currentTodoData = data[i];
                    _this.addTodo(currentTodoData, false);
                }
                _this.render();
            };
            this.onLoadTodosDataError = function () {
                console.log('Error loading data.');
            };
            this.deleteTodo = function (e) {
                console.log("//DELETE ITEM");
                var $target = $(e.currentTarget);
                console.log("CLICK:" + parseInt($target.data('id')));
                _this.deleteTodoById(parseInt($target.data('id')));
            };
            // DOM ELEMENTS
            this.$todoList = $(TodoList.DOM_TODOLIST);
            this.$saveTodoBt = $(TodoList.DOM_SAVETODO_BT);
            this.$newTodoInput = $(TodoList.DOM_NEWTODO_INPUT);
            // CLICK EVENTS
            this.$todoList.on('click', '.listUOC-item-removeBt', this.deleteTodo);
            this.$saveTodoBt.on('click', this.saveNewTodo);
            // Disable form submit
            $('form').submit(function () {
                return false;
            });
            // DEFAULTS
            this.checkTodoListData();
        }
        TodoList.prototype.render = function () {
            console.log("//RENDER");
            // Reference to the DOM element that will contain the todo list
            var $todoListContainer = $(TodoList.DOM_TODOLIST_CONTAINER);
            // Empty old todo list
            this.$todoList.detach();
            this.$todoList.empty();
            // Create new todo list
            for (var i = 0; i < this._todoList.length; i++) {
                var item = new TodoApp.TodoItem(this._todoList[i]);
                this.$todoList.append(item.getHTML());
            }
            // Add to DOM
            $todoListContainer.append(this.$todoList);
        };
        // STORE DATA
        TodoList.prototype.checkTodoListData = function () {
            var storedData;
            var $alertFirstTime;
            storedData = store.get(TodoList.PERSISTENT_OBJECT_KEY);
            $alertFirstTime = $(TodoList.DOM_ALERT_FIRST_TIME);
            if (storedData) {
                $alertFirstTime.remove();
                this.onLoadTodosDataSuccess(storedData);
            }
            else {
                console.log("//NO DATA");
                this.loadFirstTimeData();
            }
        };
        ;
        TodoList.prototype.loadFirstTimeData = function () {
            $.ajax({
                dataType: "json",
                url: TodoList.PERSISTENT_OBJECT_DATA_PATH,
                success: this.onLoadTodosDataSuccess,
                error: this.onLoadTodosDataError
            });
        };
        TodoList.prototype.savePersistentData = function () {
            var i;
            var nTodos;
            var currentTodo;
            var savedTodo;
            var todoListJSON;
            todoListJSON = [];
            nTodos = this._todoList.length;
            for (i = 0; i < nTodos; i++) {
                currentTodo = this._todoList[i];
                savedTodo = {};
                savedTodo[TodoList.PERSISTENT_OBJECT_TODO_ID] = currentTodo.id;
                savedTodo[TodoList.PERSISTENT_OBJECT_TODO_TXT] = currentTodo.todoTxt;
                todoListJSON.push(savedTodo);
            }
            store.clear();
            store.set(TodoList.PERSISTENT_OBJECT_KEY, todoListJSON);
        };
        ;
        TodoList.prototype.addTodo = function (newTodoData, forceRender) {
            this._todoList.push(newTodoData);
            this._idCounter++;
            this.savePersistentData();
            if (forceRender) {
                this.render();
            }
        };
        ;
        TodoList.prototype.deleteTodoById = function (id) {
            console.log("TODO DELETED");
            var i = 0;
            var nTodos = this._todoList.length;
            for (i = 0; i < nTodos; i++) {
                if (this._todoList[i].id == id) {
                    this._todoList.splice(i, 1);
                    break;
                }
            }
            this.savePersistentData();
            this.render();
        };
        return TodoList;
    }());
    // TEMPLATE | DOM ELEMENTS
    TodoList.DOM_TODOLIST_CONTAINER = '#todo-list-container';
    TodoList.DOM_TODOLIST = '#todo-list';
    TodoList.DOM_NEWTODO_INPUT = '#new-todo-input';
    TodoList.DOM_SAVETODO_BT = '#save-todo-bt';
    // STORE RELATED
    TodoList.DOM_ALERT_FIRST_TIME = '#alert-first-time';
    TodoList.PERSISTENT_OBJECT_KEY = 'todoList';
    TodoList.PERSISTENT_OBJECT_DATA_PATH = 'data/defaultdata.json';
    TodoList.PERSISTENT_OBJECT_TODO_ID = 'id';
    TodoList.PERSISTENT_OBJECT_TODO_TXT = 'todoTxt';
    TodoApp.TodoList = TodoList;
})(TodoApp || (TodoApp = {}));
var app;
window.onload = function () {
    console.log("/// APP INIT");
    // Test todoItem
    app = new TodoApp.TodoList();
};
