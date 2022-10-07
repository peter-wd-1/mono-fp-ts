#!/bin/sh
cd /home/ec2-user/src
yarn
# create shared folder in nfs
jqr=`cat /home/ec2-user/src/deploylist.json | jq '.projects'`
length=`echo $jqr | jq 'length'`
for i in `seq 0 $(expr $length - 1)`
do
    name=`echo $jqr | jq ".[$(expr $i)]" | cut -d'"' -f2`
    mkdir -p /root/nfs/operation/log/$name
done

export TAG=$(npm pkg get version | cut -d'"' -f2)
yarn nx serve-deploylist cicd
