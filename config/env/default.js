'use strict';

module.exports = {
  app: {
    title: 'MEAN.JS',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 8081,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
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
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    },
    waterConditionUpload: {
      dest: './modules/protocol-site-conditions/client/img/water-condition/uploads/', // Protocol site condition upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    },
    landConditionUpload: {
      dest: './modules/protocol-site-conditions/client/img/land-condition/uploads/', // Protocol site condition upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    },
    oysterCageConditionUpload: {
      dest: './modules/protocol-oyster-measurements/client/image/oyster-cage/uploads/', // Protocol oyster measurement upload destination path
      limits: {
        fileSize: 1*1024*1024
      }
    },
    lessonFeaturedImageUpload: {
      dest: './modules/lessons/client/img/featured-image/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 1*1024*1024
      }
    },
    lessonHandoutsUpload: {
      dest: './modules/lessons/client/files/handouts/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 1*1024*1024
      }
    },
    lessonTeacherResourcesUpload: {
      dest: './modules/lessons/client/files/teacher-resources/uploads/', // Lesson upload destination path
      limits: {
        fileSize: 1*1024*1024
      }
    }
  }
};
