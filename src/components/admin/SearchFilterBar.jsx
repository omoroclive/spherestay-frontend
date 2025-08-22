import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

const SearchFilterBar = ({ search, setSearch, filters, onFilterChange, onReset }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <TextField
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
        InputProps={{
          startAdornment: <FaSearch className="text-[#006644] mr-2" />,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '9999px',
            backgroundColor: '#f3f4f6',
          },
        }}
      />
      {filters.map((filter) => (
        <FormControl key={filter.name} className="w-full md:w-40">
          <InputLabel>{filter.label}</InputLabel>
          <Select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.name, e.target.value)}
            label={filter.label}
          >
            {filter.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Button
        onClick={onReset}
        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
      >
        Reset
      </Button>
    </div>
  );
};

export default SearchFilterBar;