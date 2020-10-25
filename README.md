# MSc in Computing - Developing Smart Contract Applications for the HyperLedger Fabric Platform

## Developing a Smart Contract

### The Use Case
TODO

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
TODO

### Contract Testing - Triggering Transaction
TODO

### Using Mocha for Unit Tests
TODO

## Setting up the HyperLedger Fabric
TODO

## Package Smart Contract Chaincode
TODO

## Install Chaincode
TODO
