//TO RUN:
//copy the below code into a Robomongo window.

//This function adds a "teamLeads" field to all teams that is an array
//of id values. it adds one element to the array that is the value of
//the current "teamLead" field. It leaves "teamLead" for now.
db.system.js.save({
  _id: "teamLeadUpdateFunction",
  value: function(teamId) {
    db.teams.find({}).forEach(function(team){
      db.teams.update(
        { _id: team._id },
        { $set:
          { "teamLeads": [ team.teamLead ] }
        });
    });
  }
});

//load the scripts available to include the one just created above
db.loadServerScripts();
//run the update
teamLeadUpdateFunction();
