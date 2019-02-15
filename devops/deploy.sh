#!/bin/bash
set -xe

export SERVICE_NAME="web_admin"
export DOCKER_REPO="docker.hongchow.com:8443/uniform"
# 需要压缩的文件选项（未编译docker）
export ZIP="app/dist --transform s!^app/dist!html!g"
# 需要压缩的文件选项（编译docker）
export ZIP_COMPILE=""
# 是否需要清理空间
export NEED_CLEAN=yes

buildProj(){
    CDN="/"

    if [[ $BUILD_TYPE = "beta" ]]; then
        CDN="https://uniform-uat.h863.net/admin/"
    fi
    
    if [[ $BUILD_TYPE = "prod" ]]; then
        CDN="https://uniform-prod.h863.net/admin/"
    fi
    
    sudo cp -f $WORKSPACE/app/src/config/index-${BUILD_TYPE}.ts $WORKSPACE/app/src/config/index.ts
    
    docker run --rm -i -v "${WORKSPACE}/app:/src" -v "/data/node_modules/$SERVICE_NAME:/src/node_modules" -w "/src" node:8 yarn
    docker run --rm -i -v "${WORKSPACE}/app:/src" -v "/data/node_modules/$SERVICE_NAME:/src/node_modules" -w "/src" -e CDN=$CDN node:8 yarn build 

    if [[ $TAG = "" ]]; then
        sudo cp -f $WORKSPACE/devops/docker-compose.yaml $WORKSPACE/docker/docker-compose.yaml
    else
        sudo cp -f $WORKSPACE/devops/template.yaml $WORKSPACE/docker/docker-compose.yaml
    fi

    sudo sed -e "s!\$SERVICE_NAME!$SERVICE_NAME!g" -e "s!\$DOCKER_REPO!$DOCKER_REPO!g" -i $WORKSPACE/docker/docker-compose.yaml
}
