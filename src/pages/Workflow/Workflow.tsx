import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import { JsonSchema } from '@jsonforms/core';
import { Button, Box, Typography, Container } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';

const initialSchema: JsonSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'User-defined + random',
      default: 'Start',
    },
    type: {
      type: 'string',
      enum: ['Start'],
      default: 'Start',
    },
    next: {
      type: 'string',
      enum: [''],
    },
    packet: {
      type: 'string',
      default: 'pack',
    },
    input: {
      type: 'array',
      items: {
        type: 'string',
        enum: [''],
      },
    },
    output: {
      type: 'array',
      items: {
        type: 'string',
        enum: [''],
      },
    },
    parent: {
      type: 'string',
      enum: [null],
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
    'url',
  ],
};

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
      type: 'Control',
      scope: '#/properties/input',
    },
    {
      type: 'Control',
      scope: '#/properties/output',
    },
    {
      type: 'Control',
      scope: '#/properties/parent',
    },
    {
      type: 'Control',
      scope: '#/properties/url',
    },
  ],
};

const initialData = {
  id: '',
  type: '',
  next: '',
  packet: '',
  input: [],
  output: [],
  parent: '',
  url: '',
};

const DynamicForms: React.FC = () => {
  const [formDataArray, setFormDataArray] = useState([initialData]);
  const [schemaArray, setSchemaArray] = useState([initialSchema]);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>(['']);
  const [workflowData, setWorkflowData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    axios
      .get('https://dev.assisto.tech/diaflow/get_workflow_info')
      .then((response) => {
        const data = response.data;
        const keys = Object.keys(data);
        setDropdownOptions(keys);
        setWorkflowData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        const data = {
          ASR: {
            desc: 'null',

            input: ['Start_audio', 'ASR_LANG_lang'],

            output: ['ASR_text'],
          },

          ASR_LANG: {
            desc: 'null',

            input: ['Start_audio'],

            output: ['ASR_LANG_lang'],
          },

          Dialog_Manager: {
            desc: 'null',

            input: [
              'Start_public_id',

              'WORD2NUM_text',

              'Start_client_id',

              'ASR_LANG_lang',

              'Start_client_id',
            ],

            output: [
              'Dialog_Manager_message',

              'Dialog_Manager_options',

              'Dialog_Manager_conversation_status',
            ],
          },

          ELASTIC_SAVE: {
            desc: 'null',

            input: ['Start_all_texts', 'Start_index_name'],

            output: ['ELASTIC_SAVE_response'],
          },

          ELASTIC_SEARCH: {
            desc: 'null',

            input: ['Start_query', 'Start_index_name'],

            output: ['ELASTIC_SEARCH_ranked_results_long_text'],
          },

          Easynmt: {
            desc: 'null',

            input: ['Start_text', 'Start_target_lang'],

            output: ['Easynmt_text'],
          },

          GmailReaderListExec: {
            desc: 'null',

            input: ['Start_email_id', 'Start_password'],

            output: ['GmailReaderListExec_list_of_emails'],
          },

          Intent: {
            desc: 'null',

            input: ['Outlook_Reader_text', 'Start_c_id', 'Start_lang'],

            output: ['Intent_intent'],
          },

          Intent_Chatbot: {
            desc: 'null',

            input: [
              'WR_ASR_text',

              'Start_lang',

              'Start_client_id',

              'Start_public_id',
            ],

            output: ['Intent_Chatbot_intent', 'Intent_Chatbot_ambig_or_multi'],
          },

          NER: {
            desc: 'null',

            input: [
              'Outlook_Reader_text',

              'Start_ner_ngram',

              'Start_c_id',

              'Start_lang',
            ],

            output: ['NER_ner', 'NER_city'],
          },

          NER_Chatbot: {
            desc: 'null',

            input: [
              'NER_NEW_text',

              'Start_lang',

              'Start_client_id',

              'Start_public_id',

              'Intent_Chatbot_intent',

              'Intent_Chatbot_ambig_or_multi',
            ],

            output: ['NER_Chatbot_ner'],
          },

          NER_NEW: {
            desc: 'null',

            input: ['WORD2NUM_text', 'Start_lang'],

            output: ['NER_NEW_text'],
          },

          New_DM: {
            desc: 'null',

            input: [
              'Start_public_id',

              'Start_text',

              'Start_lang',

              'Start_client_id',
            ],

            output: [
              'New_DM_message',

              'New_DM_options',

              'New_DM_conversation_status',
            ],
          },

          OCR_ELASTIC: {
            desc: 'null',

            input: ['Start_image_or_pdf'],

            output: ['OCR_ELASTIC_ocr_text'],
          },

          Outlook_Mov: {
            desc: 'null',

            input: [
              'Outlook_Reply_refund',

              'Outlook_Reply_sentiment',

              'Outlook_Reader_email_id',

              'Start_token',
            ],

            output: ['Outlook_Mov_subfolder_name'],
          },

          Outlook_Odb: {
            desc: 'null',

            input: ['Start_command', 'Start_data_to_insert', 'Start_db_params'],

            output: [
              'Outlook_Odb_status',

              'Outlook_Odb_description',

              'Outlook_Odb_rows',
            ],
          },

          Outlook_Reader: {
            desc: 'null',

            input: ['Start_token'],

            output: [
              'Outlook_Reader_text',

              'Outlook_Reader_sender_email',

              'Outlook_Reader_sender',

              'Outlook_Reader_email_id',
            ],
          },

          Outlook_Reply: {
            desc: 'null',

            input: [
              'Start_token',

              'Outlook_Reader_text',

              'Outlook_Reader_sender_email',

              'Outlook_Reader_sender',

              'Sentiment_sentiment',
            ],

            output: [
              'Outlook_Reply_reply status',

              'Outlook_Reply_ticket id',

              'Outlook_Reply_refund',

              'Outlook_Reply_sentiment',

              'Outlook_Reply_appreciation',
            ],
          },

          QUESTION_ANSWER: {
            desc: 'null',

            input: ['Start_query', 'ELASTIC_SEARCH_ranked_results_long_text'],

            output: ['QUESTION_ANSWER_answer'],
          },

          SUMMARIZER: {
            desc: 'null',

            input: ['ELASTIC_SEARCH_ranked_results_long_text', 'Start_lang'],

            output: ['SUMMARIZER_summary'],
          },

          Sentiment: {
            desc: 'null',

            input: ['Outlook_Reader_text'],

            output: ['Sentiment_sentiment', 'Sentiment_score'],
          },

          Simple_Function: {
            desc: 'null',

            input: [
              'Start_text',

              'Start_lang',

              'Start_client_id',

              'Start_public_id',
            ],

            output: [
              'Start_text',

              'Start_lang',

              'Start_client_id',

              'Start_public_id',
            ],
          },

          TTS: {
            desc: 'null',

            input: ['Start_message', 'Start_lang'],

            output: ['TTS_audio'],
          },

          Translation: {
            desc: 'null',

            input: [
              'OCR_ELASTIC_ocr_text',

              'Start_source_lang',

              'Start_target_lang',
            ],

            output: ['Translation_text'],
          },

          Translation_dl: {
            desc: 'null',

            input: ['ASR_text', 'ASR_LANG_lang', 'Start_target_lang'],

            output: ['Translation_dl_text'],
          },

          WHATSAPP_SENDER: {
            desc: 'null',

            input: [
              'Start_url',

              'Start_userid',

              'Start_password',

              'Start_to_number',

              'Start_from_number',

              'Dialog_Manager_message',

              'Dialog_Manager_options',
            ],

            output: ['Dialog_Manager_message', 'Dialog_Manager_options'],
          },

          WORD2NUM: {
            desc: 'null',

            input: ['WR_ASR_text', 'Start_lang'],

            output: ['WORD2NUM_text'],
          },

          WR_ASR: {
            desc: 'null',

            input: ['Start_audio', 'Start_lang'],

            output: ['WR_ASR_text'],
          },

          hdfc_conv: {
            desc: 'null',

            input: ['WR_ASR_text', 'ASR_LANG_lang', 'Start_client_id'],

            output: ['hdfc_conv_message'],
          },
        };
        const keys = Object.keys(data);
        setDropdownOptions(keys);
        setWorkflowData(data);
      });
  }, []);

  const addNewForm = () => {
    const newSchema = {
      ...initialSchema,
      properties: {
        ...initialSchema.properties,
        input: {
          type: 'array',
          items: {
            type: 'string',
            enum: [''],
          },
        },
        output: {
          type: 'array',
          items: {
            type: 'string',
            enum: [''],
          },
        },
      },
    };
    setFormDataArray([...formDataArray, { ...initialData }]);
    setSchemaArray([...schemaArray, newSchema]);
  };

  const handleFormChange =
    (index: number) =>
    ({ data }: { data: any }) => {
      const updatedFormDataArray = [...formDataArray];
      const selectedType = data.type;
      const inputs = workflowData[selectedType]?.input || ['no items'];
      const outputs = workflowData[selectedType]?.output || ['no outputs'];

      const updatedSchemaArray = [...schemaArray];
      updatedSchemaArray[index] = {
        ...updatedSchemaArray[index],
        properties: {
          ...updatedSchemaArray[index].properties,
          input: {
            type: 'array',
            items: {
              type: 'string',
              enum: inputs,
            },
          },
          output: {
            type: 'array',
            items: {
              type: 'string',
              enum: outputs,
            },
          },
        },
      };

      updatedFormDataArray[index] = {
        ...data,
        input: inputs,
        output: outputs,
      };

      setSchemaArray(updatedSchemaArray);
      setFormDataArray(updatedFormDataArray);
    };

  return (
    <Container>
      <h1>Dynamic Forms</h1>
      <Button variant='contained' color='primary' onClick={addNewForm}>
        Add New Slot
      </Button>

      {formDataArray.map((formData, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <Typography>{`Accordion ${index + 1}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb={2}>
              <JsonForms
                schema={{
                  ...schemaArray[index],
                  properties: {
                    ...schemaArray[index].properties,
                    type: {
                      type: 'string',
                      enum: dropdownOptions,
                    },
                    next: {
                      type: 'string',
                      enum: dropdownOptions,
                    },
                  },
                }}
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
    </Container>
  );
};

export default DynamicForms;
