 Scenario: The contract should say Hello to Betty Buyer, from the ACME Corporation
    When it receives the request
"""
{
    "$class": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractRequest",
    "itemName":"The Da Vinci Code",
    "exceptionCase": false,
    "agreedReturn": "2020-09-13T23:59:59-00:00",
    "returnedOn": "2020-10-15T23:59:59-00:00",
    "itemValue": 24.99
}
"""
    Then it should respond with
"""
{
  "clause": "peer2peerlibrary@1.0.0-f6030abcca08c5fe546f6ff7f47a92184e2410e2b6ff1ec33fc44cc1d85227da",
  "request": {
    "$class": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractRequest",
    "itemName": "The Da Vinci Code",
    "exceptionCase": false,
    "agreedReturn": "2020-09-13T23:59:59-00:00",
    "returnedOn": "2020-10-15T23:59:59-00:00",
    "itemValue": 24.99
  },
  "response": {
    "$class": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractResponse",
    "itemName": "The Da Vinci Code",
    "fine": 8,
    "transactionId": "baa49c9d-5b4a-4b17-ac28-8a955f9675a7",
    "timestamp": "2020-12-20T08:31:54.144Z"
  },
  "state": {
    "$class": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractState",
    "counter": 1,
    "finesBalance": 8,
    "stateId": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractState#null"
  },
  "emit": [
    {
      "$class": "org.accordproject.cicero.runtime.PaymentObligation",
      "amount": {
        "$class": "org.accordproject.money.MonetaryAmount",
        "doubleValue": 8,
        "currencyCode": "EUR"
      },
      "description": "Alan O'Neill should pay fine amount to Paul Power for the late return of The Da Vinci Code",
      "contract": "resource:me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContract#3dfc7b6b-55a5-4284-982d-cc21d7219d15",
      "promisor": "resource:org.accordproject.cicero.contract.AccordParty#Paul%20Power",
      "promisee": "resource:org.accordproject.cicero.contract.AccordParty#Alan%20O'Neill",
      "eventId": "valid",
      "timestamp": "2020-12-20T08:31:54.146Z"
    }
  ]
}
"""