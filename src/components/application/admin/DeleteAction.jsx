import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Delete } from "@mui/icons-material";
const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <MenuItem key="delete" onClick={()=>handleDelete([row.original._id], deleteType)}>
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Delete
    </MenuItem>
  );
};

export default DeleteAction;
