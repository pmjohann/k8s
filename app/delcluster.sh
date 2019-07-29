#!/bin/bash

for id in $(linode-cli linodes list --text | grep $1 | awk '{print $1}')
do
    linode-cli linodes delete $id
done

for kubecfg in $(find /out -name *.yaml -type f | grep $1)
do
    rm $kubecfg
done
