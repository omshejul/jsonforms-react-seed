import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, FormControlLabel, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { makeStyles } from '@mui/styles';
import Axios from 'axios';
import React, { Fragment, useState } from 'react';
import ReactJson from 'react-json-view';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import SaveIcon from '@mui/icons-material/Save';
import Container from '../../Components/Container/Container';
import ResponseModal from '../../Components/Modal/Modal';
import RatingControl from '../../Components/RatingControl/RatingControl';
import ratingControlTester from '../../Components/RatingControl/ratingControlTester';
import clearJsonData from './clearJsonData.json';
import initialJsonData from './initialJsonData.json';
import schema from './schema.json';
import uischema from './uischema.json';
import AllInboxIcon from '@mui/icons-material/AllInbox';

const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
];

const App: React.FC = () => {
  // USE STATES
  const theme = useTheme();
  const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(false);
  const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(false);
  const [displayRaw, setDisplayRaw] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState(
    'https://jsonplaceholder.typicode.com/posts'
  );
  const classes = useStyles();
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [data, setData] = useState<any>(initialJsonData);
  const [transformedData, setTransformedData] = useState({});

  // FUNCTIONS

  const clearData = () => {
    setData(clearJsonData);
    // setTransformedData({});
  };

  const handleChanges = (updatedData: any) => {
    setData(updatedData);
    setTransformedData(updatedData);
  };

  const sendJson = async ({
    api,
    loadingState,
  }: {
    api: string;
    loadingState: string;
  }) => {
    if (api) {
      setApiEndpoint(api);
    }
    setApiResponse(null);

    setLoadingStates((prev) => ({ ...prev, [loadingState]: true }));
    try {
      const useProxyForKnownCorsIssues = process.env.REACT_APP_ENV?"true":"false";
      console.log('useProxy:', useProxyForKnownCorsIssues);
      // const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = useProxyForKnownCorsIssues
        ? `${corsProxyUrl}${apiEndpoint}`
        : apiEndpoint;
      const response = await Axios.post(apiUrl, { data: transformedData });
      setApiResponse(response.data);

      console.log('Response:', response.data);
    } catch (error: any) {
      console.error('Error sending JSON:', error);
      setApiResponse(error);
    }
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [loadingState]: false }));
    }, 0);
  };

  return (
    <Container>
      <Fragment>
        <Typography
          variant='h4'
          margin={'1rem'}
          marginTop={'2rem'}
          justifyContent={'center'}
          alignItems={'center'}
          display={'flex'}
          textAlign={'center'}
          component='h4'
        >
          <AllInboxIcon fontSize='large' style={{ marginInlineEnd: '1rem' }} />{' '}
          Store Conversation
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
                      checked={displayRaw}
                      onChange={() => setDisplayRaw(!displayRaw)}
                      name='displayRaw'
                    />
                  }
                  label='Raw'
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '8px',
                  border: `1.7px solid ${
                    theme.palette.mode === 'dark' ? '#545454' : '#CBCBCB'
                  }`,
                }}
              >
                <ReactJson
                  style={{
                    display: `${displayRaw ? 'none' : 'block'}`,
                    backgroundColor: 'hsla(0, 0, 0, 0)',
                    padding: '1rem',
                    width: '100%',
                  }}
                  src={transformedData}
                  iconStyle='square'
                  collapseStringsAfterLength={50}
                  displayObjectSize={displayObjectSize}
                  theme={theme.palette.mode === 'dark' ? 'pop' : 'rjv-default'}
                  name={null}
                  enableClipboard={true}
                  displayDataTypes={displayDataTypes}
                  indentWidth={4}
                />
                <code
                  style={{
                    display: `${!displayRaw ? 'none' : 'block'}`,
                    padding: '1rem',
                  }}
                >
                  {JSON.stringify(transformedData, null, 2)}
                </code>
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
                loading={loadingStates.sendJsonLoading1}
                loadingPosition='end'
                onClick={() =>
                  sendJson({
                    api: 'https://dev.assisto.tech/utility/store_conversation',
                    loadingState: 'sendJsonLoading1',
                  })
                }
                endIcon={<SaveIcon />}
                className={classes.resetButton}
              >
                Store Conversation
              </LoadingButton>
              <LoadingButton
                variant='contained'
                color='primary'
                loading={loadingStates.sendJsonLoading2}
                loadingPosition='end'
                onClick={() =>
                  sendJson({
                    api: 'https://dev.assisto.tech/utility/process_text',
                    loadingState: 'sendJsonLoading2',
                  })
                }
                endIcon={<SpellcheckIcon />}
                className={classes.resetButton}
              >
                Process Text
              </LoadingButton>
              {apiResponse && (
                <>
                  <ResponseModal>
                    <h2>Response</h2>
                    <h3>
                      Endpoint: <code className='blue'>{apiEndpoint}</code>
                    </h3>

                    <ReactJson
                      style={{
                        backgroundColor: 'hsla(0, 0, 0, 0)',
                      }}
                      src={apiResponse}
                      iconStyle='square'
                      collapseStringsAfterLength={50}
                      displayObjectSize={displayObjectSize}
                      theme={
                        theme.palette.mode === 'dark' ? 'pop' : 'rjv-default'
                      }
                      name={null}
                      enableClipboard={true}
                      displayDataTypes={displayDataTypes}
                      indentWidth={4}
                    />
                  </ResponseModal>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    </Container>
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
