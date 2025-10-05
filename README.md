# Venn Forward Verification Service

Listens to onchain events and forwards them to the Venn Verification API.

## How To Use

1. Install dependencies using `npm ci` to install everything as-is from the `package-lock.json` file <br/><br/>

2. Create a copy of the `.env` file by running `cp .env.example .env` and update your `VAPI_API_KEY` <br/><br/>

3. Update your listening configuration by running `cp listener-config.yaml.example listener-config.yaml`, and fill in your chains, events, and contracts <br/><br/>

4. Build using `npm run build` <br/><br/>

5. Run using `npm run start`
