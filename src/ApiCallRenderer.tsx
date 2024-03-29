import React, { useState } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
import { Button, TextField, CircularProgress } from '@mui/material';

interface ApiData {
  Endpoint: string;
  Method: string;
  Params: string[];
  Result?: any; // Replace with your actual result type if possible
}

const ApiCallRenderer = ({ data, handleChange, path }: ControlProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(data.Endpoint, {
        method: data.Method,
        // Include other settings like headers, body, params as needed
      });
      if (!response.ok) throw new Error(`API call failed: ${response.statusText}`);
      const result = await response.json();
      handleChange(path, { ...data, Result: result });
  } catch (err) { 
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <TextField
        value={data.Endpoint || ''}
        onChange={(e) => handleChange(path, { ...data, Endpoint: e.target.value })}
        label="API Endpoint"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        value={data.Method || ''}
        onChange={(e) => handleChange(path, { ...data, Method: e.target.value })}
        label="Method"
        variant="outlined"
        select
        SelectProps={{
          native: true,
        }}
        fullWidth
        margin="normal"
      >
        <option value="">Choose Method</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </TextField>
      {/* Handling Params as a simple text field for now, could be improved for multiple params */}
      <TextField
        value={data.Params && data.Params.join(', ')}
        onChange={(e) => handleChange(path, { ...data, Params: e.target.value.split(', ') })}
        label="Parameters (comma separated)"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button onClick={handleApiCall} variant="contained" color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Run API'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Optionally display the result */}
      {data.Result && <pre>{JSON.stringify(data.Result, null, 2)}</pre>}
    </div>
  );
};

export default withJsonFormsControlProps(ApiCallRenderer);
