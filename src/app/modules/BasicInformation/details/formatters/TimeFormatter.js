import React from "react";
import { StatusCssClasses, StatusTitles } from "./Helper";

export const TimeFormatter = (cellContent, row) => (
  <span>{row.duration ? row.duration + " دقیقه " : 0}</span>
);
