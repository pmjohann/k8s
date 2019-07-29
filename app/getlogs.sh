#!/bin/bash

for kubecfg in $(find /out -name *.yaml -type f)
do
    echo "###############################"
    echo $kubecfg
    echo "###############################"
    echo ''
    KUBECONFIG=$kubecfg kubectl logs -l name=speedtest -c substrate
    echo ''
    echo "###############################"
    echo ''
    echo ''
    echo ''
done
