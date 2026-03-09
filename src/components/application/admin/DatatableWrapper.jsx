'use client'
import { ThemeProvider } from '@mui/material'
import React, { useState } from 'react'
import DataTable from './Datatable'
import { useTheme } from 'next-themes'
import { darkTheme, lightTheme } from '@/lib/materialTheme'

const DatatableWrapper = ({
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
  const {resolvedTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  React.useEffect(() => {    setMounted(true)
  }, [])
  if (!mounted) return null
  return (
    <ThemeProvider theme={resolvedTheme === 'dark'?darkTheme:lightTheme}>
      <DataTable
        querykey={querykey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </ThemeProvider>
  )
}

export default DatatableWrapper