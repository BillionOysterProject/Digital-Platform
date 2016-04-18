'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Site Condition Schema
 */
var ProtocolSiteConditionSchema = new Schema({
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
    enum: ['incomplete','submitted'],
    default: ['incomplete'],
    required: true
  },
  submitted: Date,
  meteorologicalConditions: {
    weatherConditions: {
      type: String
    },
    airTemperatureC: {
      type: Number
    },
    windSpeedMPH: {
      type: Number
    },
    windDirection: {
      type: String
    },
    humidityPer: {
      type: Number
    }
  },
  recentRainfall: {
    rainedIn24Hours: {
      type: Boolean
    },
    rainedIn72Hours: {
      type: Boolean
    },
    rainedIn7Days: {
      type: Boolean
    }
  },
  tideConditions: {
    closestHighTide: {
      type: Date
    },
    closestLowTide: {
      type: Date
    },
    currentSpeedMPH: {
      type: Number
    },
    currentDirection: {
      type: String
    },
    tidalCurrent: {
      type: String
    }
  },
  waterConditions: {
    waterConditionPhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    waterColor: {
      type: String
    },
    oilSheen: {
      type: Boolean
    },
    garbage: {
      garbagePresent: {
        type: Boolean
      },
      hardPlastic: String,
      softPlastic: String,
      metal: String,
      paper: String,
      glass: String,
      organic: String,
      other: {
        description: String,
        extent: String
      },
      notes: {
        type: String
      }
    },
    markedCombinedSewerOverflowPipes: {
      markedCSOPresent: {
        type: Boolean
      },
      location: {
        latitude: Number,
        longitude: Number
      },
      flowThroughPresent: Boolean,
      howMuchFlowThrough: String
    },
    unmarkedOutfallPipes: {
      unmarkedPipePresent: {
        type: Boolean
      },
      location: {
        latitude: Number,
        longitude: Number
      },
      approximateDiameterCM: Number,
      flowThroughPresent: Boolean,
      howMuchFlowThrough: String
    }
  },
  landConditions: {
    landConditionPhoto: {
      originalname: String,
      mimetype: String,
      filename: String,
      path: String
    },
    shoreLineType: {
      type: String
    },
    shorelineSurfaceCoverEstPer: {
      imperviousSurfacePer: Number,
      perviousSurfacePer: Number,
      vegetatedSurfacePer: Number
    },
    garbage: {
      garbagePresent: {
        type: Boolean
      },
      hardPlastic: String,
      softPlastic: String,
      metal: String,
      paper: String,
      glass: String,
      organic: String,
      other: {
        description: String,
        extent: String
      },
      notes: {
        type: String
      }
    },
  }
});

mongoose.model('ProtocolSiteCondition', ProtocolSiteConditionSchema);
