'use strict';

module.exports = {
  app: {
    title: 'Billion Oyster Project',
    description: 'Curriculum Management and Data Collection/Publishing tool for the Billion Oyster Project',
    keywords: 'science, data collection, curriculum',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 8081,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 7 * 24 * (60 * 60 * 1000), // set to 1 week
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: { /* Content Security Policy object */},
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {
      maxAge: 31536000, // Forces HTTPS for one year
      includeSubDomains: true,
      preload: true
    },
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
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
    lessonDownloadPdfUpload: {
      s3dest: 'uploads/lessons/img/downloads/',
      dest: '/tmp/',
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
    },
  }
};
