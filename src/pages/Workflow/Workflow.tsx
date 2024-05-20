import React, { useState, useEffect } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { JsonSchema, ControlElement } from '@jsonforms/core'
import { Button, Box, Typography } from '@mui/material'

const initialSchema: JsonSchema = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "User-defined + random",
      "default": "Start"
    },
    "type": {
      "type": "string",
      "enum": ["Start"],
      "default": "Start"
    },
    "next": {
      "type": "string",
      "enum": ["Intent_Chatbot"]
    },
    "packet": {
      "type": "string",
      "default": "pack"
    },
    "input": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["Start_text", "Start_lang", "Start_client_id", "Start_public_id"]
      }
    },
    "output": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["Start_text", "Start_lang", "Start_client_id", "Start_public_id"]
      }
    },
    "parent": {
      "type": "string",
      "enum": [null]
    },
    "url": {
      "type": "string"
    }
  },
  "required": ["id", "type", "next", "packet", "input", "output", "parent", "url"]
}


const uischema = {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/id"
    },
    {
      "type": "Control",
      "scope": "#/properties/type"
    },
    {
      "type": "Control",
      "scope": "#/properties/next"
    },
    {
      "type": "Control",
      "scope": "#/properties/packet"
    },
    {
      "type": "Control",
      "scope": "#/properties/input"
    },
    {
      "type": "Control",
      "scope": "#/properties/output"
    },
    {
      "type": "Control",
      "scope": "#/properties/parent"
    },
    {
      "type": "Control",
      "scope": "#/properties/url"
    }
  ]
}


const initialData = [{ id: '' }]

const enumMapping: { [key: string]: string[] } = {
  food: ['chips', 'fries'],
  drink: ['coke', 'water']
}

const DynamicForms: React.FC = () => {
  const [formDataArray, setFormDataArray] = useState(initialData)
  const [schemaArray, setSchemaArray] = useState([initialSchema])

  const addNewForm = () => {
    setFormDataArray([...formDataArray, { id: '' }])
    setSchemaArray([...schemaArray, initialSchema])
  }

  const handleFormChange = (index: number) => ({ data }: { data: any }) => {
    const newFormDataArray = [...formDataArray]
    newFormDataArray[index] = data
    setFormDataArray(newFormDataArray)

    if (index < newFormDataArray.length - 1) {
      const selectedValue = newFormDataArray[index].id
      const nextSchema = { ...initialSchema }
      nextSchema.properties!.id.enum = enumMapping[selectedValue] || []
      const newSchemaArray = [...schemaArray]
      newSchemaArray[index + 1] = nextSchema
      setSchemaArray(newSchemaArray)
    }
  }

  useEffect(() => {
    const updatedSchemas = formDataArray.map((formData, index) => {
      if (index === 0) {
        return initialSchema
      } else {
        const previousValue = formDataArray[index - 1].id
        return {
          ...initialSchema,
          properties: {
            id: {
              type: 'string',
              enum: enumMapping[previousValue] || []
            }
          }
        }
      }
    })
    setSchemaArray(updatedSchemas)
  }, [formDataArray])

  return (
    <div>
      <h1>Dynamic Forms</h1>
      {formDataArray.map((formData, index) => (
        <Box key={index} mb={2}>
          <Typography variant="h6">Form {index + 1}</Typography>
          <JsonForms
            schema={schemaArray[index]}
            uischema={uischema}
            data={formData}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={handleFormChange(index)}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={addNewForm}>
        Add New Form
      </Button>
    </div>
  )
}

export default DynamicForms
