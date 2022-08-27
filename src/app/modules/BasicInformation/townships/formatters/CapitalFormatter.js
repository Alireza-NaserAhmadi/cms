import React from "react";
import {
  StatusCssClasses,
  StatusTitles
} from "./Helper";

export const CapitalFormatter = (cellContent, row) => (

  <span
    className={`label label-lg label-light-${
      //  StatusCssClasses[row.is_active]
      row.IsCapital == 1 ? 'success' : 'warning'
      } label-inline`}
  >
    {
      row.IsCapital == 1 ? 'مرکز استان' : 'شهرستان'
    }
  </span>
);
