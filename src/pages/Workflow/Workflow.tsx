import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import Add from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Container, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import axios from 'axios'
import React, { useEffect, useState } from 'react'



const DynamicForms: React.FC = () => {
  const initialSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['Start'],
      },
      next: {
        type: 'string',
        enum: ['NONE'],
      },
      packet: {
        type: 'string',
        default: 'pack',
      },
      input: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['NONE'],
        },
      },
      output: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['NONE'],
        },
      },
      parent: {
        type: 'string',
      },
      url: {
        type: 'string',
      },
    },
    required: [
      'id',
      'type',
      'next',
      'packet',
      'input',
      'output',
      'parent',
    ],
  }

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/id',
      },
      {
        type: 'Control',
        scope: '#/properties/type',
      },
      {
        type: 'Control',
        scope: '#/properties/next',
      },
      {
        type: 'Control',
        scope: '#/properties/packet',
      },
      {
        type: "HorizontalLayout",
        elements: [

          {
            type: 'Control',
            scope: '#/properties/input',
          },
          {
            type: 'Control',
            scope: '#/properties/output',
            options: {
              readOnly: true
            }
          },
        ]
      },
      {
        type: 'Control',
        scope: '#/properties/parent',
        options: {
          readOnly: true
        }
      },
      {
        type: 'Control',
        scope: '#/properties/url',
      },
    ],
  }

  const initialData = {
    id: '',
    type: '',
    next: '',
    packet: 'pack',
    input: [],
    output: [],
    parent: 'null',
    url: '',
  }
  const [formDataArray, setFormDataArray] = useState([initialData])
  const [schemaArray, setSchemaArray] = useState([initialSchema])
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([''])
  const [workflowData, setWorkflowData] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    axios
      .get('https://dev.assisto.tech/diaflow/get_workflow_info')
      .then((response) => {
        const data = response.data
        const keys = Object.keys(data)
        setDropdownOptions(keys)
        setWorkflowData(data)
      })
      .catch((error) => {
        // console.error('Error fetching data:', error)
        const data = {
          Outlook_Reply: {
            desc: 'null',
            input: ['Start_token', 'Outlook_Reader_text', 'Outlook_Reader_sender_email', 'Outlook_Reader_sender', 'Sentiment_sentiment'],
            output: ['Outlook_Reply_reply status', 'Outlook_Reply_ticket id', 'Outlook_Reply_refund', 'Outlook_Reply_sentiment', 'Outlook_Reply_appreciation'],
          },
          Simple_Function: {
            desc: 'null',
            input: ['Start_text', 'Start_lang', 'Start_client_id', 'Start_public_id'],
            output: ['Start_text', 'Start_lang', 'Start_client_id', 'Start_public_id'],
          },
          WHATSAPP_SENDER: {
            desc: 'null',
            input: ['Start_url', 'Start_userid', 'Start_password', 'Start_to_number', 'Start_from_number', 'Dialog_Manager_message', 'Dialog_Manager_options'],
            output: ['Dialog_Manager_message', 'Dialog_Manager_options'],
          },
        }
        const keys = Object.keys(data)
        setDropdownOptions(keys)
        setWorkflowData(data)
      })
  }, [])

  const addNewForm = () => {
    const newFormData = { ...initialData }
    const newSchema = { ...initialSchema }

    const selectedType = formDataArray.length > 0 ? formDataArray[formDataArray.length - 1]?.next : ''
    const typeInputs = workflowData[selectedType]?.input || []
    const typeOutputs = workflowData[selectedType]?.output || []

    newFormData.type = selectedType
    newFormData.input = typeInputs
    newFormData.output = typeOutputs

    newSchema.properties.type.enum = [selectedType]
    newSchema.properties.input.items.enum = typeInputs.length > 0 ? typeInputs : ['']
    newSchema.properties.output.items.enum = typeOutputs.length > 0 ? typeOutputs : ['']

    setFormDataArray([...formDataArray, newFormData])
    setSchemaArray([...schemaArray, newSchema])
  }


  const handleFormChange = (index: number) => ({ data }: { data: any }) => {
    const updatedFormDataArray = [...formDataArray]
    updatedFormDataArray[index] = data

    // Create a copy of the schema array
    const updatedSchemaArray = [...schemaArray]

    if (index === 0) {
      const allInputs = Object.values(workflowData)
        .flatMap(workflow => workflow.input)
        .filter((value, idx, self) => self.indexOf(value) === idx) 
  
      // Filter outputs that start with 'Start_'
      const startOutputs = Object.values(workflowData)
        .flatMap(workflow => workflow.output)
        .filter(output => output.startsWith('Start_'))
        .filter((value, idx, self) => self.indexOf(value) === idx) 
  
      updatedFormDataArray[index].output = startOutputs as any;
  
      updatedSchemaArray[index] = {
        ...schemaArray[index],
        properties: {
          ...schemaArray[index].properties,
          type: {
            ...schemaArray[index].properties.type,
            enum: ["Start"],
          },
          next: {
            ...schemaArray[index].properties.next,
            enum: dropdownOptions,
          },
          input: {
            ...schemaArray[index].properties.input,
            items: {
              ...schemaArray[index].properties.input.items,
              enum: allInputs.length > 0 ? allInputs : ['No Items'],
            },
          },
          output: {
            ...schemaArray[index].properties.output,
            items: {
              ...schemaArray[index].properties.output.items,
              enum: startOutputs.length > 0 ? startOutputs : ['No Outputs'],
            },
          },
        },
      }
    } else {
    const selectedNextValues = formDataArray.slice(0, index).map(form => form.next)
    let remainingOptions = dropdownOptions.filter(option => !selectedNextValues.includes(option))
    remainingOptions = remainingOptions.length === 0 ? ['NONE'] : remainingOptions

    const selectedType = formDataArray[index - 1]?.next || ''
    const previousOutputs = formDataArray[index - 1]?.output || []
    const typeInputs = workflowData[selectedType]?.input || ['']
    const typeOutputs = workflowData[selectedType]?.output || ['']

    // Combine the previous node's outputs with current type inputs
    const combinedInputs = Array.from(new Set([...previousOutputs, ...typeInputs]))

    updatedSchemaArray[index] = {
      ...schemaArray[index],
      properties: {
        ...schemaArray[index].properties,
        type: {
          ...schemaArray[index].properties.type,
          enum: [selectedType],
        },
        next: {
          ...schemaArray[index].properties.next,
          enum: remainingOptions,
        },
        input: {
          ...schemaArray[index].properties.input,
          items: {
            type: 'string',
            enum: combinedInputs.length > 0 ? combinedInputs : [''],
          },
        },
        output: {
          ...schemaArray[index].properties.output,
          items: {
            type: 'string',
            enum: typeOutputs.length > 0 ? typeOutputs : [''],
          },
        },
      },
    }
  }

    setSchemaArray(updatedSchemaArray)
    setFormDataArray(updatedFormDataArray)
  }


  const generateRandomHex = () => {
    return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')
  }

  const deleteForm = (index: number) => {
    console.log('deleteForm', index)
    console.log('before', index, formDataArray, schemaArray)

    const updatedFormDataArray = formDataArray.filter((_, i) => i !== index)
    const updatedSchemaArray = schemaArray.filter((_, i) => i !== index)

    console.log('after', index, updatedFormDataArray, updatedSchemaArray)

    setSchemaArray(updatedSchemaArray)
    setFormDataArray(updatedFormDataArray)
  }


  return (
    <Container>
      <h1>Workflow Forms</h1>
      <Button sx={{ mb: 2 }} variant="contained" color="primary" onClick={addNewForm}>
        <Add sx={{ mr: 1 }} />
        <Typography>
          Add New Slot
        </Typography>
      </Button>

      {formDataArray.map((formData, index) => (
        <Accordion key={index}>

          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Typography>{formData.type || `Slot ${index + 1}`}</Typography>
              <Button onClick={(e) => {
                e.stopPropagation()
                deleteForm(index)
              }}>
                <DeleteOutlineIcon />
              </Button>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box mb={2}>
              <JsonForms
                schema={schemaArray[index]}
                uischema={uischema}
                data={formData}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={handleFormChange(index)}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <pre>
        {JSON.stringify(formDataArray, null, 2)}
      </pre>
    </Container>
  )
}

export default DynamicForms
