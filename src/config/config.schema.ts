import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  // The port on which the application will run
  //
  PORT: Joi.number().required(),

  // The base URL for the Venn Verification API
  //
  VAPI_BASE_URL: Joi.string().uri().required(),

  // The API key for authenticating with the Venn Verification API
  //
  VAPI_API_KEY: Joi.string().required(),

  // The path to the configuration file which lists which chains and events to listen to
  //
  LISTENER_CONFIG_FILE_PATH: Joi.string().required(),

  // Enable or disable the health check endpoint
  //
  HEALTH_CHECK_ENABLED: Joi.boolean().required(),

  // The path for the health check endpoint
  //
  HEALTH_CHECK_PATH: Joi.string().required(),

  // Enable or disable the metrics endpoint
  //
  METRICS_ENABLED: Joi.boolean().required(),

  // The path for the metrics endpoint
  //
  METRICS_PATH: Joi.string().required(),
});
