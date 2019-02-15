#!/bin/bash
set -xe

IMAGE_TAG="$DOCKER_REPO/$SERVICE_NAME:$VERSION"

cd $WORKSPACE

sudo rm -f devops/image/*.tar.gz
sudo tar -czvf devops/image/html.tar.gz $ZIP

cd devops/image/
# build
sudo docker build -t $IMAGE_TAG -f Dockerfile .
# push
sudo docker push $IMAGE_TAG
# clean
sudo rm -f *.tar.gz

# 更改版本号
sudo sed -e "s/\$VERSION/$VERSION/g" -i $WORKSPACE/docker/docker-compose.yaml;

