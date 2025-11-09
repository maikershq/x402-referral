/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/referral_registry.json`.
 */
export type ReferralRegistry = {
  "address": "2grt1SPQdTVbb7dhd24LseNR8Rpy7TKcEY3R3raj2cqq",
  "metadata": {
    "name": "referralRegistry",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "X402 Referral Registry - Campaign management and proof logging"
  },
  "instructions": [
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "business"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "business",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "payoutAmount",
          "type": "u64"
        },
        {
          "name": "maxPayouts",
          "type": "u64"
        },
        {
          "name": "startTimestamp",
          "type": "i64"
        },
        {
          "name": "endTimestamp",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "logProof",
      "discriminator": [
        240,
        166,
        119,
        63,
        221,
        76,
        49,
        193
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "conversionId",
          "type": "string"
        },
        {
          "name": "affiliate",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "proofHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "pauseCampaign",
      "discriminator": [
        62,
        247,
        54,
        192,
        240,
        158,
        8,
        161
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "business",
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "resumeCampaign",
      "discriminator": [
        84,
        91,
        163,
        83,
        28,
        24,
        54,
        2
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true
        },
        {
          "name": "business",
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    }
  ],
  "events": [
    {
      "name": "campaignCreated",
      "discriminator": [
        9,
        98,
        69,
        61,
        53,
        131,
        64,
        152
      ]
    },
    {
      "name": "campaignStatusChanged",
      "discriminator": [
        29,
        231,
        184,
        247,
        102,
        189,
        130,
        98
      ]
    },
    {
      "name": "proofLogged",
      "discriminator": [
        194,
        132,
        84,
        98,
        92,
        99,
        203,
        121
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Campaign name is too long (max 64 characters)"
    },
    {
      "code": 6001,
      "name": "invalidPayoutAmount",
      "msg": "Payout amount must be greater than 0"
    },
    {
      "code": 6002,
      "name": "invalidMaxPayouts",
      "msg": "Max payouts must be greater than 0"
    },
    {
      "code": 6003,
      "name": "conversionIdTooLong",
      "msg": "Conversion ID is too long (max 64 characters)"
    },
    {
      "code": 6004,
      "name": "maxPayoutsReached",
      "msg": "Maximum payouts reached for this campaign"
    },
    {
      "code": 6005,
      "name": "payoutOverflow",
      "msg": "Payout counter overflow"
    },
    {
      "code": 6006,
      "name": "unauthorized",
      "msg": "Unauthorized: only campaign business can perform this action"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "business",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "payoutAmount",
            "type": "u64"
          },
          {
            "name": "maxPayouts",
            "type": "u64"
          },
          {
            "name": "totalPayouts",
            "type": "u64"
          },
          {
            "name": "startTimestamp",
            "type": "i64"
          },
          {
            "name": "endTimestamp",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "campaignStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "campaignCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "business",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "payoutAmount",
            "type": "u64"
          },
          {
            "name": "maxPayouts",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "paused"
          },
          {
            "name": "ended"
          }
        ]
      }
    },
    {
      "name": "campaignStatusChanged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "campaignStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "proofLogged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "conversionId",
            "type": "string"
          },
          {
            "name": "affiliate",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "proofHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
