import React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
import { Button, TextField, Grid } from '@mui/material';

const ApiCallRenderer = ({ data, handleChange, path }: ControlProps) => {
  const runApi = () => {
    console.log('Running API with data:', data);
  };

  return (
    <Grid container spacing={2} alignItems="flex-end">
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Endpoint"
          value={data.Endpoint || ''}
          onChange={(e) => handleChange(path, { ...data, Endpoint: e.target.value })}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Method"
          value={data.Method || ''}
          onChange={(e) => handleChange(path, { ...data, Method: e.target.value })}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Parameters"
          value={data.Params || ''}
          onChange={(e) => handleChange(path, { ...data, Params: e.target.value.split(',') })}
          variant="outlined"
          helperText="Comma-separated parameters"
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={runApi} variant="contained" color="primary">
          Run API
        </Button>
      </Grid>
    </Grid>
  );
};

export default withJsonFormsControlProps(ApiCallRenderer);
