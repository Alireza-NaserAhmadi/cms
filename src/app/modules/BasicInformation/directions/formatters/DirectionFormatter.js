import React from "react";
import { StatusCssClasses, StatusTitles } from "./Helper";

export const DirectionFormatter = (cellContent, row) => (
  <span>
    {(row.directionSource.title ? row.directionSource.title : "نامشخص") +
      " به  " +
      (row.directionDest.title ? row.directionDest.title : "نامشخص")}
  </span>
);
