#!/bin/sh
cd /home/ec2-user/src
yarn
export TAG=$(npm pkg get version --raw)
yarn nx serve-deploylist cicd
