import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Edit } from "@mui/icons-material";
const EditAction = ({ href }) => {
  return (
    <MenuItem key="edit">
      <Link href={href}>
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </Link>
    </MenuItem>
  );
};

export default EditAction;
