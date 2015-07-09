Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
