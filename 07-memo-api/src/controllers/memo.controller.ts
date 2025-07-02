import { Request, Response } from "express";
import { Memo } from "../types/memo";
import { memos } from "../data/memo";

// GET /memos
export const getMemos = (req: Request, res: Response) => {
  res.status(200).json(getMemos);
};

// POST /memos
export const createMemo = (req: Request, res: Response) => {
  if (!req.valid) {
    return res.status(400).json({message: "Invalid request"})
  }
  
  const { content } = req.body as Partial<Memo>;

  // 1. newMemo 만들기
  const newMemo: Memo = {
    id: Date.now(),
    content: content || "New memo",
  };

  // 2. memos에 newMemo 추가하기
  memos.push(newMemo);
  res.status(201).json({ message: "메모 작성 성공", data: newMemo });
};
