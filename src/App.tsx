import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box, Button, FormControlLabel, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Switch from '@mui/material/Switch';
import { Fragment, useMemo, useState } from 'react';
import './App.css';
import ApiCustomRender from './Components/ApiCustomRender';
import { customControlWithButtonTester } from './Components/testers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import schema from './schema.json';
import uischema from './uischema.json';
// import schema from './schema copy.json';
// import uischema from './uischema copy.json';
import ReactJson from 'react-json-view';
const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: customControlWithButtonTester, renderer: ApiCustomRender },
];

const App: React.FC = () => {
  const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(false);
  const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>('eighties');
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
          <div className={classes.dataContent}>
            <Box>
              <FormControlLabel
                sx={formControlLabelStyle}
                control={
                  <Switch
                    checked={displayObjectSize}
                    onChange={() => setDisplayObjectSize(!displayObjectSize)}
                    name='displayObjectSize'
                  />
                }
                label='Object Size'
              />
              <FormControlLabel
                sx={formControlLabelStyle}
                control={
                  <Switch
                    checked={displayDataTypes}
                    onChange={() => setDisplayDataTypes(!displayDataTypes)}
                    name='displayDataTypes'
                  />
                }
                label='Data Types'
              />
              <FormControlLabel
                sx={formControlLabelStyle}
                control={
                  <Switch
                    checked={theme === 'eighties'}
                    onChange={() =>
                      setTheme(
                        theme === 'rjv-default' ? 'eighties' : 'rjv-default'
                      )
                    }
                    name='theme'
                  />
                }
                label='Dark Theme'
              />
            </Box>
            <Box
              sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                border: '2px solid #9fabc4',
              }}
            >
              <ReactJson
                style={{ padding: '1rem', width: '100%' }}
                src={JSON.parse(stringifiedData)}
                iconStyle='square'
                collapseStringsAfterLength={50}
                displayObjectSize={displayObjectSize}
                theme={theme}
                name={null}
                enableClipboard={true}
                displayDataTypes={displayDataTypes}
                indentWidth={1}
              />
            </Box>
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

const formControlLabelStyle = {
  border: '1px solid #ccc',
  borderRadius: '6px',
  margin: '4px',
  marginBottom: '16px',
  padding: '4px 16px 4px 4px',
};

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
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'start',
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
  goal_name: 'Eastman_bot',
  client_id: '88',
  language: 'en',
  message: '',
  question: 'What is the capital of France?',
  switch_language: true,

  forms: [
    {
      form_name: 'Form 1',

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
            condition_type: '',
            value_match: 'sales',
            next_node: 'If condition is true, navigate to the next_node node',
          },
        ],
        closing_message: false,
        error_message: 'err',
      },
    },
  ],
};
// const initialData = {};

interface Api {
  Name: string;
  Endpoint: string;
  Method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  Params?: { [key: string]: any };
  Headers?: Record<string, string>;
}
