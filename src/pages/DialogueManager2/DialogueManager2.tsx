import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DoneIcon from '@mui/icons-material/Done';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Backdrop, Box, Button, FormControlLabel, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { makeStyles } from '@mui/styles';
import Axios from 'axios';
import React, { Fragment, useState } from 'react';
import ReactJson from 'react-json-view';
import Container from '../../Components/Container/Container';
import ApiCustomRender from '../../Components/CustomRenders/ApiComponents/ApiCustomRender';
import { customControlWithButtonTester } from '../../Components/CustomRenders/ApiComponents/testers';
import ResponseModal from '../../Components/Modal/Modal';
import RatingControl from '../../Components/RatingControl/RatingControl';
import ratingControlTester from '../../Components/RatingControl/ratingControlTester';
import { ArrayToObject } from '../../Components/Utility/ArrToObj';
import clearJsonData from './clearJsonData.json';
import initialJsonData from './initialJsonData2.json';
import initialJsonDataFull from './initialJsonDataFull.json';
import initialSchema from './schema.json';
import uischema from './uischema.json';

const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: customControlWithButtonTester, renderer: ApiCustomRender },
  // { tester: queryBuilder, renderer: QueryBuilderCustomRender },
];

const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';
const App: React.FC = () => {
  // USE STATES
  const theme = useTheme();
  // const [schema, setSchema] = useState(initialSchema);
  const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(false);
  const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(false);
  const [displayRaw, setDisplayRaw] = useState<boolean>(false);
  const [singlePartition, setSinglePartition] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState(null);

  const classes = useStyles();
  const [loadingStates, setLoadingStates] = React.useState<{
    [key: string]: boolean;
  }>({});
  const loadInitialData = (): any => {
    const storedData = localStorage.getItem('data');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Failed to parse data from localStorage:', error);
      }
    }
    return initialJsonData;
  };
  const [data, setData] = useState<any>(loadInitialData);
  const [transformedData, setTransformedData] = useState({});

  // FUNCTIONS

  const clearData = () => {
    setData(clearJsonData);
    // setTransformedData({});
  };
  const toggleDisplayRaw = () => {
    setDisplayRaw(!displayRaw);
    setDisplayDataTypes(false);
    setDisplayObjectSize(false);
  };

  const handleChanges = async (updatedData: any) => {
    localStorage.setItem('data', JSON.stringify(updatedData));
    setData(updatedData);
    console.log('Original data:', updatedData);

    let tempTransformedData = { ...updatedData };
    // Slots 🔻
    if (updatedData.slots) {
      const transformedSlots = updatedData.slots.reduce(
        (acc: any, slot: any) => {
          slot.response = '';
          const slotName =
            slot.type ||
            `name-not-specified-${Math.floor(Math.random() * 90000) + 10000}`;
          const transformedSlotName = slotName
            .toLowerCase()
            .replace(/\s+/g, '-');
          acc[transformedSlotName] = { ...slot.data, response: '' };
          // Apis 🔻
          if (slot.apis) {
            const transformedApis = slot.apis.map((api: any) => {
              api.headers = { 'Content-Type': 'application/json' };
              const paramsObject = (
                Array.isArray(api.params) ? api.params : []
              ).reduce((paramsAcc: any, param: any) => {
                paramsAcc[param.key] = param.value;
                return paramsAcc;
              }, {});
              return { ...api, params: paramsObject };
            });

            acc[transformedSlotName].apis = ArrayToObject(transformedApis);
          }
          // Execution Order 🔻
          if (slot.data && Array.isArray(slot.data.execution_order)) {
            slot.data.execution_order.forEach((order: any) => {
              // Add to list 🔻
              // if (order.type === 'api') {
              //   let arr: any[] = [];
              //   if (Array.isArray(slot.apis)) {
              //     slot.apis.forEach((api: any) => {
              //       const newSchema = { ...schema };
              //       arr =
              //         newSchema.$defs.commonFields.properties.execution_order
              //           .items.properties.name.enum;
              //       if (!arr.includes(api.name) && api.name.trim() !== '') {
              //         arr.push(api.name);
              //         setSchema(newSchema);
              //       }
              //     });
              //     console.log('new enum', arr);
              //   }
              // } else if (order.type === 'function') {
              //   const newSchema = { ...schema };
              //   newSchema.$defs.commonFields.properties.execution_order.items.properties.name.enum =
              //     ['1', '3'];
              //   setSchema(newSchema);
              // }
            });
          }

          // Functions 🔻
          if (slot.data && Array.isArray(slot.data.functions)) {
            acc[transformedSlotName].functions = ArrayToObject(
              slot.data.functions
            );
          }

          return acc;
        },
        {}
      );

      tempTransformedData.slots = transformedSlots;
    }

    setTransformedData(tempTransformedData);
    console.log('Transformed data:', tempTransformedData);
  };

  const sendJson = async () => {
    setApiResponse(null);
    setLoadingStates((prev) => ({ ...prev, sendJsonLoading: true }));
    console.log('sending json', loadingStates);
    try {
      const useProxyForKnownCorsIssues = process.env.REACT_APP_ENV
        ? true
        : false;
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
      setLoadingStates((prev) => ({ ...prev, sendJsonLoading: false }));
    }, 0);
  };

  const handleAction = async (actionType: string) => {
    console.log(`${actionType} action`);
    setLoadingStates((prev) => ({ ...prev, [actionType]: true }));
    setLoadingStates((prev) => ({ ...prev, fullScreenCircularProgress: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      switch (actionType) {
        case 'copy':
          await navigator.clipboard.writeText(
            JSON.stringify(transformedData, null, 2)
          );
          console.log('Data copied');
          break;
        case 'restore':
          setData(initialJsonData);
          console.log('Data restore');
          break;
        case 'blank':
          clearData();
          console.log('Data blank');
          break;
        case 'full':
          alert('JSON size is too large to load. May take a while.');
          setData(initialJsonDataFull);
          console.log('Data full');
          break;
        default:
          throw new Error('Unknown action');
      }
      setLoadingStates((prev) => ({
        ...prev,
        [actionType]: false,
        [`${actionType}Done`]: true,
      }));
      setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, fullScreenCircularProgress: false }));
        setLoadingStates((prev) => ({ ...prev, [`${actionType}Done`]: false }));
      }, 0);
    } catch (error) {
      console.error(`Failed to complete ${actionType}:`, error);
      setLoadingStates((prev) => ({ ...prev, [actionType]: false }));
    }
  };

  const actions = [
    {
      icon: loadingStates.copy ? (
        <CircularProgress size={24} />
      ) : loadingStates.copyDone ? (
        <DoneIcon />
      ) : (
        <ContentCopyOutlinedIcon />
      ),
      name: loadingStates.copyDone ? 'Copied' : 'Copy JSON Data',
      onClick: () => handleAction('copy'),
    },
    {
      icon: loadingStates.restore ? (
        <CircularProgress size={24} />
      ) : loadingStates.restoreDone ? (
        <DoneIcon />
      ) : (
        <RestorePageOutlinedIcon />
      ),
      name: loadingStates.restoreDone ? 'Restored' : 'Restore Initial Form',
      onClick: () => handleAction('restore'),
    },
    {
      icon: loadingStates.blank ? (
        <CircularProgress size={24} />
      ) : loadingStates.blankDone ? (
        <DoneIcon />
      ) : (
        <InsertDriveFileOutlinedIcon />
      ),
      name: loadingStates.blankDone ? 'Loaded' : 'Load Blank Form',
      onClick: () => handleAction('blank'),
    },
    {
      icon: loadingStates.full ? (
        <CircularProgress size={24} />
      ) : loadingStates.fullDone ? (
        <DoneIcon />
      ) : (
        <DescriptionOutlinedIcon />
      ),
      name: loadingStates.fullDone ? 'Loaded' : 'Load Full 28 Slots Form',
      onClick: () => handleAction('full'),
    },
  ];

  return (
    <Container>
      <Fragment>
        <SpeedDial
          ariaLabel='SpeedDial openIcon example'
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={
            <SpeedDialIcon
              icon={<FeedOutlinedIcon />}
              openIcon={<KeyboardArrowDownOutlinedIcon />}
            />
          }
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
        <Backdrop
          open={loadingStates.fullScreenCircularProgress}
          style={{ color: '#fff', zIndex: 1201 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        <Grid
          container
          justifyContent={'center'}
          spacing={1}
          className={classes.container}
        >
          <Grid item xs={12} lg={singlePartition ? 12 : 6}>
            <div className={classes.form}>
              {/* {console.log(data)} */}
              <JsonForms
                schema={initialSchema}
                uischema={uischema}
                data={data}
                renderers={renderers}
                cells={materialCells}
                onChange={({ errors, data }) => handleChanges(data)}
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={singlePartition ? 12 : 6}>
            <div className={classes.dataContent}>
              <Box>
                <FormControlLabel
                  sx={formControlLabelStyle}
                  control={
                    <Switch
                      disabled={displayRaw}
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
                      disabled={displayRaw}
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
                      onChange={toggleDisplayRaw}
                      name='displayRaw'
                    />
                  }
                  label='Raw'
                />
                <FormControlLabel
                  sx={formControlLabelStyle}
                  control={
                    <Switch
                      checked={singlePartition}
                      onChange={() => setSinglePartition(!singlePartition)}
                      name='singlePartition'
                    />
                  }
                  label='Single Partition'
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '8px',
                  border: `1.7px solid ${theme.palette.mode === 'dark' ? '#545454' : '#CBCBCB'
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
                loading={loadingStates.sendJsonLoading}
                loadingPosition='end'
                onClick={() => sendJson()}
                endIcon={<SendIcon />}
                className={classes.resetButton}
              >
                Send data
              </LoadingButton>
              {apiResponse && (
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
