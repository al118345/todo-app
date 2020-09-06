/**
 * Created by fmixagent on 01/03/2017.
 */
var TodoApp;
(function (TodoApp) {
    var TodoItem = (function () {
        function TodoItem(todoData) {
            // Recover data
            this._todoData = todoData;
        }
        TodoItem.prototype.getHTML = function () {
            // Create template with todo text
            var itemHTML;
            itemHTML = "\n            <li class=\"listUOC-item\">\n                <div href=\"#\" class=\"listUOC-item-todo\">" + this._todoData.todoTxt + "</div>\n                <button data-id=\"" + this._todoData.id + "\"  class=\"btn btUOC listUOC-item-removeBt btUOC-grey\"><span class=\"glyphicon glyphicon-trash\"></span> Remove</button>\n            </li>\n            ";
            return itemHTML;
        };
        return TodoItem;
    }());
    TodoApp.TodoItem = TodoItem;
})(TodoApp || (TodoApp = {}));
