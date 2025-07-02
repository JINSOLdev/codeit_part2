import express from "express";

declare global {
  namespace Express {
    interface Request {
      valid?: boolean;    // 핵심!
    }
  }
}

