import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';

const AdminForm = ({ fields, defaultValues, onSubmit, submitLabel = 'Save' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth className="mb-4">
            <InputLabel>{field.label}</InputLabel>
            <Select {...register(field.name, field.rules)} label={field.label}>
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <p className="text-[#E83A17] text-sm mt-1">{errors[field.name].message}</p>
            )}
          </FormControl>
        );
      default:
        return (
          <TextField
            {...register(field.name, field.rules)}
            label={field.label}
            type={field.type || 'text'}
            fullWidth
            className="mb-4"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
          />
        );
    }
  };

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast.success(`${submitLabel} successful`);
    } catch (error) {
      toast.error(error.message || `${submitLabel} failed`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-2xl shadow-lg p-6">
      {fields.map((field) => (
        <div key={field.name}>{renderField(field)}</div>
      ))}
      <Button
        type="submit"
        className="bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white font-bold py-3 px-6 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transition-all duration-300"
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default AdminForm;