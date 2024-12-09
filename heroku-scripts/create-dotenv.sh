#!/bin/bash

echo "Writing .env file to use variables from Heroku config vars"
echo "DATABASE_URL=${DATABASE_URL}" > ".env"