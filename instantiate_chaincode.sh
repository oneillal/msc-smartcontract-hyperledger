
#
# You must install `jq` to run this script
#
# Run this script from the root of the hlf-peer2peerlibrary-contract directory
# the script packages the chaincode and then installs it onto org1 and org2
# it is based on: https://hyperledger-fabric.readthedocs.io/en/master/deploy_chaincode.html#install-the-chaincode-package

# set these two values based on your HLF install location
export HLF_TEST_NETWORK=${HLF_INSTALL_DIR}/test-network
# end set

rm *.tar.gz
npm install

export PATH=${HLF_INSTALL_DIR}/bin:$PATH
export FABRIC_CFG_PATH=${HLF_INSTALL_DIR}/config/
peer version

# package the chaincode
export CC_VERSION=$(cat package.json | jq -r ".version")
echo Packaging chaincode ${CC_VERSION}
peer lifecycle chaincode package peer2peerlibrary_${CC_VERSION}.tar.gz --path . --lang node --label peer2peerlibrary_${CC_VERSION}

# install on org1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.lend.me/peers/peer0.org1.lend.me/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.lend.me/users/Admin@org1.lend.me/msp
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode install peer2peerlibrary_${CC_VERSION}.tar.gz
echo Installed on org1

# install on org2
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org2.lend.me/peers/peer0.org2.lend.me/tls/ca.crt
export CORE_PEER_TLS_ROOTCERT_FILE=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org2.lend.me/peers/peer0.org2.lend.me/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org2.lend.me/users/Admin@org2.lend.me/msp
export CORE_PEER_ADDRESS=localhost:9051

peer lifecycle chaincode install peer2peerlibrary_${CC_VERSION}.tar.gz
echo Installed on org2

# get the last installed package id for the CC version
peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r "[.installed_chaincodes[] | select(.label == \"peer2peerlibrary_${CC_VERSION}\") | .package_id][-1]")
echo "Chaincode package id: " ${CC_PACKAGE_ID}

# get the sequence number to use
export CC_SEQUENCE=$(peer lifecycle chaincode querycommitted --channelID channel1 peer2peerlibrary --output json | jq -r ".chaincode_definitions[0].sequence+1")
echo "Sequence number" ${CC_SEQUENCE}

# approveformyorg
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.lend.me --channelID channel1 --name peer2peerlibrary --version ${CC_VERSION} --package-id $CC_PACKAGE_ID --sequence ${CC_SEQUENCE} --tls --cafile ${HLF_TEST_NETWORK}/organizations/ordererOrganizations/lend.me/orderers/orderer.lend.me/msp/tlscacerts/tlsca.lend.me-cert.pem
echo "Approved for org2"

# approve chaincode org1
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.lend.me/users/Admin@org1.lend.me/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.lend.me/peers/peer0.org1.lend.me/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.lend.me --channelID channel1 --name peer2peerlibrary --version ${CC_VERSION} --package-id $CC_PACKAGE_ID --sequence ${CC_SEQUENCE} --tls --cafile ${HLF_TEST_NETWORK}/organizations/ordererOrganizations/lend.me/orderers/orderer.lend.me/msp/tlscacerts/tlsca.lend.me-cert.pem
echo "Approved for org1"

peer lifecycle chaincode checkcommitreadiness --channelID channel1 --name peer2peerlibrary --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --tls --cafile ${PWD}/organizations/ordererOrganizations/lend.me/orderers/orderer.lend.me/msp/tlscacerts/tlsca.lend.me-cert.pem --output json
echo "checkcommitreadiness"

# we commit the chaincode
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.lend.me --channelID channel1 --name peer2peerlibrary --version ${CC_VERSION} --sequence ${CC_SEQUENCE} --tls --cafile ${HLF_TEST_NETWORK}/organizations/ordererOrganizations/lend.me/orderers/orderer.lend.me/msp/tlscacerts/tlsca.lend.me-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.lend.me/peers/peer0.org1.lend.me/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${HLF_TEST_NETWORK}/organizations/peerOrganizations/org2.lend.me/peers/peer0.org2.lend.me/tls/ca.crt
echo "chaincode committed"
