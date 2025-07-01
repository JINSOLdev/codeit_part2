import { Router } from "express";
import { todos } from "../data/todos";
import { Importance, Todo, TodoPreview } from "../types/todo";
import { filterBy } from "../utils/filter";
import { todo } from "node:test";

const router = Router();

// GET /todos/previews
router.get("/previews", (req, res) => {
  // 방법1
  const previews: TodoPreview[] = todos.map(({ title, done }) => ({
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
  res.json(todos);
});

// GET /todos/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo)
    return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
  res.json(todo);
});

// POST /todos
router.post("/", (req, res) => {
  const { title, category, importance } = req.body as Partial<Todo>;
  // 1. newTodo 만들기
  const newTodo: Todo = {
    id: Date.now(),
    title: title || "New todo",
    category: category || "Unassigned",
    done: false,
    importance: importance || Importance.LOW,
    // importance: importance as Importance, // importance만 as Importance인 이유가 뭘까?
  };

  // 2. todos 에 newTodo 추가하기
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id
router.put("/:id", (req, res) => {
  // 1. req.params로 할 일 id 가져오기
  const id = Number(req.params.id);

  // 2. id로 기존에 작성했던 todo 내용 가져오기
  const todo = todos.find((todo) => todo.id === id);

  if (!todo)
    return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });

  // 3. req.body로 수정할 내용 가져오기
  const { title, done, category, importance } = req.body as Partial<Todo>;
  if (title !== undefined) todo.title = title;
  if (done !== undefined) todo.done = done;
  if (category !== undefined) todo.category = category;
  if (importance !== undefined) todo.importance = importance;

  res.json(todo);
});

// DELETE /todos/:id
router.delete("/:id", (req, res) => {
  // 1. URL 에서 id 추출
  const id = Number(req.params.id);

  // 2. 해당 id의 index찾기
  const index = todos.findIndex((todo) => todo.id === id);

  // 3. 못 찾으면 에러 응답
  if (index === -1)
    return res.status(404).json({ message: "할 일을 찾을 수 없습니다." });

  todos.splice(index, 1);
  res.status(204).send();
});

// GET /todos/filter?importance=high&done=true
// 방법 1 . filter 메서드 사용
router.get("/filter/query", (req, res) => {
  const importance = req.query.importance as string | undefined;
  const done =
    req.query.done !== undefined ? req.query.done === "true" : undefined;

  const result: Todo[] = todos.filter((todo) => {
    const importanceResult = importance ? todo.importance === importance : true;
    const doneResult = done !== undefined ? todo.done === done : true;
    return importanceResult && doneResult;
  });

  res.json(result);
});

// 방법2 . filterBy 메서드 만들어서 사용
router.get("/filter/query", (req, res) => {
  const importance = req.query.importance as string | undefined;
  const done =
    req.query.done !== undefined ? req.query.done === "true" : undefined;

  const result = filterBy(todos, (todo) => {
    const importanceResult = importance ? todo.importance === importance : true;
    const doneResult = done !== undefined ? todo.done === done : true;
    return importanceResult && doneResult;
  });

  res.json(result);
});


export default router;
