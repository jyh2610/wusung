import { DialogContent, CircularProgress, Dialog } from '@mui/material';
import React from 'react';

export function LoadingModal({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
}
