import express from "express";

declare global {
  namespace Express {
    interface Request {
      user_id: string;
    }
  }
}
