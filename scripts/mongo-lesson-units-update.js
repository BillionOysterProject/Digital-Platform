//TO RUN:
//copy the below code into a Robomongo window.

//This function adds a "units" field to all lessons that is an array
//of id values. It adds on element to the array that is the value of the
//current "unit" field. It leaves "unit" for now.
db.system.js.save({
  _id: "unitUpdateFunction",
  value: function(lessonId) {
    db.lessons.find({}).forEach(function(lesson) {
      db.lessons.update(
        { _id: lesson._id },
        { $set:
          { "units": [lesson.unit] }
        }
      )
    });
  }
});

//load the scripts available to include the one just created above
db.loadServerScripts();
//run the update
unitUpdateFunction();
