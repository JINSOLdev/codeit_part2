import { RequestHandler } from "express";

// req.body.cont === string && 내용이 있다면 > req.valid = true
// 그렇지 않으면 > req.valid = false

// 방법 1
// export const validateMemo = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   next();
// };

// 방법 2
export const validateMemo: RequestHandler = (req, res, next) => {
  const { content } = req.body;
  if (typeof content !== "string" || !content) {
    req.valid = false
  } else {
    req.valid = true
  }
  next();
};
