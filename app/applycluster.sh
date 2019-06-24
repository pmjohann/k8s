#!/bin/bash

for kubecfg in $(ls /out)
do
    for manifest in $(ls /app/manifests)
    do
        echo $kubecfg $manifest
        KUBECONFIG=$kubecfg kubectl apply -f $manifest
    done
done
