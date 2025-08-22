import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success(`${title} successful`);
      onClose();
    } catch (error) {
      toast.error(error.message || `${title} failed`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex items-center gap-2">
        <FaExclamationTriangle className="text-[#E83A17]" />
        {title}
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-600">{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="text-gray-600">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          className="bg-[#E83A17] text-white hover:bg-[#c53214]"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;