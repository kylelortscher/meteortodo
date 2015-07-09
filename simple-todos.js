Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });
  //Connnect The Form To Display On The Page
  Template.body.events({
    "submit .new-task": function (event) {

      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date()
      });

      event.target.text.value = "";

      return false;
    }
  });
  //Sort Tasks By Newest At The Top
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
