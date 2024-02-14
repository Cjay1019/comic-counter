#!/bin/bash
sudo su
cd /var/app/current
npm i nodemon
cd /var/app/current/client
npm i
npm run build