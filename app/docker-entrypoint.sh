#!/bin/bash

# GENERATE NEW SSH KEYPAIR
ssh-keygen -t rsa -b 4096 -C "noreply@example.com" -f /root/.ssh/id_rsa -N ""
eval $(ssh-agent) && ssh-add /root/.ssh/id_rsa

# LAUNCH INIT SCRIPT
node /root/index.js
