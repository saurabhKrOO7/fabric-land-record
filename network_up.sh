#!/bin/bash

# ==== Paths ====
TEST_NETWORK=./fabric-samples/test-network
CHAINCODE_NAME=landrecords
CHAINCODE_PATH=../../chaincode/landrecords
CHAINCODE_LANG=javascript
CHAINCODE_VERSION=1.0
CHAINCODE_SEQUENCE=1
CHANNEL_NAME=mychannel

# ==== Set Fabric binary and config path (relative to this main folder) ====
export PATH=$PWD/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=$PWD/fabric-samples/config


echo "🔻 Shutting down network..."
cd $TEST_NETWORK
./network.sh down

echo "🟢 Starting network and creating channel..."
./network.sh up createChannel -ca

echo "📦 Deploying chaincode: $CHAINCODE_NAME"
echo "👉 Deploying with CHAINCODE_LANG = $CHAINCODE_LANG"

./network.sh deployCC \
  -ccn $CHAINCODE_NAME \
  -ccp $CHAINCODE_PATH \
  -ccl $CHAINCODE_LANG \
  -ccv $CHAINCODE_VERSION \
  -ccs $CHAINCODE_SEQUENCE \
  -ccep "OR('Org1MSP.peer','Org2MSP.peer')"
