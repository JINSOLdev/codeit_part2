"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos_1 = require("../data/todos");
const todo_1 = require("../types/todo");
const router = (0, express_1.Router)();
// GET /todos/previews
router.get("/previews", (req, res) => {
    // 방법1
    const previews = todos_1.todos.map(({ title, done }) => ({
        title,
        done,
    }));
    // 방법2
    // const previews: TodoPreview[] = todos.map(todo) => ({
    //   title: todo.title,
    //   done: todo.done,
    // }));
    res.json(previews);
});
// GET /todos
router.get("/", (req, res) => {
    res.json(todos_1.todos);
});
// GET /todos/:id
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos_1.todos.find((t) => t.id === id);
    if (!todo)
        return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    res.json(todo);
});
// POST /todos
router.post("/", (req, res) => {
    const { title, category, importance } = req.body;
    // 1. newTodo 만들기
    const newTodo = {
        id: Date.now(),
        title: title || "New todo",
        category: category || "Unassigned",
        done: false,
        importance: importance || todo_1.Importance.LOW,
        // importance: importance as Importance, // importance만 as Importance인 이유가 뭘까?
    };
    // 2. todos 에 newTodo 추가하기
    todos_1.todos.push(newTodo);
    res.status(201).json(newTodo);
});
// PUT /todos/:id
router.put("/:id", (req, res) => {
    // 1. req.params로 할 일 id 가져오기
    const id = Number(req.params.id);
    // 2. id로 기존에 작성했던 todo 내용 가져오기
    const todo = todos_1.todos.find((todo) => todo.id === id);
    if (!todo)
        return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    // 3. req.body로 수정할 내용 가져오기
    const { title, done, category, importance } = req.body;
    if (title !== undefined)
        todo.title = title;
    if (done !== undefined)
        todo.done = done;
    if (category !== undefined)
        todo.category = category;
    if (importance !== undefined)
        todo.importance = importance;
    res.json(todo);
});
// DELETE /todos/:id
router.delete("/:id", (req, res) => {
    // 1. URL 에서 id 추출
    const id = Number(req.params.id);
    // 2. 해당 id의 index찾기
    const index = todos_1.todos.findIndex((todo) => todo.id === id);
    // 3. 못 찾으면 에러 응답
    if (index === -1)
        return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
    todos_1.todos.splice(index, 1);
    res.status(204).send();
});
// GET /todos/filter?importance=high&done=true
router.get("/filter/query", (req, res) => {
    //1. URL에서 req.query 값 추출
    const { importance, done } = req.query;
    // 2. todo에서 importance, done값만 필터링
    const result = todos_1.todos.filter((todo) => {
        if (importance) {
            return todo.importance === importance;
        }
    });
    console.log(result);
});
exports.default = router;
