#!/bin/sh
cd /home/ec2-user/src
yarn
export TAG=$(npm pkg get version | cut -d'"' -f2)
yarn nx serve-deploylist cicd
