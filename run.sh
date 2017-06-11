#!/bin/bash

echo "******* Start Web Server *******" && ( cd ./app && npm start & ) && echo "******* Start API Server *******" && ( cd ./api && npm start & )
