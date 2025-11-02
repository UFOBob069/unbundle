// Actual IDL from deployed splitter program (fixed burn authority)
export const SplitterIDL = {
  "address": "DMrAqzweWu8UQvCvGK2yfrGwUdkjiav4MafRV1SKxx6j",
  "version": "0.1.0",
  "name": "splitter",
  "instructions": [
    {
      "name": "initializeSplit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "googlMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "partMint0",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "partMint1",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "partMint2",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "partMint3",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultGooglAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "splitConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "googlMint",
          "type": "publicKey"
        },
        {
          "name": "partMints",
          "type": {
            "array": [
              "publicKey",
              4
            ]
          }
        }
      ]
    },
    {
      "name": "stakeGl",
      "accounts": [
        {
          "name": "splitConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "googlMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userGooglAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint3",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta3",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultGooglAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "splitMintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "redeemGl",
      "accounts": [
        {
          "name": "splitConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "googlMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "partMint3",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta0",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta1",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPartAta3",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userGooglAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultGooglAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sets",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setPaused",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "splitConfig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "paused",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "SplitConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "googlMint",
            "type": "publicKey"
          },
          {
            "name": "partMints",
            "type": {
              "array": [
                "publicKey",
                4
              ]
            }
          },
          {
            "name": "vaultGooglAta",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "paused",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Paused",
      "msg": "Splitter is paused"
    },
    {
      "code": 6001,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6003,
      "name": "InvalidPartMint",
      "msg": "Invalid part mint"
    }
  ]
};
