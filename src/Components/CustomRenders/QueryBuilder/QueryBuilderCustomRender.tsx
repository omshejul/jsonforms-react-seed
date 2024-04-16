import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import QueryBuilder, { Operator } from 'react-querybuilder';

// import 'react-querybuilder/dist/query-builder.css';
import './default.css';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const operators = [
  { name: 'equals', label: '=' },
  { name: 'notEquals', label: '≠' },
  { name: 'greaterThan', label: '>' },
  { name: 'lessThan', label: '<' },
  { name: 'greaterThanOrEqual', label: '≥' },
  { name: 'lessThanOrEqual', label: '≤' },
  { name: 'contains', label: 'Contains' },
  { name: 'beginsWith', label: 'Begins With' },
  { name: 'endsWith', label: 'Ends With' },
  { name: 'doesNotContain', label: 'Does Not Contain' },
  { name: 'doesNotBeginWith', label: 'Does Not Begin With' },
  { name: 'doesNotEndWith', label: 'Does Not End With' },
  { name: 'isNull', label: 'Is Null' },
  { name: 'isNotNull', label: 'Is Not Null' },
  { name: 'in', label: 'In' },
  { name: 'notIn', label: 'Not In' },
  { name: 'between', label: 'Between' },
  { name: 'notBetween', label: 'Not Between' },
];

const combinators = [
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' },
  { name: 'not', label: 'NOT' },
];

const QueryBuilderCustomRender: React.FC<ControlProps> = ({
  data,
  handleChange,
  path,
}) => {
  const fields = useMemo(
    () => [
      { name: 'firstName', label: 'First Name', type: 'string' },
      { name: 'age', label: 'Age', type: 'number' },
      { name: 'isActive', label: 'Is Active', type: 'boolean' },
    ],
    []
  );

  const initialData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const onQueryChange = (query: any) => {
    handleChange(path, query);
  };
  const controlElements = {
    addGroupAction: (props: any) => (
      <Tooltip title={'Add new Group'}>
        <Button
          color={'success'}
          className='flexCenter'
          onClick={props.handleOnClick}
          aria-label='add group'
        >
          <AddCircleOutlineIcon  sx={{marginInlineEnd:"0.25rem"}}/>
          <span style={{ fontSize: 'small' }}>Group</span>
        </Button>
      </Tooltip>
    ),
    addRuleAction: (props: any) => (
      <Tooltip title={'Add new Rule'}>
        <Button
          className='flexCenter'
          onClick={props.handleOnClick}
          aria-label='add rule'
        >
          <AddCircleOutlineIcon sx={{marginInlineEnd:"0.25rem"}} />
          <span style={{ fontSize: 'small' }}>Rule</span>
        </Button>
      </Tooltip>
    ),
    removeGroupAction: (props: any) => (
      //add tooltip
      <Tooltip title={'Remove Group'}>
        <Button
          color={'error'}
          className='flexCenter'
          onClick={props.handleOnClick}
          aria-label='remove group'
        >
          <RemoveCircleOutlineIcon  sx={{marginInlineEnd:"0.25rem"}}/>
          <span style={{ fontSize: 'small' }}>Group</span>
        </Button>
      </Tooltip>
    ),
    removeRuleAction: (props: any) => (
      <Button
        color={'error'}
        className='flexCenter'
        sx={{ borderRadius: '50vw', aspectRatio: '1', margin: '0' }}
        onClick={props.handleOnClick}
        aria-label='remove rule'
      >
        <RemoveCircleOutlineIcon />
      </Button>
    ),
    valueEditor: (props: any) => (
      <TextField
        fullWidth
        sx={{ marginInlineEnd: '0.5rem' }}
        label='Value'
        value={props.value}
        onChange={(e) => props.handleOnChange(e.target.value)}
        type='text'
      />
    ),
    fieldSelector: ({ field, handleOnChange }: any) => (
      <FormControl fullWidth sx={{ marginInlineEnd: '0.5rem' }}>
        <InputLabel id='field-selector-label'>Field</InputLabel>
        <Select
          labelId='field-selector-label'
          value={field}
          onChange={(e) => handleOnChange(e.target.value)}
          label='Field'
        >
          {fields.map((f) => (
            <MenuItem key={f.name} value={f.name}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),

    operatorSelector: (props?: any) => (
      <FormControl fullWidth sx={{ marginInlineEnd: '0.5rem' }}>
        <InputLabel id='operator-selector-label'>Operator</InputLabel>
        <Select
          labelId='operator-selector-label'
          value={props.value}
          onChange={(e) => props.handleOnChange(e.target.value)}
          label='Operator'
        >
          {operators.map((op: Operator) => (
            <MenuItem key={op.name} value={op.name}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    // combinatorSelector : ({ combinator, handleOnChange }:any) => (
    //   <FormControl fullWidth sx={{ marginInlineEnd: '0.5rem' }}>
    //     <InputLabel id="combinator-selector-label">Combinator</InputLabel>
    //     <Select
    //       labelId="combinator-selector-label"
    //       value={combinator}
    //       onChange={e => handleOnChange(e.target.value)}
    //       label="Combinator"
    //     >
    //       {combinators.map((c) => (
    //         <MenuItem key={c.name} value={c.name}>{c.label}</MenuItem>
    //       ))}
    //     </Select>
    //   </FormControl>
    //   )
  }

  return (
    <>
      <Grid container >
        <Typography variant='h6'>Pre Condition</Typography>
        <Box >
          <QueryBuilder
            fields={fields}
            // query={initialData}
            onQueryChange={onQueryChange}
            controlElements={controlElements}
            // combinators={combinators}
          />
        </Box>
      </Grid>
    </>
  );
};

export default withJsonFormsControlProps(QueryBuilderCustomRender);
