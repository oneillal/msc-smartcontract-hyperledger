/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {
    ChaincodeStub,
    ClientIdentity
} = require('fabric-shim');
const {
    Peer2PeerLibrary
} = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

const contractText = `
{{#clause CTR_100002 src="ap://peer2peerlibrary@1.0#12345"}}
Peer2Peer Library Contract.
----
"Paul Power" (the Lender) agrees to lend "Alan O'Neill" (the Borrower)
the itemName "The Da Vinci Code" ("9780552149518") which is currently graded as "M".

In the case of the late return of the item, the Borrower shall pay to Lender
a fine amounting to 0.25 (EUR) for every 1 days the item was returned overdue.
Any fractional part of a days is to be considered a full days. The total amount
of fine shall not however, exceed 50.0% of the total value of the borrowed item.

The contract provides a provision to waive late penalties in the event of
extenuating circumstances. This is wholely at the discretion of the Lender
and all decisions are final in this matter.
{{/clause}}
`;

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.state = {
            "$class": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractState",
            "stateId": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContractState#0.0",
            "counter": 0.0,
            "finesBalance": 0.0
        };
        this.data = {
            "$class": "me.lend.contracts.peer2peerlibrary.Peer2PeerLibraryContract",
            "borrower": {
                "$class": "org.accordproject.cicero.contract.AccordParty",
                "partyId": "Alan O'Neill"
            },
            "lender": {
                "$class": "org.accordproject.cicero.contract.AccordParty",
                "partyId": "Paul Power"
            },
            "itemName":"The Da Vinci Code",
            "exceptionCase": false,
            "penaltyDuration": {
                "$class": "org.accordproject.time.Duration",
                "amount": 1,
                "unit": "days"
            },
            "penaltyFee": 0.25,
            "capPercentage": 50,
            "fractionalPart": "days",
            "contractId": "02381fe8-9180-4f09-8021-a7e4419f808d"
        };

        this.markdown = null;
        this.stub.getState.withArgs('Data-CTR_100002').resolves(Buffer.from(JSON.stringify(this.data)));
        this.stub.getState.withArgs('State-CTR_100002').resolves(Buffer.from(JSON.stringify(this.state)));

        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }
}

describe('Peer2PeerLibrary', () => {

    let contract;
    let ctx;

    beforeEach(async () => {});

    describe('#initialize', () => {
        it('initialize', async () => {
            contract = new Peer2PeerLibrary();
            ctx = new TestContext();
            ctx.stub.getState.withArgs('Markdown').resolves(null);
            await contract.init(ctx, contractText);
        });
    });
});
