#!/bin/sh
# chmod +x /home/ec2-user/generated_deploy.sh
# /home/ec2-user/generated_deploy.sh

cd /home/ec2-user
yarn nx serve-deploylist cicd
