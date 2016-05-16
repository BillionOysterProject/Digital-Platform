'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Settlement Tile Schema
 */
var ProtocolSettlementTileSchema = new Schema({
  collectionTime: Date,
  latitude: Number,
  longitude: Number,
  scribeMember: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  notes: String,
  status: {
    type: String,
    enum: ['incomplete','submitted','returned','published','unpublished'],
    default: ['incomplete'],
    required: true
  },
  submitted: Date,
  settlementTiles: [{
    description: String,
    tilePhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    grid1: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid2: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid3: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid4: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid5: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid6: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid7: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid8: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid9: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid10: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid11: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid12: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid13: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid14: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid15: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid16: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid17: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid18: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid19: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid20: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid21: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid22: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid23: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid24: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    },
    grid25: {
      organism: {
        type: Schema.ObjectId,
        ref: 'SessileOrganism'
      },
      notes: String
    }
  }]
});

ProtocolSettlementTileSchema.set('versionKey', false); //TODO
mongoose.model('ProtocolSettlementTile', ProtocolSettlementTileSchema);
