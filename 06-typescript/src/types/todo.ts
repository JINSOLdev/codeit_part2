enum Importance {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

interface Todo {
  id: number;
  title: string;
  done: boolean;
  category: string;
  importance: Importance;
}

type TodoPreview = Pick<Todo, "title" | "done">; // 타입스크립트의 utility type

export { Importance, Todo, TodoPreview };
