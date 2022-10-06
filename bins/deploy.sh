#!/bin/sh
cd /home/ec2-user
export TAG=latest
yarn nx serve-deploylist cicd
