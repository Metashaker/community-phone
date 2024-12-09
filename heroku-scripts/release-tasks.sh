#!/bin/bash

# Running with --no so no new packages are installed in this step
echo "Running DB migrations via Prisma"
npx --no prisma migrate deploy