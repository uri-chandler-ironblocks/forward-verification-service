# We're using a multi-stage build, where the first stage
# is used to build the app, and the second stage to run it.
#
# This gives us better security and performance in production,
# because the final image is thin, and leverages Google's distroless
# images for production.
#


# STAGE 1: BUILD
#
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build



# STAGE 2: RUN
#
FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /usr/src/app
USER nonroot
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000
CMD ["dist/main.js"]