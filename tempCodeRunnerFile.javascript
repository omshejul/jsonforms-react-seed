const json = {
    "goal_name": "eastman",//string
    "client_id": "88",//string
    "language": "en",//drop
    "message": "",//hidden
    "question": "Hi, Hello, hi, hello, hey, Hey",//string
    "switch_language": true,//bool
    "slots": {
        "greetings": {
            "question": "Welcome to Eastman Auto & Power Limited. Please choose from the following options",//str
            "choices": true,//bool
            "bot_message": "question",//str
            "response": "",//hidden
            "pre_condition": {
                "condition_type": "python",//drop['exact', 'python','polars','similarity']
                "value_to_check": "{user_input}",//str
                "condition": "value",//str
                "error_message": "Please enter a 10 digit phone number"//str
            },
            "next_node": [
                {
                    "condition_type": "similarity",//drop['exact', 'python','polars','similarity']
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Services",
                    "next_node": [
                        //keys of slots
                    ]
                },
                {
                    "condition_type": "similarity",//drop['exact', 'python','polars','similarity']
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Sales",
                    "next_node": [
                        "customer-number"
                    ]
                }
            ],
            "execution_order":     [            {
                "type": "api",//dropdown for api or function  
                "name": "complaint_status" // keys from [type]
            }],
            "error_message": "Invalid selection please select from above options only."//str
        },
        "service-segment": {
            "question": "Please choose from the following options",//str
            "choices": true,//bool
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "value",
                "error_message": "Please enter a 10 digit phone number"
            },
            "next_node": [
                {
                    "condition_type": "similarity",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Raise a Complaint",
                    "next_node": [
                        "customer-number"
                    ]
                },
                {
                    "condition_type": "similarity",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Check Complaints Status",
                    "next_node": [
                        "check-complaint-status-1"
                    ]
                },
                {
                    "condition_type": "similarity",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Product Registration",
                    "next_node": [
                        "customer-number"
                    ]
                },
                {
                    "condition_type": "similarity",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Other Query",
                    "next_node": [
                        "customer-number"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "check-complaint-status-1": {
            "question": "Enter the complaint number:",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value.isalnum() and len(value) == 19)",
                "error_message": "Please enter the 19 character complaint number."
            },
            "apis": {
                "complaint_status": {
                    "endpoint": "https://crm.eaplworld.com/WhatsAPP_API/prd/getComplaint_Status.php",
                    "method": "GET",
                    "params": {
                        "complaint_no": "{user_input}"
                    },
                    "error_message": "Invalid complaint number. Please try again",
                    "output": [
                        "complaint_status_name"
                    ],
                    "post_api_variable": "complaint_status_name",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "python",
                    "condition": "(value)",
                    "next_node": [
                        "check-complaint-status-2"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "api",
                    "name": "complaint_status"
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "check-complaint-status-2": {
            "question": "",
            "choices": true,
            "bot_message": "Complaint status for the complaint number {apis.complaint_status.output[0].complaint_no} is {apis.complaint_status.output[0].status}.",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter the 19 character complaint number."
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "(value)",
                    "value_match": "",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "customer-number": {
            "question": "Please enter the phone number",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "((value.isnumeric() and len(value) == 10))",
                "error_message": "Please enter a 10 digit phone number"
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{apis.phone_api.output[0]}",
                    "condition": "('msg' in value)",
                    "next_node": [
                        "customer-name"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{greetings}",
                    "condition": "(value == 'Sales')",
                    "next_node": [
                        "sales-segment"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{apis.phone_api.output[0]}",
                    "condition": "('customer_id' in value)",
                    "next_node": [
                        "product-id"
                    ]
                }
            ],
            "apis": {
                "phone_api": {
                    "endpoint": "https://crm.eaplworld.com/WhatsAPP_API/prd/getCustomer_Details.php",
                    "method": "GET",
                    "params": {
                        "mobile": "{user_input}"
                    },
                    "error_message": "Invalid phone number. Please try again",
                    "output": [
                        "phone_name"
                    ],
                    "post_api_variable": "phone_name",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                },
                "product_details": {
                    "endpoint": "https://crm.eaplworld.com/WhatsAPP_API/prd/product_master.php",
                    "method": "GET",
                    "error_message": "Invalid complaint number. Please try again",
                    "output": [
                        "product_details"
                    ],
                    "post_api_variable": "product_details",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            },
            "functions": {
                "list_product_details": {
                    "input": [
                        "{apis.product_details.output}"
                    ],
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "execution_order": [
                {
                    "type": "api",
                    "name": "phone_api"
                },
                {
                    "type": "api",
                    "name": "product_details"
                },
                {
                    "type": "function",
                    "name": "list_product_details"
                }
            ],
            "error_message": "Invalid phone number. Please try again."
        },
        "customer-name": {
            "question": "Please enter the customer's name.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value.replace(' ', '').isalpha())",
                "error_message": "Please enter a valid name"
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "customer-pincode"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid phone number. Please try again."
        },
        "customer-pincode": {
            "question": "Please enter the pincode.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value.isnumeric() and len(value) == 6)",
                "error_message": "Please enter the 6 digit pincode."
            },
            "apis": {
                "pincode_api": {
                    "endpoint": "https://crm.eaplworld.com/WhatsAPP_API/prd/getPincode_master.php",
                    "method": "GET",
                    "params": {
                        "pincode": "{user_input}"
                    },
                    "error_message": "Invalid pincode. Please try again",
                    "output": [
                        "pincode_api"
                    ],
                    "post_api_variable": "pincode_api",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "customer-address"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "api",
                    "name": "pincode_api"
                }
            ],
            "error_message": "Invalid phone number. Please try again."
        },
        "customer-address": {
            "question": "Please enter the address.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter the 6 digit pincode."
            },
            "apis": {
                "phone_api": {
                    "endpoint": "https://crm.eaplworld.com/WhatsAPP_API/prd/getCustomer_Details.php",
                    "method": "GET",
                    "params": {
                        "mobile": "{customer-number}"
                    },
                    "error_message": "Invalid phone number. Please try again",
                    "output": [
                        "phone_name"
                    ],
                    "post_api_variable": "phone_name",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            },
            "functions": {
                "customer_registration": {
                    "input": {
                        "number": "{customer-number}",
                        "name": "{customer-name}",
                        "pincode": "{customer-pincode}",
                        "address": "{user_input}",
                        "api": "{apis.pincode_api.output[0]}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{greetings}",
                    "condition": "(value == 'Sales')",
                    "next_node": [
                        "sales-segment"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "product-id"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "function",
                    "name": "customer_registration"
                },
                {
                    "type": "api",
                    "name": "phone_api"
                }
            ],
            "error_message": "Invalid phone number. Please try again."
        },
        "product-id": {
            "question": "",
            "choices": false,
            "bot_message": "Please enter product id:\n{functions.list_product_details.output.resp}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value.isnumeric() and int(value))",
                "error_message": "Please enter a valid product id."
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{service-segment}",
                    "condition": "(value == 'Raise a Complaint')",
                    "next_node": [
                        "problem-id"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{service-segment}",
                    "condition": "(value == 'Product Registration')",
                    "next_node": [
                        "serial-number-method"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{service-segment}",
                    "condition": "(value == 'Other Query')",
                    "next_node": [
                        "query-1"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "apis": {
                "problem_details": {
                    "endpoint": "https://crm.eaplworld.com/WhatsAPP_API/prd/getProblem_Reported.php",
                    "method": "GET",
                    "params": {
                        "product_id": "{user_input}"
                    },
                    "error_message": "Invalid product id. Please try again",
                    "output": [
                        "problem_details"
                    ],
                    "post_api_variable": "problem_details",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            },
            "functions": {
                "list_problem_details": {
                    "input": [
                        "{apis.problem_details.output}"
                    ],
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "execution_order": [
                {
                    "type": "api",
                    "name": "problem_details"
                },
                {
                    "type": "function",
                    "name": "list_problem_details"
                }
            ],
            "error_message": "Invalid product id. Please try again."
        },
        "problem-id": {
            "question": "",
            "choices": false,
            "bot_message": "Please enter problem id:\n{functions.list_problem_details.output.resp}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value.isnumeric())",
                "error_message": "Please enter a valid product id."
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "serial-number-method"
                    ]
                }
            ],
            "error_message": "Invalid phone number. Please try again."
        },
        "serial-number-method": {
            "question": "How would you like to enter the serial number?",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "similarity",
                    "value_match": "Scan QR Code",
                    "next_node": [
                        "scan-serial-number"
                    ]
                },
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "similarity",
                    "value_match": "Enter Manually",
                    "next_node": [
                        "enter-serial-number"
                    ]
                }
            ],
            "error_message": "Invalid phone number. Please try again."
        },
        "scan-serial-number": {
            "question": "",
            "choices": true,
            "bot_message": "Scan the QR code to the serial number at: https://qr.assisto.tech/?phonenumber={public_id}&type=product",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "value",
                    "next_node": [
                        "purchase-date"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid phone number. Please try again."
        },
        "enter-serial-number": {
            "question": "Enter the serial number as given on the box.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value.isalnum() and len(value) == 17)",
                "error_message": "Please enter a valid 17 character serial number."
            },
            "apis": {
                "serial_validate": {
                    "endpoint": "https://crm.eaplworld.com/Serial_API/getValidateSerial_crm.php",
                    "method": "POST",
                    "json_data": {
                        "accessKey": "4ecebd9cd9bca77c98c4624019631415a660254ef08401bf3dd7392b563e124b",
                        "serialNumber": "{user_input}",
                        "product_id": "{product-id}"
                    },
                    "error_message": "Invalid product id. Please try again",
                    "output": [
                        "serial_validate"
                    ],
                    "post_api_variable": "serial_validate",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                }
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{apis.serial_validate.output.response.message.responseStatus}",
                    "condition": "(value == '1')",
                    "error_message": "Product id and serial number didn't match. Please try again.",
                    "next_node": [
                        "purchase-date"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "api",
                    "name": "serial_validate"
                }
            ],
            "error_message": "Serial number did not match for the product id. Please try again."
        },
        "purchase-date": {
            "question": "Enter the purchase date of the product in DD-MM-YYYY format.",
            "choices": false,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{service-segment}",
                    "condition": "(value == 'Raise a Complaint')",
                    "next_node": [
                        "complaint-registration-confirm"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{service-segment}",
                    "condition": "(value == 'Product Registration')",
                    "next_node": [
                        "upload-bill"
                    ]
                },
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "greetings"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid phone number. Please try again."
        },
        "complaint-registration-confirm": {
            "question": "Do you want to register the complaint?",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "complaint_registration": {
                    "input": {
                        "public_id": "{public_id}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "condition_type": "exact",
                    "value_to_check": "{user_input}",
                    "value_match": "Yes",
                    "condition": "(value)",
                    "next_node": [
                        "complaint-registration-success"
                    ]
                },
                {
                    "condition_type": "exact",
                    "value_to_check": "{user_input}",
                    "value_match": "No",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "function",
                    "name": "complaint_registration"
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "complaint-registration-success": {
            "question": "Complaint registration status.",
            "choices": true,
            "bot_message": "{functions.complaint_registration.output.resp[0].error_msg}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "customer_registration": {
                    "input": {
                        "public_id": "{public_id}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "upload-bill": {
            "question": "Upload purchase bill.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "apis": {},
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "upload-warranty"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "upload-warranty": {
            "question": "Upload Warranty card.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "apis": {},
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "product-registration-confirm"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "product-registration-confirm": {
            "question": "Do you want to register the product?",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "product_registration": {
                    "input": {
                        "public_id": "{public_id}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "condition_type": "exact",
                    "value_to_check": "{user_input}",
                    "value_match": "Yes",
                    "condition": "(value)",
                    "next_node": [
                        "product-registration-success"
                    ]
                },
                {
                    "condition_type": "exact",
                    "value_to_check": "{user_input}",
                    "value_match": "No",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "function",
                    "name": "product_registration"
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "product-registration-success": {
            "question": "Complaint registration status.",
            "choices": true,
            "bot_message": "{functions.product_registration.output.resp[0].error_msg}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "customer_registration": {
                    "input": {
                        "public_id": "{public_id}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "query-1": {
            "question": "Please enter your query.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "apis": {},
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "query-2"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "query-2": {
            "question": "For more information, give a missed call on 7872878728 or contact our email id- Support@eaplworld.com",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "apis": {},
            "next_node": [
                {
                    "condition_type": "python",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "sales-segment": {
            "question": "Please choose one of the following brands.",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "list_product_cat": {
                    "input": {
                        "company": "{user_input}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "similarity",
                    "value_match": "Eastman",
                    "next_node": [
                        "sales-products-1"
                    ]
                },
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "similarity",
                    "value_match": "Addo",
                    "next_node": [
                        "sales-products-1"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "function",
                    "name": "list_product_cat"
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "sales-products-1": {
            "question": "Please choose one of the following brands.",
            "choices": true,
            "bot_message": "Please choose a category from following: \n{functions.list_product_cat.output.resp}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "list_product_names": {
                    "input": {
                        "company": "{sales-segment}",
                        "category": "{user_input}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "python",
                    "condition": "(value)",
                    "next_node": [
                        "sales-products-2"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "function",
                    "name": "list_product_names"
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "sales-products-2": {
            "question": "Please choose one of the following brands.",
            "choices": true,
            "bot_message": "Please choose a product from following: \n{functions.list_product_names.output.resp}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "product_description": {
                    "input": {
                        "company": "{sales-segment}",
                        "category": "{sales-products-1}",
                        "product": "{user_input}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "python",
                    "condition": "(value)",
                    "next_node": [
                        "sales-products-3"
                    ]
                }
            ],
            "execution_order": [
                {
                    "type": "function",
                    "name": "product_description"
                }
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "sales-products-3": {
            "question": "Please choose one of the following brands.",
            "choices": true,
            "bot_message": "{functions.product_description.output.resp}",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "functions": {
                "list_product_cat": {
                    "input": {
                        "company": "{sales-segment}"
                    },
                    "output": [
                        "resp"
                    ],
                    "description": ""
                }
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "python",
                    "condition": "(value)",
                    "next_node": [
                        "final-node"
                    ]
                }
            ],
            "execution_order": [
            ],
            "error_message": "Invalid selection please select from above options only."
        },
        "final-node": {
            "question": "Do you have any other query?",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "apis": {},
            "next_node": [
                {
                    "condition_type": "similarity",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "Yes",
                    "next_node": [
                        "greetings"
                    ]
                },
                {
                    "condition_type": "similarity",
                    "value_to_check": "{user_input}",
                    "condition": "(value)",
                    "value_match": "No",
                    "next_node": [
                        "thanks"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid selection please select from above options only."
        },
        "thanks": {
            "question": "Thank you for connecting to Eastman Auto & Power Limited. Have a nice day!",
            "choices": true,
            "bot_message": "question",
            "response": "",
            "pre_condition": {
                "condition_type": "python",
                "value_to_check": "{user_input}",
                "condition": "(value)",
                "error_message": "Please enter a valid product id."
            },
            "next_node": [
                {
                    "value_to_check": "{user_input}",
                    "condition_type": "(value)",
                    "next_node": [
                        "greetings"
                    ]
                }
            ],
            "execution_order": [],
            "error_message": "Invalid phone number. Please try again."
        }
    }
}
console.log(Object.keys(json.slots));

Object.entries(json.slots).forEach(([key, value]) => {
    console.log(key);
    console.log(Object.keys(value));
})