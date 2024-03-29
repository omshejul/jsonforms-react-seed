import { Fragment, useState, useMemo } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { rankWith, isControl, and, schemaMatches , JsonSchema} from '@jsonforms/core';


import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import { makeStyles } from '@mui/styles';

import ApiCallRenderer from './ApiCallRenderer'; // Import your custom renderer

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '1em',
    color: '#333',
    backgroundColor: '#eee',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
});

const initialData = {
  Question: {
    content: 'What is the capital of France?',
  },
  Conditions: {
    PreCondition: 'user_input.length > 0',
    PreConditionError: 'Input cannot be empty',
    PostCondition: "user_input === 'Paris'",
    PostConditionError: 'Wrong answer. The correct answer is Paris.',
  },
  NextNode: {
    ValueCheck: "user_input.startsWith('P')",
    Next: 'If condition is true, navigate to the next node',
  },
  APIs: [
    {
      Endpoint: 'https://api.example.com/data',
      Method: 'GET',
      Params: ['param1', 'param2'],
    },
  ],
  Functions: [
    {
      Input: 'data from previous step',
      Output: 'processed data',
    },
  ],
  ExecutionOrder: [
    {
      Type: 'Condition',
      Name: 'Check Input Length',
      Input: 'user_input',
      EvaluationFunction: 'lengthCheck',
    },
    {
      Type: 'API Request',
      Name: 'Fetch Data',
      Input: 'Query Params',
      EvaluationFunction: 'fetchData',
    },
  ],
};


const apiCallRendererTester = rankWith(
  1000, // High priority to override default renderers
  and(
    isControl, // Ensure it's a control element
    schemaMatches((schema: JsonSchema, rootSchema: JsonSchema) => {
      const matches = typeof schema.type === 'string' && 
                      schema.type === 'object' && 
                      schema.properties !== undefined && 
                      'Endpoint' in schema.properties;
      console.log(`Testing schema for API call renderer: ${matches}`, schema);
      return matches;
    })
  )
);




const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: apiCallRendererTester, renderer: ApiCallRenderer }, // Include your custom renderer
];

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState<any>(initialData);
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const clearData = () => {
    setData({});
  };

  return (
    <Fragment>
      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={6}>
          <Typography variant={'h4'} className={classes.title}>
            Bound data
          </Typography>
          <div className={classes.dataContent}>
            <pre id='boundData'>{stringifiedData}</pre>
          </div>
          <Button
            className={classes.resetButton}
            onClick={clearData}
            color='primary'
            variant='contained'
          >
            Clear data
          </Button>
        </Grid>
        <Grid item sm={6}>
          <Typography variant={'h4'} className={classes.title}>
            Rendered form
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setData(data)}
            />
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;

