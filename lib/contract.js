/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const { Clause, Template } = require('@accordproject/cicero-core');
const { Engine } = require('@accordproject/cicero-engine');
const { CiceroMarkTransformer } = require('@accordproject/markdown-cicero');
const bent = require('bent');
const getJSON = bent('json');

const path = require('path');
const fs = require('fs');

// /**
//  * Utility function to load the templates for a contract and to
//  * optionally initialize
//  * @param {*} ctx HLF context
//  * @param {*} contractText the markdown text for the contract
//  * @param {Boolean} initClauses when true the clauses are initialized
//  * @requires {Promise<*>} a map of templates
//  */
// async function loadTemplates(ctx, contractText, initClauses) {
//     if(!contractText || contractText.length === 0) {
//         throw new Error('ERROR: Must be initialized with markdown text');
//     }

//     const ciceroMarkTransformer = new CiceroMarkTransformer();
//     const dom = ciceroMarkTransformer.fromMarkdownCicero( contractText, 'json' );
//     console.log(`CiceroMark DOM ${JSON.stringify(dom, null, 4)}`);

//     // ensure all the embedded clauses parse, and save the clause data
//     const clauses = dom.nodes.filter( node => node.$class === 'org.accordproject.ciceromark.Clause' );
//     console.log(`Found ${clauses.length} clauses.`);

//     const templates = [];

//     // NEW CODE
//     //const templateDir = path.resolve(__dirassetId, '..', 'contract');
//     //

//     if(clauses.length > 0) {
//         console.log('Loading template index...');
//         const index = await getJSON('https://templates.accordproject.org/template-library.json');

//         for( let n=0; n < clauses.length; n++ ) {
//             const clauseNode = clauses[n];
//             const hashIndex = clauseNode.src.indexOf('#');
//             if(hashIndex <= 0) {
//                 throw new Error(`Invalid clause src: ${clauseNode.src}`);
//             }

//             const clauseId = clauseNode.src.substring( 5, hashIndex);
//             console.log(`Loading ${clauseId}...`);
//             const indexEntry = index[clauseId];
//             console.log(`Index entry ${JSON.stringify(indexEntry, null, 2)}`);

//             if(!indexEntry || !indexEntry.url) {
//                 throw new Error(`Failed to find URL for ${clauseId} in index.`);
//             }
//             const template = await Template.fromUrl( indexEntry.url );
//             templates[clauseNode.assetId] = template;
//             console.log(`Loaded template: ${template.getIdentifier()}` );

//             console.log(`Clause node: ${JSON.stringify(clauseNode, null, 2)}`);

//             // parse the text for the clause
//             const clauseText = ciceroMarkTransformer.getClauseText(clauseNode);
//             console.log(`Parsing text: ${clauseText}`);

//             // @ts-ignore
//             const clause = new Clause(template);
//             clause.parse(clauseText);
//             const clauseData = clause.getData();
//             if(template.getMetadata().getTemplateType() === 0) {
//                 clauseData.contractId = clauseNode.assetId; // ensure consistency across peers
//             }
//             else {
//                 clauseData.clauseId = clauseNode.assetId; // ensure consistency across peers
//             }
//             console.log(`Clause data: ${JSON.stringify(clauseData, null, 4)}`);
//             await ctx.stub.putState(`Data-${clauseNode.assetId}`, Buffer.from(JSON.stringify(clauseData)));

//             // initialize the clause
//             if(initClauses) {
//                 const engine = new Engine();
//                 const result = await engine.init(clause, null);
//                 console.info(`Response from init: ${JSON.stringify(result)}`);

//                 // save the state
//                 await ctx.stub.putState(`State-${clauseNode.assetId}`, Buffer.from(JSON.stringify(result.state)));

//                 // emit any events
//                 if (result.emit.length > 0) {
//                     await ctx.stub.setEvent('Init-Events', Buffer.from(JSON.stringify(result.emit)));
//                 }
//             }
//         }
//     }

//     return templates;
// }

/**
 * Utility function to load templates from disk for a contract and to
 * optionally initialize
 * @param {*} ctx HLF context
 * @param {*} contractText the markdown text for the contract
 * @param {Boolean} initClauses when true the clauses are initialized
 * @requires {Promise<*>} a map of templates
 */
async function loadTemplateFromDisk(ctx, contractText, initClauses) {
    if(!contractText || contractText.length === 0) {
        throw new Error('ERROR: Must be initialized with markdown text');
    }

    const ciceroMarkTransformer = new CiceroMarkTransformer();
    const dom = ciceroMarkTransformer.fromMarkdownCicero( contractText, 'json' );
    console.log(`CiceroMark DOM ${JSON.stringify(dom, null, 4)}`);
    
    // ensure all the embedded clauses parse, and save the clause data
    const clauses = dom.nodes.filter( node => node.$class === 'org.accordproject.ciceromark.Clause' );
    console.log(`Found ${clauses.length} clauses.`);

    const templates = [];

    if(clauses.length > 0) {
        console.log('Loading contract template...');

        for( let n=0; n < clauses.length; n++ ) {
            const clauseNode = clauses[n];

            // load from contract dir
            const templateDir = path.resolve(__dirassetId, '..', 'peer2peerlibrary');
            const template = await Template.fromDirectory(templateDir);

            templates[clauseNode.assetId] = template;
            console.log(`Loaded template: ${template.getIdentifier()}` );

            console.log(`Clause node: ${JSON.stringify(clauseNode, null, 2)}`);

            // parse the text for the clause
            const clauseText = ciceroMarkTransformer.getClauseText(clauseNode);
            console.log(`Parsing text: ${clauseText}`);

            // @ts-ignore
            const clause = new Clause(template);
            clause.parse(clauseText);
            const clauseData = clause.getData();
            if(template.getMetadata().getTemplateType() === 0) {
                clauseData.contractId = clauseNode.assetId; // ensure consistency across peers
            }
            else {
                clauseData.clauseId = clauseNode.assetId; // ensure consistency across peers
            }
            console.log(`Clause data: ${JSON.stringify(clauseData, null, 4)}`);
            await ctx.stub.putState(`Data-${clauseNode.assetId}`, Buffer.from(JSON.stringify(clauseData)));

            // initialize the clause
            if(initClauses) {
                const engine = new Engine();
                const result = await engine.init(clause, null);
                console.info(`Response from init: ${JSON.stringify(result)}`);

                // save the state
                await ctx.stub.putState(`State-${clauseNode.assetId}`, Buffer.from(JSON.stringify(result.state)));

                // emit any events
                if (result.emit.length > 0) {
                    await ctx.stub.setEvent('Init-Events', Buffer.from(JSON.stringify(result.emit)));
                }
            }
        }
    }

    return templates;
}

/**
 * Ensures that the smart contract has been initialized
 * @param {*} ctx HLF context
 * @param {*} assetId the assetId of a clause present within the markdown text
 * @returns {Promise<string>} the markdown string
 */
async function ensureInitialized(ctx, assetId) {
    const markdown = await ctx.stub.getState(`Markdown-${assetId}`);

    if(!markdown || markdown.toString().length === 0) {
        throw new Error('ERROR: contract has not been initialized');
    }

    return markdown.toString();
}

/**
 * Ensures that the smart contract has NOT been initialized
 * @param {*} ctx HLF context
 */
async function ensureNotInitialized(ctx) {
    // const markdownAsBytes = await ctx.stub.getState('Markdown');

    // if(markdownAsBytes && markdownAsBytes.toString().length > 0) {
    //     throw new Error('ERROR: contract has already been initialized');
    // }
}

/**
 * Executes an Accord Project CiceroMark contract within
 * Hyperledger Fabric chaincode.
 */
class Peer2PeerLibrary extends Contract {

    constructor() {
        super();
        this.templates = {};
    }

    /**
     * Rebuilds the in-memory list of templates after contract has been upgraded.
     * @param {*} ctx the HLF context
     */
    async upgrade(ctx) {
        const markdown = await ensureInitialized(ctx);
        this.templates = await loadTemplates(ctx, markdown, false );
    }

    /**
     * One-time initialization function for the contract. The markdown
     * text for the contract is parsed and the templates for all the embedded
     * clauses are loaded and prepared.
     *
     * @param {*} ctx the HLF context
     * @param {*} contractText the markdown text for the contract
     * @param {*} assetId the assetId of a clause present within the markdown text passed to initialize
     * @returns {Promise<*>} a message
     */
    async itemBorrow(ctx, contractText, assetId) {

        await ensureNotInitialized(ctx, assetId);

        // the sample code only works with remote contract archives
        //this.templates = await loadTemplates(ctx, contractText, true );
        
        // load my local contract template folder
        this.templates = await loadTemplateFromDisk(ctx, contractText, true );

        // save the markdown text
        await ctx.stub.putState(`Markdown-${assetId}`, Buffer.from(contractText));
        return `Initialized ${Object.keys(this.templates).length} clauses.`;
    }

    /**
     * Triggers a specified clause within the contract, passing a request JSON as input.
     * @param {*} ctx the HLF context
     * @param {*} requestText the JSON text for an incoming request
     * @param {*} assetId the assetId of a clause present within the markdown text passed to initialize
     * @returns {Promise<*>} the response from the triggered clause
     */
    async itemReturn(ctx, requestText, assetId) {

        await ensureInitialized(ctx, assetId);

        if(!assetId) {
            throw new Error('ERROR: Clause assetId not specified.');
        }

        console.log(`Triggering clause ${assetId}...`);

        if(!requestText) {
            throw new Error('ERROR: Request JSON missing.');
        }

        // load state
        const stateAsBytes = await ctx.stub.getState(`State-${assetId}`);
        if (!stateAsBytes) {
            throw new Error(`ERROR: No state found for clause ${assetId}`);
        }
        console.log('Loaded state: ' + stateAsBytes);
        const state = JSON.parse(stateAsBytes.toString());

        // load the clause data
        const clauseDataAsBytes = await ctx.stub.getState(`Data-${assetId}`);
        if (!clauseDataAsBytes) {
            throw new Error(`ERROR: No data found for clause ${assetId}`);
        }
        console.log('Loaded clause data: ' + clauseDataAsBytes);
        const clauseData = JSON.parse(clauseDataAsBytes.toString());

        // parse the request
        console.log('Got request: ' + requestText);
        const request = JSON.parse(requestText);

        // set the clause data
        const template = this.templates[assetId];
        if(!template) {
            throw new Error(`ERROR: no template found for clause with assetId: ${assetId}`);
        }
        // @ts-ignore
        const clause = new Clause(template);
        // @ts-ignore
        clause.setData(clauseData);

        // execute the Cicero engine
        const engine = new Engine();
        const result = await engine.trigger(clause, request, state, null);
        result.response.transactionId = ctx.stub.getTxID(); // ensure consistency across peers
        result.response.timestamp = ctx.stub.getTxTimestamp(); // ensure consistency across peers
        console.info(`Response from engine execute: ${JSON.stringify(result)}`);

        // save the state
        await ctx.stub.putState(`State-${assetId}`, Buffer.from(JSON.stringify(result.state)));

        // emit any events
        if (result.emit.length > 0) {
            result.emit.forEach( (event,index) => {
                event.transactionId = ctx.stub.getTxID(); // ensure consistency across peers
                event.timestamp = ctx.stub.getTxTimestamp(); // ensure consistency across peers
                ctx.stub.setEvent(`${request.transactionId}-Event-${index}`, Buffer.from(JSON.stringify(event)));
            });
        }

        console.info(`Result response: ${JSON.stringify(result.response)}`);

        // return the response
        return result.response;
    }

    async queryAssetState(ctx, assetId) {
        const stateAsBytes = await ctx.stub.getState(`State-${assetId}`); // get the state from chaincode
        if (!stateAsBytes || stateAsBytes.length === 0) {
            throw new Error(`State-${assetId} state does not exist`);
        }
        console.log(stateAsBytes.toString());
        return stateAsBytes.toString();
    }

    async queryAssetData(ctx, assetId) {
        const dataAsBytes = await ctx.stub.getState(`Data-${assetId}`); // get the data from chaincode state
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`Data-${assetId} does not exist`);
        }
        console.log(dataAsBytes.toString());
        return dataAsBytes.toString();
    }

    async queryAsset(ctx, assetId) {
        const markdown = await ctx.stub.getState(`Markdown-${assetId}`);
        if(!markdown || markdown.toString().length === 0) {
            throw new Error('ERROR: contract has not been initialized');
        }
        console.log(markdown.toString());
        return markdown.toString();
    }

    async queryAssetHistoryByKey(ctx, assetId) {
        let iterator = await ctx.stub.getHistoryForKey(`State-${assetId}`);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
          if (res.value) {
            const obj = JSON.parse(res.value.value.toString('utf8'));
            result.push(obj);
          }
          res = await iterator.next();
        }
        await iterator.close();
        console.info(result);
        return JSON.stringify(result);
    }
}

module.exports = Peer2PeerLibrary;