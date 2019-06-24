#!/bin/bash

for kubecfg in $(find /out -name *.yaml -type f)
do
    for manifest in $(find /app/manifests -name *.yml -type f)
    do
        echo $kubecfg $manifest
        KUBECONFIG=$kubecfg kubectl apply -f $manifest
    done
done
