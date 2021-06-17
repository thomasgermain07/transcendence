#!/bin/sh

set -e

# ------------------------------------------------------------------------------
# Client Side
# ------------------------------------------------------------------------------
# Install (VueJS) Dependencies
yarn install

# Start (VueJS) Server
yarn run dev --host
