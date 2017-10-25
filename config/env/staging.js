'use strict';

//var defaultEnvConfig = require('./default');

module.exports = {
  // secure: {
  //   ssl: true,
  // //   privateKey: './config/sslcerts/key.pem',
  // //   certificate: './config/sslcerts/cert.pem'
  // },
  port: process.env.PORT || 8081,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 7 * 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/bop-staging',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  s3: {
    region: 'us-west-1',
    bucket: 'digital-platform-staging-files',
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
        fileName: process.env.LOG_FILE || 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs
          fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
          verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false
        }
      }
    }
  },
  app: {
    title: 'Billion Oyster Project - Staging Environment',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    admin: process.env.MAILER_ADMIN || 'BOP Admin <bop.digital.platform@nyharbor.org>',
    ors: process.env.MAILER_ORS || 'bop.digital.platform@nyharbor.org',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      },
      ses: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'YOUR_AMAZON_KEY',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_AMAZON_SECRET_KEY'
      }
    }
  },
  livereload: false,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  },
  uploads: {
    profileUpload: {
      s3dest: 'uploads/users/img/profile/',
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 20*1024*1024 // Max file size in bytes (20 MB)
      }
    },
    wysiwygImageUploader: {
      s3dest: 'uploads/forms/img/wysiwyg-images/',
      dest: './modules/forms/client/img/wysiwyg-images/uploads/', // Wysiwyg upload destination path
      limits: {
        fileSize: 20*1024*1024 // Max file size in bytes (20 MB)
      }
    },
    waterConditionUpload: {
      s3dest: 'uploads/protocols/site-conditions/img/water-conditions/',
      dest: './modules/protocol-site-conditions/client/img/water-condition/uploads/', // Protocol site condition upload destination path
      limits: {
        fileSize: 20*1024*1024 // Max file size in bytes (20 MB)
      }
    },
    landConditionUpload: {
      s3dest: 'uploads/protocols/site-conditions/img/land-conditions/',
      dest: './modules/protocol-site-conditions/client/img/land-condition/uploads/', // Protocol site condition upload destination path
      limits: {
        fileSize: 20*1024*1024 // Max file size in bytes (20 MB)
      }
    },
    oysterCageConditionUpload: {
      s3dest: 'uploads/protocols/oyster-measurements/img/oyster-cage-condition/',
      dest: './modules/protocol-oyster-measurements/client/img/oyster-cage/uploads/', // Protocol oyster measurement upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    outerSubstrateUpload: {
      s3dest: 'uploads/protocols/oyster-measurements/img/outer-substrates/',
      dest: './modules/protocol-oyster-measurements/client/img/outer-substrate/uploads/', // Protocol oyster measurement upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    innerSubstrateUpload: {
      s3dest: 'uploads/protocols/oyster-measurements/img/inner-substrates',
      dest: './modules/protocol-oyster-measurements/client/img/inner-substrate/uploads/', // Protocol oyster measurement upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    organismImageUpload: {
      s3dest: 'uploads/organisms/img/mobile-organisms/',
      dest: './modules/mobile-organisms/client/img/organisms/', // Meta organisms upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    mobileTrapSketchPhotoUpload: {
      s3dest: 'uploads/protocols/mobile-traps/img/sketchPhotos/',
      dest: './modules/protocol-mobile-traps/client/img/sketchPhoto/uploads/', // Protocol mobile trap upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    settlementTilesUpload: {
      s3dest: 'uploads/protocols/settlement-tiles/img/tilePhoto/',
      dest: './modules/protocol-settlement-tiles/client/img/tile/uploads/', // Protocol settlement tile upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    researchHeaderImageUpload: {
      s3dest: 'uploads/researches/img/header-images/',
      dest: './modules/researches/client/img/header-image/uploads/',
      limits: {
        fileSize: 20*1024*1024
      }
    },
    researchDownloadImageUpload: {
      s3dest: 'uploads/researches/img/downloads/',
      dest: '/tmp/',
      limits: {
        fileSize: 20*1024*1024
      }
    },
    lessonFeaturedImageUpload: {
      s3dest: 'uploads/lessons/img/featured-images/',
      dest: './modules/lessons/client/img/featured-image/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    lessonHandoutsUpload: {
      s3dest: 'uploads/lessons/files/handouts/',
      dest: './modules/lessons/client/files/handouts/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    lessonTeacherResourcesUpload: {
      s3dest: 'uploads/lessons/files/teacher-resources/',
      dest: './modules/lessons/client/files/teacher-resources/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    lessonMaterialFilesUpload: {
      s3dest: 'uploads/lessons/files/lesson-material/',
      dest: './modules/lessons/client/files/lesson-material/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    lessonStateTestQuestionsUpload: {
      s3dest: 'uploads/lessons/img/state-test-questions/',
      dest: './modules/lessons/client/img/state-test-questions/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    organizationPhotoUpload: {
      s3dest: 'uploads/school-orgs/img/organization/',
      dest: './modules/school-orgs/client/img/organization/uploads/',
      limits: {
        fileSize: 20*1024*1024
      }
    },
    lessonDownloadPdfUpload: {
      s3dest: 'uploads/lessons/img/downloads/',
      dest: '/tmp/',
      limits: {
        fileSize: 20*1024*1024
      }
    },
    teamPhotoUpload: {
      s3dest: 'uploads/teams/img/team/',
      dest: './modules/teams/client/img/team/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    stationPhotoUpload: {
      s3dest: 'uploads/restoration-stations/img/station/',
      dest: './modules/restoration-stations/client/img/station/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    stationStatusPhotoUpload: {
      s3dest: 'uploads/restoration-stations/img/status/',
      dest: './modules/restoration-stations/client/img/status/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    eventFeaturedImageUpload: {
      s3dest: 'uploads/events/img/featured-images/',
      dest: './modules/events/client/img/featured-image/uploads/', // Event upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    },
    eventResourcesUpload: {
      s3dest: 'uploads/events/files/resources/',
      dest: './modules/events/client/files/resources/uploads/', // Event upload destination path
      limits: {
        fileSize: 20*1024*1024
      }
    }
  }
};
