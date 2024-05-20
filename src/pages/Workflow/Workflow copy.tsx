import React, { useEffect, useState } from 'react'
import { materialCells, materialRenderers, } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import axios from 'axios'
import { useTheme } from '@mui/material/styles'
import { Box, Container, FormControlLabel, Grid, Switch } from '@mui/material'
import ReactJson from 'react-json-view'
import { title } from 'process'

const renderers = [
    ...materialRenderers,
]


const Workflow = () => {
    const theme = useTheme()
    const [displayObjectSize, setDisplayObjectSize] = useState<boolean>(false)
    const [displayDataTypes, setDisplayDataTypes] = useState<boolean>(false)
    const [displayRaw, setDisplayRaw] = useState<boolean>(false)
    useEffect(() => {
        // use proxy to solve CORS issue
        axios.get('https://dev.assisto.tech/diaflow/get_workflow_info')
            .then((response) => {
                setWorkflow(response.data)
                console.log(response.data)
                const keys = Object.keys(response.data)
                console.log(keys)
                const newSchema = {
                    ...schema,
                    properties: {
                        ...schema.properties,
                        list: {
                            ...schema.properties.list,
                            enum: keys,
                        },
                    },
                }
                setSchema(newSchema)

            })
            .catch((error) => {
                console.log(error)
            })
    }, [])



    const [workflow, setWorkflow] = useState<any>([])
    const [data, setData] = useState<any>({})
    const initialSchema = {
        type: 'object',
        properties: {
            chatbot: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', title: 'ID' },
                        type: { type: 'string' },
                        next: { type: 'string' },
                        input: { type: 'string' },
                        description: { type: 'string' },
                    },
                },
            },
            name: { type: 'string' },
            description: { type: 'string' },
            done: { type: 'boolean' },
            list: { type: "string", enum: ["none"] }
        },
    }
    const uischema = {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'Control',
                scope: '#/properties/chatbot',
                options: {
                    detail: {
                        type: 'VerticalLayout',
                        elements: [
                            {
                                type: 'Control',
                                scope: '#/properties/id',
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/name',
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/description',
                            },
                        ]
                    }
                }
            },
            {
                type: 'Control',
                scope: '#/properties/name',
            },
            {
                type: 'Control',
                scope: '#/properties/description',
            },
            {
                type: 'Control',
                scope: '#/properties/done',
            },
            {
                type: 'Control',
                scope: '#/properties/list',
            },
        ],
    }

    const [schema, setSchema] = useState<any>(initialSchema)

    const handleChanges = (newData: any) => {
        let newEnum = schema.properties.list.enum
        if (newData.done && !newEnum.includes('four')) {
            newEnum = [...newEnum, 'four']
        } else if (!newData.done && newEnum.includes('four')) {
            newEnum = newEnum.filter((item: any) => item !== 'four')
        }

        if (newEnum !== schema.properties.list.enum) {
            const newSchema = {
                ...schema,
                properties: {
                    ...schema.properties,
                    list: {
                        ...schema.properties.list,
                        enum: newEnum,
                    },
                },
            }
            setSchema(newSchema)
        }
        setData(newData)
    }
    const toggleDisplayRaw = () => {
        setDisplayRaw(!displayRaw);
        setDisplayDataTypes(false);
        setDisplayObjectSize(false);
      };
    return (
        <Container sx={{mt:2}}>
            <Grid
                container
                justifyContent={'center'}
                spacing={1}
            >
                <Grid item xs={12} lg={6}>

                    <JsonForms
                        schema={schema}
                        uischema={uischema}
                        data={data}
                        renderers={renderers}
                        cells={materialCells}
                        onChange={({ errors, data }) => handleChanges(data)}
                    />
                </Grid>
                <Grid item xs={12} lg={6}>

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
              </Box>
              <Box
                sx={{
                  width: '100%',
                  overflowX: 'scroll',
                  scrollbarWidth: 'none',
                  borderRadius: '8px',
                  border: `1.6px solid ${
                    theme.palette.mode === 'dark' ? '#545454' : '#dfdfdf'
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
                  src={data}
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
                  {JSON.stringify(data, null, 2)}
                </code>
              </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Workflow
const formControlLabelStyle = {
    border: '1px solid rgba(126, 126, 126, 0.239)',
    borderRadius: '6px',
    margin: '0px 16px 16px 0px',
    padding: '4px 16px 4px 4px',
  };