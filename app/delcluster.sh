#!/bin/bash

for id in $(linode-cli linodes list --text | grep $1 | awk '{print $1}')
do
    linode-cli linodes delete $id
done
