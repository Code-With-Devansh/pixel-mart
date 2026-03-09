import { IconButton, Tooltip } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Link from "next/link";
import React, { useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrasIcon from "@mui/icons-material/RestoreFromTrash";
import { DeleteForever } from "@mui/icons-material";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";
import { SaveAlt } from "@mui/icons-material";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";
const DataTable = ({
  querykey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [querykey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`,
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);
      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useDeleteMutation(querykey, deleteEndpoint);

  const handleExport = async (rows) => {
    setExportLoading(true);

    const filename = `export-${querykey}-${Date.now()}`;

    const csvConfig = mkConfig({
      fieldSeparator: ",",
      decimalSeparator: ".",
      useKeysAsHeaders: true,
      filename,
    });

    try {
      let rowData;

      if (rows?.length > 0) {
        // Export selected rows
        rowData = rows.map((row) => row.original);
      } else {
        // Export all data
        const { data: response } = await axios.get(exportEndpoint);

        if (!response?.success) {
          throw new Error(response?.message || "Export failed");
        }

        rowData = response.data;
      }

      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv); // ← most export-to-csv libs expect (config)(csv), not (csv, filename)
      showToast("success", "Export successful.");
    } catch (error) {
      console.error("Export error:", error);
      showToast("error", error.message || "Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDelete = (ids, deleteType) => {
    let c;
    if (deleteType === "PD") {
      c = confirm("Are you sure. You want to delete data permanently?");
    } else {
      c = confirm("Are you sure. You want to move data to trash?");
    }
    if (c) {
      deleteMutation.mutate({ ids, deleteType });
      setRowSelection({});
    }
  };

  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },
    getRowId: (originalRow) => originalRow._id,
    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* built in buttons */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {deleteType == "SD" && (
          <>
            <Tooltip title="Delete All">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), deleteType)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        {deleteType == "PD" && (
          <>
            <Tooltip title="Restore Data">
              <IconButton
                onClick={() => handleDelete(Object.keys(rowSelection), "RSD")}
              >
                <RestoreFromTrasIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Permanently Delete Data">
              <IconButton
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), deleteType)
                }
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip>
        <ButtonLoading
          type="button"
          className="cursor-pointer"
          text={
            <>
              <SaveAlt fontSize="25" />
              Export
            </>
          }
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        />
      </Tooltip>
    ),
  });
  return <MaterialReactTable table={table} />;
};

export default DataTable;
