import React from "react";
import {
  StatusCssClasses,
  StatusTitles
} from "./Helper";

export const DirectionFormatter = (cellContent, row) => (

  <span

  >
    {
      (row.Direction.directionSource.title ? row.Direction.directionSource.title : 'نامشخص') + " به  " + (row.Direction.directionDest.title ? row.Direction.directionDest.title : 'نامشخص')
    }
  </span>
);
