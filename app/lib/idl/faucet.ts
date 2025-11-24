// Actual IDL from deployed faucet program
export const FaucetIDL = {
  "address": "AacgyqyCJhybFsvfc7GfAvA5GjV9oc6nqhNGJNSKW477",
  "version": "0.1.0",
  "name": "faucet",
  "instructions": [
    {
      "name": "initializeFaucet",
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
          "name": "faucetConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
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
          "name": "cooldownSeconds",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claimOne",
      "accounts": [
        {
          "name": "faucetConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "googlMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userGooglAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faucetUser",
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
      "args": []
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
          "name": "faucetConfig",
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
      "name": "FaucetConfig",
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
            "name": "cooldownSeconds",
            "type": "i64"
          },
          {
            "name": "mintAuthority",
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
    },
    {
      "name": "FaucetUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "lastClaimUnix",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Paused",
      "msg": "Faucet is paused"
    },
    {
      "code": 6001,
      "name": "CooldownNotMet",
      "msg": "Cooldown period not met"
    },
    {
      "code": 6002,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6003,
      "name": "MathOverflow",
      "msg": "Math overflow"
    }
  ]
};
