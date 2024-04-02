import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { Fragment, useMemo, useState } from 'react';
import './App.css';
import CustomControlWithButton from './Components/CustomControlWithButton';
import { customControlWithButtonTester } from './Components/testers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import schema from './schema.json';
import uischema from './uischema.json';

const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: customControlWithButtonTester, renderer: CustomControlWithButton },
];

const App: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState<any>(initialData);
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const [transformedData, setTransformedData] = useState({});

  const clearData = () => {
    setData({});
  };
  const handleChanges = (updatedData: any) => {
    setData(updatedData);
    const tempTransformedData = updatedData.forms.map((form: any) => ({
      [form.formName]: form.formData,
    }));

    setTransformedData({ forms: tempTransformedData });
    console.log('Transformed data where formName is key:', transformedData);
  };

  return (
    <Fragment>
      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item xs={12} lg={6}>
          <div className={classes.demoform}>
            {console.log(data)}
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => handleChanges(data)}
            />
          </div>
        </Grid>
        <Grid item xs={12} lg={6}>
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
      </Grid>
    </Fragment>
  );
};

export default App;

const useStyles = makeStyles({
  container: {
    padding: '.0em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    padding: '1em',
    width: '100%',
    justifyContent: 'start',
    borderRadius: '5px',
    color: '#202020',
    backgroundColor: 'hsl(0, 0%, 98%)',
    border: '1px solid #ccc',
    marginBottom: '1rem',
    overflowX: 'scroll',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
  heading: {
    fontSize: '1.25rem',
  },
  apiResults: {
    display: 'flex',
  },
  apiResultsJSON: {
    overflowX: 'scroll',
  },
});

const initialData = {
  forms: [
    {
      form_name: 'Form 1',
      goal_name: "Eastman_bot",
      client_id: "88",
      language: "en",
      message: "",
      switch_language: true,
  
      form_data: {
        question: 'What is the capital of France?',
        response: '',
        conditions: {
          pre_condition: 'user_input.length > 0',
          pre_condition_error: 'Input cannot be empty',
          post_condition: "user_input === 'Paris'",
          post_condition_error: 'Wrong answer. The correct answer is Paris.',
        },
        apis: [
          {
            name: 'Some Name',
            endpoint: 'https://httpbin.org/get',
            method: 'GET',
            params: [
              {
                key: 'param1',
                value: 'value1',
              },
            ],
          },
        ],
        functions: [
          {
            input: 'data from previous step',
            output: 'processed data',
            description: 'Some Description',
          },
        ],
        execution_order: [
          {
            type: 'API',
            name: 'Check Input Length',
            input: 'user_input',
            evaluation_function: 'lengthCheck',
          },
          {
            type: 'FUNCTION',
            name: 'Fetch Data',
            input: 'Query Params',
            evaluation_function: 'fetchData',
          },
        ],
        next_node: [
          {
            value_to_check: "user_input.startsWith('P')",
            next_node: 'If condition is true, navigate to the next_node node',
            condition_type: '',
          },
        ],
        closing_message: 'TRUE',
        error_message: 'err',
      },
    },
  ],
};

interface Api {
  Name: string;
  Endpoint: string;
  Method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  Params?: { [key: string]: any };
  Headers?: Record<string, string>;
}
