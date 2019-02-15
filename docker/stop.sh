#!/bin/bash
set -xe

BASE_PATH=$(cd `dirname $0`; pwd)
cd $BASE_PATH

sudo docker-compose down
