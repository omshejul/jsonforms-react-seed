import { ControlProps } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms, withJsonFormsControlProps } from '@jsonforms/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import RatingControl from '../../RatingControl/RatingControl';
import ratingControlTester from '../../RatingControl/ratingControlTester';
import RenderButton from './RenderButton';

const renderers = [
  ...materialRenderers,
  { tester: ratingControlTester, renderer: RatingControl },
];

const ApiCustomRender: React.FC<ControlProps> = ({
  data,
  handleChange,
  path,
}) => {
  const [apiResults, setApiResults] = useState<{ [key: number]: any }>({});
  const [loadingStates, setLoadingStates] = useState<any>({});
  const initialData: APIData[] = Array.isArray(data) ? data : [];
  const [apis, setApis] = useState<APIData[]>(initialData);

  const addApi = () => {
    const newApi: APIData = {
      name: '',
      endpoint: '',
      method: 'GET',
      params: [],
      error_message: '',
    };

    const updatedApis = [...apis, newApi];
    setApis(updatedApis);
    handleChange(path, updatedApis);
  };
  const deleteApi = (index: number) => {
    const updatedApis = apis.filter((_, i) => i !== index);
    setApis(updatedApis);
    handleChange(path, updatedApis);
    const updatedResults = { ...apiResults };
    delete updatedResults[index];
    setApiResults(updatedResults);
  };
  const deleteApiResult = (index: number) => {
    const updatedResults = { ...apiResults };
    delete updatedResults[index];
    setApiResults(updatedResults);
  };

  const runApi = async (api: APIData, index: number) => {
    setLoadingStates((prev: any) => ({ ...prev, [apis[index].name]: true }));
    const isValidUrl = (urlString: string) => {
      try {
        new URL(urlString);
        return true;
      } catch (e) {
        return false;
      }
    };

    if (!isValidUrl(api.endpoint)) {
      setApiResults((prevResults) => ({
        ...prevResults,
        [index]: { error: 'Not a valid URL', url: api.endpoint },
      }));
      return;
    }

    let paramsOrData = api.params.reduce(
      (acc: Record<string, string>, param: { key: string; value: string }) => {
        acc[param.key] = param.value;
        return acc;
      },
      {}
    );

    const useProxyForKnownCorsIssues = false;
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = useProxyForKnownCorsIssues
      ? `${corsProxyUrl}${api.endpoint}`
      : api.endpoint;

    let config: AxiosRequestConfigCustom = {
      method: api.method.toLowerCase(),
      url: apiUrl,
      headers: { 'Content-Type': 'application/json' },
    };

    if (['post', 'put', 'patch'].includes(api.method.toLowerCase())) {
      config['data'] = paramsOrData;
    } else {
      config['params'] = paramsOrData;
    }

    try {
      const response = await axios(config);

      setApiResults((prevResults: { [key: number]: any }) => ({
        ...prevResults,
        [index]: response.data,
      }));
    } catch (error) {
      console.error('API call failed:', error);
      const errorMessage =
        error instanceof Error ? error.toString() : 'An unknown error occurred';
      setApiResults((prevResults) => ({
        ...prevResults,
        [index]: { error: 'API call failed', details: errorMessage },
      }));
    }
    setTimeout(() => {
      console.log(`API ${apis[index].name} finished`);
      setLoadingStates((prev: any) => ({ ...prev, [apis[index].name]: false }));
    }, 0);
  };

  return (
    <Grid container spacing={2}>
      <Grid item container justifyContent='start' alignItems='center'>
        <Box
          display='flex'
          fontSize={'1.2rem'}
          alignItems='center'
          justifyContent='center'
        >
          Add APIs
          <IconButton onClick={addApi} aria-label='add'>
            <AddIcon />
          </IconButton>
        </Box>
      </Grid>
      {apis.map((api, index) => (
        <Grid item xs={12} key={index}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Grid container alignItems={'center'}>

                <Avatar>{index + 1}</Avatar>
                <Typography sx={{ margin: "1rem" }}>
                  {apis[index].name
                    ? apis[index].name + ' API Configurations'
                    : `API Configuration ${index + 1}`}
                </Typography>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <JsonForms
                schema={apiSchema}
                uischema={apiUiSchema}
                data={api}
                renderers={renderers}
                cells={materialCells}
                onChange={({ data: updatedApi }) => {
                  const updatedApis = [...apis];
                  updatedApis[index] = updatedApi;
                  setApis(updatedApis);
                  handleChange(path, updatedApis);
                }}
              />
              <Grid container spacing={2}>
                <Grid item>
                  <LoadingButton
                    variant='contained'
                    color='primary'
                    loading={loadingStates[apis[index].name] as any}
                    loadingPosition='end'
                    onClick={() => runApi(api, index)}
                    endIcon={<SendIcon />}
                  >
                    Run API
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <Tooltip title='Delete API'>
                    <IconButton onClick={() => deleteApi(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <div className='apiResultsBTN'>
                {apiResults[index] && (
                  <Card style={{ marginTop: '10px' }}>
                    <CardContent>
                      <div className='flex justify-between'>
                        <Typography variant='h6'>
                          {apis[index].name
                            ? `Results from API: ${apis[index].name}`
                            : `Results from API: ${index + 1}`}
                        </Typography>
                        <Grid item>
                          <Tooltip title='Delete Results'>
                            <IconButton onClick={() => deleteApiResult(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </div>
                      {RenderButton(apiResults[index])}
                    </CardContent>
                  </Card>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};

export default withJsonFormsControlProps(ApiCustomRender);

interface Param {
  key: string;
  value: string;
}

type AxiosRequestConfigCustom = {
  method: string;
  url: string;
  headers: { 'Content-Type': string };
  data?: Record<string, string>;
  params?: Record<string, string>;
};

const apiSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    endpoint: { type: 'string' },
    output: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
    post_api_variable: { type: 'string' },
    params: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['key', 'value'],
      },
    },
    headers: {
      type: 'object',
      default: {
        'Content-Type': 'application/json',
      },
    },
    error_message: { type: 'string' },
  },
  required: ['name', 'endpoint', 'output', 'method', 'params', 'error_message'],
};

const apiUiSchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/name', label: 'Name' },
    { type: 'Control', scope: '#/properties/endpoint', label: 'Endpoint' },
    { type: 'Control', scope: '#/properties/method', label: 'Method' },
    { type: 'Control', scope: '#/properties/output', label: 'Output' },
    {
      type: 'Control',
      scope: '#/properties/post_api_variable',
      label: 'Post Api Variable',
    },
    {
      type: 'Control',
      scope: '#/properties/params',
      label: 'Params',
      options: { showSortButtons: false },
    },
    {
      type: 'Control',
      scope: '#/properties/error_message',
      label: 'Error Message',
    },
  ],
};

interface Param {
  key: string;
  value: string;
}
interface APIData {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params: Param[];
  error_message: string;
}
