import { JsonForms } from '@jsonforms/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Fragment, useMemo, useState } from 'react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import axios from 'axios';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import { makeStyles } from '@mui/styles';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import RenderButton from './Components/RenderButton';
import { Description } from '@mui/icons-material';
import { error } from 'console';

const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
];

const App: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState<any>(initialData);
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const [apiResults, setApiResults] = useState<Record<string, any>>({});

  const runApi = async (api: Api, index: number) => {
    let params = {};
    const useProxyForKnownCorsIssues = true;
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = useProxyForKnownCorsIssues
      ? `${corsProxyUrl}${api.Endpoint}`
      : api.Endpoint;

    if (api.Params && Array.isArray(api.Params)) {
      params = api.Params.reduce(
        (
          acc: Record<string, string>,
          param: { key: string; value: string }
        ) => {
          acc[param.key] = param.value;
          return acc;
        },
        {}
      );
    }

    try {
      const response = await axios({
        method: api.Method.toLowerCase(),
        url: apiUrl,
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setApiResults((prevResults) => ({
        ...prevResults,
        [index]: response.data,
      }));
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const clearData = () => {
    setData({});
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography className={classes.heading}>
          {data.formName ? data.formName :"Form 1"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Fragment>
          <Grid
            container
            justifyContent={'center'}
            spacing={1}
            className={classes.container}
          >
            <Grid item xs={12} lg={6}>
              <Typography variant={'h4'} className={classes.title}>
                Rendered form
              </Typography>
              <div className={classes.demoform}>
                {console.log(data)}
                <JsonForms
                  schema={schema}
                  uischema={uischema}
                  data={data}
                  renderers={renderers}
                  cells={materialCells}
                  onChange={({ errors, data }) => setData(data)}
                />
                {/* Test APIs Section */}

                {data.APIs && data.APIs.length > 0 && (
                  <>
                    <Typography
                      variant='h4'
                      style={{ textAlign: 'center', margin: '20px 0' }}
                    >
                      Test APIs
                    </Typography>

                    {data.APIs.map((api: Api, index: number) => (
                      <Grid item key={index}>
                        <Card>
                          <CardContent>
                            <Typography variant='h6'>
                              API {index + 1}: {api.Name}
                            </Typography>
                            <Typography variant='body2'>
                              Endpoint: {api.Endpoint}
                            </Typography>
                            <Typography variant='body2'>
                              Method: {api.Method}
                            </Typography>
                            <Button
                              variant='contained'
                              onClick={() => runApi(api, index)}
                              style={{ marginTop: '10px' }}
                            >
                              Run API {index + 1}
                            </Button>
                          </CardContent>
                        </Card>
                        <div className='apiResultsBTN'>
                          {apiResults[index] && (
                            <Card style={{ marginTop: '10px' }}>
                              <CardContent>
                                <Typography variant='h6'>
                                  Results from API {index + 1}:
                                </Typography>
                                {/* {console.log("api result",apiResults[index])} */}
                                {RenderButton(apiResults[index])}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                        <div>
                          {apiResults[index] && (
                            <Card style={{ marginTop: '10px' }}>
                              <CardContent>
                                <Typography variant='h6'>
                                  Results JSON from API {index + 1}:
                                </Typography>
                                <pre className={classes.apiResultsJSON}>
                                  {JSON.stringify(apiResults[index], null, 2)}
                                </pre>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </Grid>
                    ))}
                  </>
                )}
                {/* Test APIs Section */}
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
      </AccordionDetails>
    </Accordion>
  );
};

export default App;

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
  formName: '',
  formData: {
    question: 'What is the capital of France?',
    response: '',
    Conditions: {
      PreCondition: 'user_input.length > 0',
      PreConditionError: 'Input cannot be empty',
      PostCondition: "user_input === 'Paris'",
      PostConditionError: 'Wrong answer. The correct answer is Paris.',
    },
    APIs: [
      {
        Name: 'Some Name',
        Endpoint: 'https://httpbin.org/get',
        Method: 'GET',
        Params: [
          {
            key: 'param1',
            value: 'value1',
          },
        ],
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
    NextNodes: [
      {
        valueCheck: "user_input.startsWith('P')",
        next: 'If condition is true, navigate to the next node',
        condition: '',
      },
    ],
  },
};

interface Api {
  Name: string;
  Endpoint: string;
  Method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  Params?: { [key: string]: any };
  Headers?: Record<string, string>;
}
