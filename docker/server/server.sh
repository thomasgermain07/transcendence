#!/bin/sh

set -e

# ------------------------------------------------------------------------------
# Server Side
# ------------------------------------------------------------------------------
# Install (NestJS) Dependencies
yarn install

# Start (NestJS) Server
yarn run start:dev
