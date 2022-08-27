import React from "react";
import { StatusCssClasses, StatusTitles } from "./Helper";
import { Avatar, Chip } from "@material-ui/core";

export const DistanceFormatter = (cellContent, row) => (
  <span>
    {row.distanceFromSource ? row.distanceFromSource + " کیلومتر " : 0}
  </span>
);
