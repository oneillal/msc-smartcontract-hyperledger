# MSc in Computing - Developing Smart Contract Applications for the HyperLedger Fabric Platform

## Developing a Smart Contract

### The Use Case
This paper examines a Library use-case and the lender/borrower relationship. We provide an in-depth analysis of a development of a smart contract and client application running on the Hyperledger platform. 

### Setting Up a Development Environment

The following are required:

```
Git client
Go version 1.14.x
Docker version 18.03 or later
SoftHSM
jq
```

### Accord Project Contracts

Using VS Code...
![](docs/images/vscode-contract-wiz1.png)
![](docs/images/vscode-contract-wiz2.png)
![](docs/images/vscode-contract-wiz3.png)
![](docs/images/vscode-contract-wiz4.png)


### The Contract Text

```
## Dublin CoCo Libraries - Late Returns.

In case of a overdue return of an item {{lender}} (the Lender) shall 
pay to {{borrower}} (the Borrower) a fine amounting to {{fineAmount}} (EUR)
for every {{fineDuration}} the item was returned overdue. Any fractional part
of a {{fractionalPart}} is to be considered a full {{fractionalPart}}. The total amount of fine 
shall not however, exceed {{capPercentage}}% of the total value of the borrowed item.

{{#if exceptionCase}}The contract provides a provision to waive late penalties in the event
of extenuating circumstances. This is wholey at the disgresion of the
Lender and all decisions are final in this matter.{{/if}}
```
### Contract Testing - Parsing 
![](docs/images/testing_cicero_contract_parse1.png)

### Contract Testing - Triggering Transaction
![](docs/images/testing_cicero_contract_parse1.png)

### Using Mocha for Unit Tests
// TODO:

### Errors
![](docs/images/testing_cicero_error1.png)


## HyperLedger Fabric

### Setting up the Fabric Network
Using the HyperLedger Fabric sample "test-network", we create a two org network with a single peer in each org.

![](docs/images/hlf_network1.png)

```
➜  msc-smartcontract-hyperledger git:(master) ✗ docker ps -a
CONTAINER ID        IMAGE                                                                                                                                                                        COMMAND                  CREATED             STATUS                    PORTS                              NAMES
1d55e3d36a92        dev-peer0.org1.example.com-cicero_0.61.5-e3b57bb63223f03c3f0544be5438312094bd15de0f113672bf49af4fcf008c70-7bebf5f93175f1ca74b105c03dcfb9472d46da63caafe208d161551afe3bbfba   "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes                                                 dev-peer0.org1.example.com-cicero_0.61.5-e3b57bb63223f03c3f0544be5438312094bd15de0f113672bf49af4fcf008c70
7c2b46aa9519        dev-peer0.org2.example.com-cicero_0.61.5-e3b57bb63223f03c3f0544be5438312094bd15de0f113672bf49af4fcf008c70-34900bfd119f86581b2ccb84b7607a34ee428e44fd1d4cd5a39226ad18dc5756   "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes                                                 dev-peer0.org2.example.com-cicero_0.61.5-e3b57bb63223f03c3f0544be5438312094bd15de0f113672bf49af4fcf008c70
7d9faf494574        hyperledger/fabric-orderer:latest                                                                                                                                            "orderer"                5 minutes ago       Up 5 minutes              0.0.0.0:7050->7050/tcp             orderer.example.com
89300853c250        hyperledger/fabric-peer:latest                                                                                                                                               "peer node start"        5 minutes ago       Up 5 minutes              0.0.0.0:7051->7051/tcp             peer0.org1.example.com
985d011b3411        hyperledger/fabric-peer:latest                                                                                                                                               "peer node start"        5 minutes ago       Up 5 minutes              7051/tcp, 0.0.0.0:9051->9051/tcp   peer0.org2.example.com
96ab7ae912b7        hyperledger/fabric-ca:latest                                                                                                                                                 "sh -c 'fabric-ca-se…"   5 minutes ago       Up 5 minutes              7054/tcp, 0.0.0.0:9054->9054/tcp   ca_orderer
118e291f266f        hyperledger/fabric-ca:latest                                                                                                                                                 "sh -c 'fabric-ca-se…"   5 minutes ago       Up 5 minutes              0.0.0.0:7054->7054/tcp             ca_org1
e3f72df8a93c        hyperledger/fabric-ca:latest                                                                                                                                                 "sh -c 'fabric-ca-se…"   5 minutes ago       Up 5 minutes              7054/tcp, 0.0.0.0:8054->8054/tcp   ca_org2
```

### Package Smart Contract Chaincode
`peer lifecycle chaincode package latereturns_1.0.tar.gz --path . --lang node --label latereturns_1.0`

### Target an Org
```
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${HLF_TEST_NETWORK}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

### Install Chaincode (Terminology????)
`peer lifecycle chaincode install latereturns_1.0.tar.gz`

### Query Installed Chaincode
```
➜  msc-smartcontract-hyperledger git:(master) ✗ peer lifecycle chaincode queryinstalled
Installed chaincodes on peer:
Package ID: latereturns_1.0:b31664a41d11de1ef73e93f2366aed91cd982229f15ce8d16843a88e3236e221, Label: latereturns_1.0
```

### Approve the Chaincode (Terminology???)
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name latereturns --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${HLF_TEST_NETWORK}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
echo "Approved for org2"


## Testing

### Consensus Failure
Investigation into what happens if any one of the components fails and what is the recovery process etc.


```
docker ps
CONTAINER ID        IMAGE                                                                                                                                                                            COMMAND                  CREATED             STATUS              PORTS                              NAMES
4cd31cdedf71        dev-peer0.org1.example.com-latereturns_1.0.0-ae83f25e52b526eda8126766069f34bd1a3f7a2d79e3c7f5b5aa8ad6eba4ea53-974d61e42d19151e1b415bd3d5c20fb5d9655d161d599afb45ca9e3a4c59e1f1   "docker-entrypoint.s…"   8 minutes ago       Up 8 minutes                                           dev-peer0.org1.example.com-latereturns_1.0.0-ae83f25e52b526eda8126766069f34bd1a3f7a2d79e3c7f5b5aa8ad6eba4ea53
89e25abe2999        dev-peer0.org2.example.com-latereturns_1.0.0-ae83f25e52b526eda8126766069f34bd1a3f7a2d79e3c7f5b5aa8ad6eba4ea53-c42c0b248b29929e51ce32a2d6d70177a52d5e7102c9d731c5997a012095283d   "docker-entrypoint.s…"   8 minutes ago       Up 8 minutes                                           dev-peer0.org2.example.com-latereturns_1.0.0-ae83f25e52b526eda8126766069f34bd1a3f7a2d79e3c7f5b5aa8ad6eba4ea53
bdc4f0f6099e        hyperledger/fabric-peer:latest                                                                                                                                                   "peer node start"        About an hour ago   Up 8 minutes        0.0.0.0:7051->7051/tcp             peer0.org1.example.com
e5695e4eb7c1        hyperledger/fabric-peer:latest                                                                                                                                                   "peer node start"        About an hour ago   Up 8 minutes        7051/tcp, 0.0.0.0:9051->9051/tcp   peer0.org2.example.com
03260bb678dc        hyperledger/fabric-orderer:latest                                                                                                                                                "orderer"                About an hour ago   Up 8 minutes        0.0.0.0:7050->7050/tcp             orderer.example.com
```

By stopping one of the chain-code containers, what happens when submitting another transaction?
`docker stop dev-peer0.org1.example.com-latereturns_1.0.0-ae83f25e52b526eda8126766069f34bd1a3f7a2d79e3c7f5b5aa8ad6eba4ea53`

We try to trigger a transaction and we receive a consensus error:

```
2020-10-25T09:42:58.932Z - warn: [TransactionEventHandler]: strategyFail: commit failure for transaction "70944848533e78d554f0f7ec1358913ba70c74a77874a7a25e3145d89346c719": TransactionError: Commit of transaction 70944848533e78d554f0f7ec1358913ba70c74a77874a7a25e3145d89346c719 failed on peer peer0.org1.example.com:7051 with status ENDORSEMENT_POLICY_FAILURE
******** FAILED to run the application: TransactionError: Commit of transaction 70944848533e78d554f0f7ec1358913ba70c74a77874a7a25e3145d89346c719 failed on peer peer0.org1.example.com:7051 with status ENDORSEMENT_POLICY_FAILURE
```
![](docs/images/consensus_error1.png)

Container orchestration layer such as Kubernetes would attempt to guarantee desired state so this would be beneficial to ensure consistency at the container level and thus ensure consensus.


## Developing a HyperLedger Client Application

Using the tutorial sample applications, we develop a client application that interacts with the ledger and smart contract chain-code. We will use Javascript initially and compare the development of other chain-code languages if time permits.

https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html

The samples provide utilities to create and register users and wallets.


## Distributed Ledger on PaaS
// TODO:


## References
https://dl.acm.org/doi/pdf/10.1109/WETSEB.2019.00013?download=true
https://iopscience.iop.org/article/10.1088/1742-6596/1187/5/052005/pdf