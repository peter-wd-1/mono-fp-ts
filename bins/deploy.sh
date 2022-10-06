#!/bin/sh
cd /home/ec2-user/src
yarn
export TAG=latest
yarn nx serve-deploylist cicd
