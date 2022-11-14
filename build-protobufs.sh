#!/usr/bin/bash

#
# export SRC_DIR=path to src path
# export TS_GEN_DIR to frontend src path
#

mkdir -p rpc
mkdir -p $TS_GEN_DIR/src/rpc/api/proto

for api in "ipc"
do
    protoc --go_out=rpc --proto_path=$SRC_DIR/ --proto_path=$SRC_DIR --go_opt=paths=source_relative proto/ipc/$api.proto
done

for api in "ipc"
do
    protoc --plugin="protoc-gen-ts=$TS_GEN_DIR/node_modules/.bin/protoc-gen-ts" --js_out="import_style=commonjs,binary:${TS_GEN_DIR}/src/rpc/api/proto/" --ts_out=$TS_GEN_DIR/src/rpc/api/proto/ --proto_path=$SRC_DIR/proto/ipc/ $api.proto
done
