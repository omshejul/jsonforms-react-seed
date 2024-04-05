import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Grid,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Axios from 'axios';
import Switch from '@mui/material/Switch';
import { makeStyles } from '@mui/styles';
import React, { Fragment, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import './App.css';
import ApiCustomRender from './Components/ApiCustomRender';
import Container from './Components/Container';
import { customControlWithButtonTester } from './Components/testers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import schema from './schema.json';
import uischema from './uischema.json';
const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: customControlWithButtonTester, renderer: ApiCustomRender },
];

const App: React.FC = () => {
  // USE STATES
  const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(false);
  const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(false);
  const [theme, setTheme] = useState<boolean>(
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const classes = useStyles();
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [data, setData] = useState<any>(initialData);
  const [transformedData, setTransformedData] = useState({});

  //EFFECTS
  useEffect(() => {
    const themeListener = (e: MediaQueryListEvent) => {
      setTheme(e.matches);
    };

    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    matcher.addEventListener('change', themeListener);

    return () => {
      matcher.removeEventListener('change', themeListener);
    };
  }, []);
  // FUNCTIONS
  const themeProvider = createTheme({
    palette: {
      mode: theme ? 'dark' : 'light',
      ...(theme && {
        primary: {
          main: '#65baff',
        },
        error: {
          main: 'rgb(255, 118, 111)',
        },
        background: {
          default: '#22272E',
          paper: '#181f27',
        },
      }),
    },
    components: {
      MuiFormControl: {
        styleOverrides: {
          root: {
            margin: '0.8rem 0',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 0px 0px 1px hsla(0, 0%, 50%, 0.3)',
          },
        },
      },
    },
  });

  const clearData = () => {
    setData({});
    setTransformedData({});
  };
  const formatNextNodeKeys = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(formatNextNodeKeys);
    } else if (typeof data === 'object' && data !== null) {
      const formattedObject: any = {};
      Object.keys(data).forEach((key) => {
        if (key === 'next_node' && typeof data[key] === 'string') {
          formattedObject[key] = data[key].toLowerCase().replace(/\s+/g, '-');
        } else if (key === 'next_node' && Array.isArray(data[key])) {
          formattedObject[key] = formatNextNodeKeys(data[key]);
        } else {
          formattedObject[key] = formatNextNodeKeys(data[key]);
        }
      });
      return formattedObject;
    }
    return data;
  };

  const handleChanges = (updatedData: any) => {
    setData(updatedData);
    setTransformedData(updatedData);
    console.log('Original data:', updatedData);
    if (updatedData.slots) {
      const transformedSlots = updatedData.slots.reduce(
        (acc: any, slot: any) => {
          const slotName = slot.form_name || 'name-not-specified';
          const transformedSlotName = slotName
            .toLowerCase()
            .replace(/\s+/g, '-');

          const formattedFormData = formatNextNodeKeys(slot.form_data);

          acc[transformedSlotName] = { ...formattedFormData };

          return acc;
        },
        {}
      );

      const tempTransformedData = {
        ...updatedData,
        slots: transformedSlots,
      };

      setTransformedData(tempTransformedData);
      console.log('Transformed data:', tempTransformedData);
    }
  };

  const sendJson = async () => {
    setLoadingStates((prev) => ({ ...prev, sendJsonLoading: true }));
    console.log('sending json', loadingStates);
    try {
      const response = await Axios.post('http://localhost:3030/data', transformedData);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending JSON:', error);
    }
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, sendJsonLoading: false }));
    }, 1000)
  };

  return (
    <ThemeProvider theme={themeProvider}>
      <CssBaseline />
      <Container>
        <Fragment>
          <Typography
            variant='h4'
            margin={'1rem'}
            marginTop={'2rem'}
            justifyContent={'center'}
            textAlign={'center'}
            component='h4'
          >
            Dialogue Manager 💬
          </Typography>

          <Grid
            container
            justifyContent={'center'}
            spacing={1}
            className={classes.container}
          >
            <Grid item xs={12} lg={6}>
              <div className={classes.form}>
                {/* {console.log(data)} */}
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
                        onChange={() =>
                          setDisplayObjectSize(!displayObjectSize)
                        }
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
                        checked={theme}
                        onChange={() => setTheme(!theme)}
                        name='theme'
                      />
                    }
                    label='Dark Theme'
                  />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    overflowX: 'scroll',
                    scrollbarWidth: 'none',
                    borderRadius: '8px',
                    border: `1.7px solid ${theme ? '#545454' : '#CBCBCB'}`,
                  }}
                >
                  <ReactJson
                    style={{
                      backgroundColor: 'hsla(0, 0, 0, 0)',
                      padding: '1rem',
                      width: '100%',
                    }}
                    src={transformedData}
                    iconStyle='square'
                    collapseStringsAfterLength={50}
                    displayObjectSize={displayObjectSize}
                    theme={theme ? 'pop' : 'rjv-default'}
                    name={null}
                    enableClipboard={true}
                    displayDataTypes={displayDataTypes}
                    indentWidth={4}
                  />
                </Box>
              </div>
              <Grid container>
                <Button
                  className={classes.resetButton}
                  onClick={clearData}
                  color='error'
                  variant='contained'
                  endIcon={<DeleteIcon />}
                >
                  Clear data
                </Button>
                <LoadingButton
                  variant='contained'
                  color='primary'
                  loading={loadingStates.sendJsonLoading}
                  loadingPosition='end'
                  onClick={() => sendJson()}
                  endIcon={<SendIcon />}
                  className={classes.resetButton}
                >
                  Send data
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Fragment>
      </Container>
    </ThemeProvider>
  );
};

export default App;

const formControlLabelStyle = {
  border: '1px solid rgba(126, 126, 126, 0.239)',
  borderRadius: '6px',
  margin: '0px 16px 16px 0px',
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
    maxWidth: '100vw',
    padding: '1rem',
    justifyContent: 'start',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    // display: 'block !important',
    marginBottom: '2rem !important',
  },
  form: {
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

  slots: [
    {
      form_name: 'Form 1',

      form_data: {
        question: 'What is the capital of France?',
        bot_message: 'question',
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
            error_message: '',
          },
        ],
        functions: [
          {
            name: 'GetNumber',
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
          },
        ],
        next_node: [
          {
            name: 'node 1',
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
