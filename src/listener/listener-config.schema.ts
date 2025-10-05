import * as Joi from 'joi';

export const ListenerConfigSchema = Joi.object({
  chains: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().min(0).required(),
        name: Joi.string().required(),
        rpcURL: Joi.string().uri().required(),

        events: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              abi: Joi.string().required(),

              contract: Joi.string()
                .pattern(/^0x[a-fA-F0-9]{40}$/)
                .required(),
            }),
          )
          .min(1)
          .required(),
      }),
    )
    .min(1)
    .required(),
}).required();
