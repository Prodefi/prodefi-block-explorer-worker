export const swaggerDocument = {
    "swagger": "2.0",
    "info": {
        "title": "RCP EXPLORER SERVER",
        "description": "Document for RCP Explorer!...",
        "version": "0.0.1"
    },
    "supportedSubmitMethods": ['get', 'post', 'put', 'delete'],
    "produces": ["application/json"],
    "paths": {
        "/status": {
            "get": {
                "tags": ["STATUS MANAGEMENT"],
                "summary": "check status of server",
                "produces": ["application/json", "application/xml"],
                "parameters": [],
                "responses": {}
            }

        },
        "/api/v1/blocks/latest": {
            "get": {
                "tags": ["BLOCK MANAGEMENT"],
                "summary": "get infomation of the latest block",
                "produces": ["application/json", "application/xml"],
                "parameters": [],
                "responses": {}
            }
        },
        "/api/v1/blocks/{height}": {
            "get": {
                "tags": ["BLOCK MANAGEMENT"],
                "summary": "get infomation of the block by height",
                "produces": ["application/json", "application/xml"],
                "parameters": [{
                    "name": "height",
            		"in": "path",
            		"description": "block height",
            		"required": true,
            		"type": "number"
                }],
                "responses": {}
            }
        },
        "/api/v1/blocks/custom/listing": {
            "get": {
                "tags": ["BLOCK MANAGEMENT"],
                "summary": "get infomation of the latest blocks",
                "produces": ["application/json", "application/xml"],
                "parameters": [
                    {
                        "name": "proposerAddress",
                        "in": "query",
                        "type": "string"
                    },
                    {
                        "name": "pdtvalconsAddress",
                        "in": "query",
                        "type": "string"
                    },
                    {
                        "name": "consensusPubkey",
                        "in": "query",
                        "type": "string"
                    },
                    {
                    "name": "limit",
                    "in": "query",
                    "type": "integer",
                    "default": "5"
                    },
                    {
                    "name": "page",
                    "in": "query",
                    "type": "integer",
                    "default": "1"
                }],
                "responses": {}
            }
        },
        "/api/v1/txs/latest": {
            "get": {
                "tags": ["TRANSACTION MANAGEMENT"],
                "summary": "get infomation of the latest transaction",
                "produces": ["application/json", "application/xml"],
                "parameters": [],
                "responses": {}
            }
        },
        "/api/v1/txs/custom/listing": {
            "get": {
                "tags": ["TRANSACTION MANAGEMENT"],
                "summary": "get infomation of the latest transactions",
                "produces": ["application/json", "application/xml"],
                "parameters": [
                    {
                        "name": "limit",
                        "in": "query",
                        "type": "integer",
                        "default": "5"
                    },
                    {
                        "name": "page",
                        "in": "query",
                        "type": "integer",
                        "default": "1"
                    },
                    { "name": "previousPage", "in": "query", "type": "integer" },
                    { "name": "previousFirstItemId", "in": "query", "type": "string" }
                ],
                "responses": {}
            }
        },
        "/api/v1/txs": {
            "get": {
                "tags": ["TRANSACTION MANAGEMENT"],
                "summary": "search transactions",
                "produces": ["application/json", "application/xml"],
                "parameters": [
                    {
                        "name": "message.action",
                        "in": "query",
                        "type": "string",
                        "default": "send",
                        "description": "transaction events such as ‘message.action=send’ which results in the following endpoint: 'GET /txs?message.action=send’. note that each module documents its own events. look for xx_events.md in the corresponding cosmos-sdk/docs/spec directory"
                    },
                    {
                        "name": "message.sender",
                        "in": "query",
                        "type": "string",
                        "default": "cosmos16xyempempp92x9hyzz9wrgf94r6j9h5f06pxxv",
                        "description": "transaction tags with sender: ‘GET /txs?message.action=send&message.sender=cosmos16xyempempp92x9hyzz9wrgf94r6j9h5f06pxxv’"
                    },
                    {
                        "name": "page",
                        "in": "query",
                        "type": "integer",
                        "default": 1,
                        "description": "Page number"
                    },
                    {
                        "name": "limit",
                        "in": "query",
                        "type": "integer",
                        "default": 1,
                        "description": "Maximum number of items per page"
                    },
                    {
                        "name": "tx.minheight",
                        "in": "query",
                        "type": "integer",
                        "default": 25,
                        "description": "transactions on blocks with height greater or equal this value"
                    },
                    {
                        "name": "tx.maxheight",
                        "in": "query",
                        "type": "integer",
                        "default": 800000,
                        "description": "transactions on blocks with height less than or equal this value"
                    }


                ],
                "responses": {}
            }
        },
        "/api/v1/txs/{tx}": {
			"get": {
				"tags": ["TRANSACTION MANAGEMENT"],
				"summary": "Retrieve a transaction from tx.",
				"produces": [ "application/json"],
				"parameters": [{
					"name": "tx",
            		"in": "path",
            		"description": "Tx",
            		"required": true,
            		"type": "string"
				}],
				"responses": {}
            }
        },
        "/api/v1/txhash/{hash}": {
			"get": {
				"tags": ["TRANSACTION MANAGEMENT"],
				"summary": "Retrieve a transaction using its hash.",
				"produces": [ "application/json"],
				"parameters": [{
					"name": "hash",
            		"in": "path",
            		"description": "Tx hash",
            		"required": true,
            		"type": "string"
				}],
				"responses": {}
            }
        },
        "/api/v1/validatorsets/latest": {
            "get": {
                "tags": ["VALIDATOR SET MANAGEMENT"],
                "summary": "get infomation of the latest validatorsets",
                "produces": ["application/json", "application/xml"],
                "parameters": [],
                "responses": {}
            }
        },
        "/api/v1/validatorsets/{height}": {
            "get": {
                "tags": ["VALIDATOR SET MANAGEMENT"],
                "summary": "get infomation of the validator set by height",
                "produces": ["application/json", "application/xml"],
                "parameters": [{
                    "name": "height",
            		"in": "path",
            		"description": "height",
            		"required": true,
            		"type": "number"
                }],
                "responses": {}
            }
        },
        "/api/v1/chart/txs": {
			"get": {
				"tags": ["CHART MANAGEMENT"],
				"summary": "Colum chart count tx for 14 days.",
				"produces": [ "application/json"],
				"parameters": {},
				"responses": {}
            }
        },
        "/api/v1/auth/accounts/{address}": {
			"get": {
				"tags": ["AUTH MANAGEMENT"],
				"summary": "Get the account information on blockchain.",
				"produces": [ "application/json"],
				"parameters": [{
					"name": "address",
            		"in": "path",
                    "description": "Account address",
                    "default": "pdt19znywhrhv6a94kgdf9fhag6drx07defd6sd2ne",
            		"required": true,
            		"type": "string"
				}],
				"responses": {}
            }
        },
        "/api/v1/crosschain/tokens": {
			"get": {
				"tags": ["CROSSCHAIN TOKENS MANAGEMENT"],
				"summary": "crosschain tokens",
				"produces": [ "application/json"],
				"parameters": {},
				"responses": {}
            }
        },
        "/api/v1/crosschain/tokens/{tokenAddress}/balance": {
			"get": {
				"tags": ["CROSSCHAIN TOKENS MANAGEMENT"],
				"summary": "get crosschain balance",
				"produces": [ "application/json"],
				"parameters": [
                    {
                        "name": "tokenAddress",
                        "in": "path",
                        "description": "Account address",
                        "required": true,
                        "type": "string"
                    }
                ],
				"responses": {}
            }
        },
        "/api/v1/crosschain/tokens/{tokenAddress}/transactions": {
			"get": {
				"tags": ["CROSSCHAIN TOKENS MANAGEMENT"],
				"summary": "get crosschain transactions",
				"produces": [ "application/json"],
				"parameters": [
                    {
                        "name": "tokenAddress",
                        "in": "path",
                        "description": "Account address",
                        "required": true,
                        "type": "string"
                    }
                ],
				"responses": {}
            }
        },

        "/api/v1/bank/balances/{address}": {
			"get": {
				"tags": ["BANK MANAGEMENT"],
				"summary": "get bank balance",
				"produces": [ "application/json"],
				"parameters": [
                    {
                        "name": "address",
                        "in": "path",
                        "description": "address",
                        "required": true,
                        "type": "string"
                    }
                ],
				"responses": {}
            }
        },
        "/api/v1/staking/validators": {
			"get": {
				"tags": ["STAKING MANAGEMENT"],
				"summary": "Get all validator candidates. By default it returns only the bonded validators.",
				"produces": [ "application/json"],
				"parameters": {},
				"responses": {}
            }
        },
        "/api/v1/staking/validators/{address}": {
			"get": {
				"tags": ["STAKING MANAGEMENT"],
				"summary": "Query the information from a single validator",
				"produces": [ "application/json"],
				"parameters": [
                    {
                        "name": "address",
                        "in": "path",
                        "description": "address",
                        "required": true,
                        "type": "string"
                    }
                ],
				"responses": {}
            }
        },

        "/api/v1/staking/validators/pdtvalcons/{pdtvalconsAddress}/{blockHeight}": {
			"get": {
				"tags": ["STAKING MANAGEMENT"],
				"summary": "Query the information from a single validator",
				"produces": [ "application/json"],
				"parameters": [
                    {
                        "name": "pdtvalconsAddress",
                        "in": "path",
                        "description": "pdtvalcons Address",
                        "required": true,
                        "default": "pdtvalcons1jp3r5qd5p23lgadvz9g3uwnhwuu4xy696pfd36",
                        "type": "string"
                    },
                    {
                        "name": "blockHeight",
                        "in": "path",
                        "description": "Block height",
                        "required": true,
                        "default": 53668,
                        "type": "string"
                    }
                ],
				"responses": {}
            }
        },

        "/api/v1/staking/validators/{validatorAddress}/delegations": {
			"get": {
				"tags": ["STAKING MANAGEMENT"],
				"summary": "Get all delegations from a validator",
				"produces": [ "application/json"],
				"parameters": [
                    {
                        "name": "validatorAddress",
                        "in": "path",
                        "description": "Bech32 OperatorAddress of validator",
                        "required": true,
                        "default": "pdtvaloper19znywhrhv6a94kgdf9fhag6drx07defd2c7u7m",
                        "type": "string"
                    }
                ],
				"responses": {}
            }
        },
        
    }
}