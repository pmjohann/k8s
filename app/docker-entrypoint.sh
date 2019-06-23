#!/bin/bash

# GENERATE NEW SSH KEYPAIR
rm -rf /root/.ssh/id_rsa /root/.ssh/id_rsa.pub
ssh-keygen -t rsa -b 4096 -C "noreply@example.com" -f /root/.ssh/id_rsa -N ""
eval $(ssh-agent) && ssh-add /root/.ssh/id_rsa

# LAUNCH INIT SCRIPT
node /app/index.js
