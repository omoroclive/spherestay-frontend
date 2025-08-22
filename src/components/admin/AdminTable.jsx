import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { IconButton } from '@mui/material';
import { toast } from 'react-toastify';

const AdminTable = ({ rows, columns, actions = {}, pageSize = 10, onRowClick }) => {
  const defaultActions = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          {actions.edit && (
            <IconButton onClick={() => actions.edit(params.row)}>
              <FaEdit className="text-[#006644]" />
            </IconButton>
          )}
          {actions.delete && (
            <IconButton onClick={() => actions.delete(params.row)}>
              <FaTrash className="text-[#E83A17]" />
            </IconButton>
          )}
          {actions.verify && (
            <IconButton onClick={() => actions.verify(params.row)}>
              <FaCheckCircle className="text-[#006644]" />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <DataGrid
        rows={rows}
        columns={[...columns, ...(Object.keys(actions).length ? defaultActions : [])]}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
        disableSelectionOnClick
        onRowClick={onRowClick}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f3f4f6',
            color: '#006644',
          },
          '& .MuiDataGrid-cell': {
            color: '#374151',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f9fafb',
          },
        }}
      />
    </div>
  );
};

export default AdminTable;