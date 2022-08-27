import React from "react";
import {
  StatusCssClasses,
  StatusTitles
} from "./Helper";

export const TimeFormatter = (cellContent, row) => (

  <span

  >
    {
      row.durationOverDistance ? row.durationOverDistance + " دقیقه " : 0
    }
  </span>
);
