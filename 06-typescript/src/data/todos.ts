import { Todo, Importance } from "../types/todo";

export let todos: Todo[] = [
  { id: 1, title: "공부하기", done: false, category: "공부", importance: Importance.HIGH },
  { id: 2, title: "운동하기", done: true, category: "건강", importance: Importance.MEDIUM }
];