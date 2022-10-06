#!/bin/sh
cd /home/ec2-user/src
export TAG=latest
yarn nx serve-deploylist cicd
