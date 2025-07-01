"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todos = void 0;
const todo_1 = require("../types/todo");
exports.todos = [
    { id: 1, title: "공부하기", done: false, category: "공부", importance: todo_1.Importance.HIGH },
    { id: 2, title: "운동하기", done: true, category: "건강", importance: todo_1.Importance.MEDIUM }
];
