## Peer2Peer Library Contract.
{{lender}} (the Lender) agrees to lend {{borrower}} (the Borrower)
the itemName {{itemName}} ({{isbn}}) which is currently graded as {{grade}}.

In the case of the late return of the item, the Borrower shall pay to Lender
a fine amounting to {{fineAmount}} (EUR) for every {{fineDuration}} the item was returned overdue.
Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}. The total amount
of fine shall not however, exceed {{capPercentage}}% of the total value of the borrowed item.

{{#if exceptionCase}}The contract provides a provision to waive late penalties in the event of
extenuating circumstances. This is wholely at the discretion of the Lender 
and all decisions are final in this matter.{{/if}}
