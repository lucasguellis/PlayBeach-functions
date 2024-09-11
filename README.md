# PlayBeach - Firebase Functions API

This repository contains a serverless API built with Firebase Functions. The API is designed to handle various HTTP requests and provides endpoints for PlayBeach app.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Available Endpoints](#available-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/lucasguellis/PlayBeach-functions.git
   cd PlayBeach-functions
   ```

2. **Install dependencies:**

   ```bash
   npm install -g firebase-tools
   npm install
   ```

3. **Set up Firebase CLI:**

   Log in to Firebase:

   ```bash
   firebase login
   ```

   Initialize Firebase in your project folder:

   ```bash
   firebase init functions
   ```

   Follow the prompts to set up the functions directory.

## Usage

To run the API locally, use the following command:

```bash
npm run dev
```

This will start the functions emulator, and you can access the API at `http://localhost:5001/playbeach-deda5/us-central1/app`.

## Available Endpoints

See [here](available_endpoints.md) the available endpoints of this API.

## Environment Variables

Create a `.env` file in the functions directory with the following variables:

```env
GOOGLE_APPLICATION_CREDENTIALS=./playbeach-credentials.json
```

Create the json file with your actual Firebase project settings.

## Deployment

To deploy the functions to Firebase, run:

```bash
firebase deploy
```

This command will deploy the functions to your Firebase project.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request to master.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
