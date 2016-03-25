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
  expedition: {
    type: Schema.ObjectId,
    ref: 'Expedition',
    //required: true TODO: will be required
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team',
    //required: true TODO: will be required
  },
  teamMembers: [{
    type: Schema.ObjectId,
    ref: 'User',
    //required: true TODO: will be required
  }],
  meteorologicalConditions: {
    weatherConditions: {
      type: String,
      required: true
    },
    airTemperatureC: {
      type: Number,
      required: true
    },
    windSpeedMPH: {
      type: Number,
      required: true
    },
    windDirection: {
      type: String,
      required: true
    },
    humidityPer: {
      type: Number,
      required: true
    }
  },
  recentRainfall: {
    rainedIn24Hours: {
      type: Boolean,
      required: true
    },
    rainedIn72Hours: {
      type: Boolean,
      required: true
    },
    rainedIn7Days: {
      type: Boolean,
      required: true
    }
  },
  tideConditions: {
    closestHighTide: {
      type: Date,
      required: true
    },
    closestLowTide: {
      type: Date,
      required: true
    },
    currentSpeedMPH: {
      type: Number,
      required: true
    },
    currentDirection: {
      type: String,
      required: true
    },
    tidalCurrent: {
      type: String,
      required: true
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
      type: String,
      required: true
    },
    oilSheen: {
      type: Boolean,
      required: true
    },
    garbage: {
      garbagePresent: {
        type: Boolean,
        required: true
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
        type: Boolean,
        required: true
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
        type: Boolean,
        required: true
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
      type: String,
      required: true
    },
    shorelineSurfaceCoverEstPer: {
      imperviousSurfacePer: Number,
      perviousSurfacePer: Number,
      vegetatedSurfacePer: Number
    },
    garbage: {
      garbagePresent: {
        type: Boolean,
        required: true
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