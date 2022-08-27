import React from "react";
import {
  StatusCssClasses,
  StatusTitles
} from "./Helper";
import { Avatar, Chip } from "@material-ui/core";

export const DistanceFormatter = (cellContent, row) => (

  <span

  >
    {
      row.distance ? row.distance + " کیلومتر " : 0
    }
  </span>




);
