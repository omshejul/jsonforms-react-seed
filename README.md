

# Dialog Manager

Dialog Manager built on with jsonforms
This repo is fork of the repo [jsonforms-react-seed](https://github.com/eclipsesource/jsonforms-react-seed)

## Overview

This React application utilizes a dynamic form generation and API execution framework based on a configurable schema (`schema.json`) and UI schema (`uischema.json`). It allows for executing APIs, rendering UI based on JSON schema, and processing user inputs through dynamically generated forms.

## Features

- **Dynamic Form Generation:** Generates forms based on a JSON schema to capture user input.
- **API Execution:** Handles the execution of configured APIs with input from the forms.
- **Conditional Logic:** Supports pre and post conditions to guide the application flow.
- **Extensible Schema:** Easily extendable schema and UI schema for various use cases.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed (version 12.x or higher recommended)
- npm or yarn as your package manager

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/omshejul/jsonforms-react-seed.git
cd jsonforms-react-seed
```

Install the dependencies:

```bash
npm ci # for clean install
# or
yarn ci
```

## Usage

To start the application in development mode:

```bash
npm start
# or
yarn start
```

Your app should now be running on [http://localhost:3000](http://localhost:3000).

## Configuration

- **Schema (`schema.json`):** Defines the structure of your form and APIs. Customize it according to your requirements.
- **UI Schema (`uischema.json`):** Determines how the UI components are rendered based on the schema.

## Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

This will generate a `build` directory with optimized production files.

# Tips:

-If api is giving CORS error try adding https://cors-anywhere.herokuapp.com/ in front of the api url