#!/bin/bash

# GENERATE NEW SSH KEYPAIR
if [ ! -f /root/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 4096 -C "noreply@example.com" -f /root/.ssh/id_rsa -N ""
fi

eval $(ssh-agent) && ssh-add /root/.ssh/id_rsa

# LAUNCH INIT SCRIPT
node /app/index.js $1
