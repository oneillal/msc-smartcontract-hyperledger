# MSc in Computing - Developing Smart Contract Applications for the HyperLedger Fabric Platform

## Developing a Smart Contract

### The Use Case
This paper examines a Library use-case and the lender/borrower relationship. We provide an in-depth analysis of a development of a smart contract and client application running on the HyperLedger platform. 

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

// TODO: the Cicero language and cli

```
Peer2Peer Library Contract.
----
"Paul Power" (the Lender) agrees to lend "Alan O'Neill" (the Borrower)
the itemName "The Da Vinci Code" (IBSN "9780552149518") which is currently 
graded as "VG".

In the case of the late return of the item, the Borrower shall pay to Lender
a fine amounting to 0.25 (EUR) for every 1 days the item was returned overdue.
Any fractional part of a days is to be considered a full days. The total amount
of fine shall not however, exceed 50.0% of the total value of the borrowed item.

The contract provides a provision to waive late penalties in the event of
extenuating circumstances. This is wholely at the discretion of the Lender
and all decisions are final in this matter.
```

### Contract Testing - Parsing 
![](docs/images/testing_cicero_contract_parse1.png)

### Contract Testing - Triggering Transaction
![](docs/images/testing_cicero_contract_parse1.png)

### Using Mocha for Unit Tests
// TODO:

### Errors

Any formatting of the contract text requires careful attention to corresponding requests and tests.
![](docs/images/testing_cicero_error2.png)

The following error prevented test cases passing successfully.
![](docs/images/testing_cicero_error1.png)

### Debugging Contract Issues

From a development perspective, being able to develop locally with minimal dependencies is desireable. Since we cannot attach a debugger directly to chaincode running on-chain, we need to be able to test without a HyperLedger Fabric network involved.

Thankfully, we can use our Mocha tests and attach the debugger as normal.
![](docs/images/cicero_debugging1.png)


## HyperLedger Fabric

### Setting up the Fabric Network
Using the HyperLedger Fabric sample "test-network", we create a two org network with a single peer in each org.

![](docs/images/hlf_network1.png)

```
➜  msc-smartcontract-hyperledger git:(peer2peerlibrary) ✗ docker ps --format='table {{.ID}}\t{{.Image}}\t{{.Command}}\t{{.RunningFor}}\t{{.Names}}'
CONTAINER ID        IMAGE                               COMMAND                  CREATED             NAMES
8e7c5c4fbaa0        hyperledger/fabric-peer:latest      "peer node start"        About an hour ago   peer0.org2.lend.me
285a4056e6ca        hyperledger/fabric-peer:latest      "peer node start"        About an hour ago   peer0.org1.lend.me
b5fa8eddfc25        hyperledger/fabric-orderer:latest   "orderer"                About an hour ago   orderer.lend.me
a78446f8b90b        couchdb:3.1.1                       "tini -- /docker-ent…"   About an hour ago   couchdb0
99005fdf8795        couchdb:3.1.1                       "tini -- /docker-ent…"   About an hour ago   couchdb1
6c0e78fac51d        hyperledger/fabric-ca:latest        "sh -c 'fabric-ca-se…"   About an hour ago   ca_org2
5f9a6585a79e        hyperledger/fabric-ca:latest        "sh -c 'fabric-ca-se…"   About an hour ago   ca_orderer
fae62de87479        hyperledger/fabric-ca:latest        "sh -c 'fabric-ca-se…"   About an hour ago   ca_org1
```

By stopping one of the chain-code containers, what happens when submitting another transaction?
`docker stop dev-peer0.org1.lend.me-peer2peerlibrary_1.0.0-ae83f25e52b526eda8126766069f34bd1a3f7a2d79e3c7f5b5aa8ad6eba4ea53`

We try to trigger a transaction and we receive a consensus error:

```
2020-10-25T09:42:58.932Z - warn: [TransactionEventHandler]: strategyFail: commit failure for transaction "70944848533e78d554f0f7ec1358913ba70c74a77874a7a25e3145d89346c719": TransactionError: Commit of transaction 70944848533e78d554f0f7ec1358913ba70c74a77874a7a25e3145d89346c719 failed on peer peer0.org1.lend.me:7051 with status ENDORSEMENT_POLICY_FAILURE
******** FAILED to run the application: TransactionError: Commit of transaction 70944848533e78d554f0f7ec1358913ba70c74a77874a7a25e3145d89346c719 failed on peer peer0.org1.lend.me:7051 with status ENDORSEMENT_POLICY_FAILURE
```
![](docs/images/consensus_error1.png)

Container orchestration layer such as Kubernetes would attempt to guarantee desired state so this would be beneficial to ensure consistency at the container level and thus ensure consensus.

### Debugging
// TODO: how to debug smart contracts locally since they cannot be debugged after installed on chain?

### Testing

![](docs/images/fabric-query-contract1.png)
![](docs/images/fabric-query-data1.png)

## Developing a HyperLedger Client Application

Real-world smart contracts will likely contain functions using complex types or verbose data that is passed via arguments. This makes testing with the Fabric cli difficult e.g. passing contract verbiage or json payloads. A more realistic and manageable approach would be to develop a client application using a supported language and leverage common libraries and utilities that are available.

Using the tutorial sample applications, we develop a client application that interacts with the ledger and smart contract chain-code for the described use-case. We will use Javascript initially and compare the development of other chain-code languages if time permits.

https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html

The samples provide utilities to create and register users and wallets.

### Errors

User identities from previous tests cannot be reused and must be deleted. The client app will then recreate and register the users.

```
Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 0,
    message:
     'Registration of \'appUser\' failed: Identity \'appUser\' is already registered' } ]]
******** FAILED to run the application: Error: Identity not found in wallet: appUser
```
*Upgrade issues*
`WARNING Local fabric-ca binaries and docker images are out of sync. This may cause problems.`

### CICD

1. Use CLI container
2. Use docker client to run HLF commands on specific containers. For example:

`docker exec peer0.org1.lend.me peer chaincode query -C mychannel -n peer2peerlibrary -c '{"function":"queryState","Args":["CTR_100002"]}'`


## Distributed Ledger on PaaS
// TODO:


## References
https://dl.acm.org/doi/pdf/10.1109/WETSEB.2019.00013?download=true
https://iopscience.iop.org/article/10.1088/1742-6596/1187/5/052005/pdf