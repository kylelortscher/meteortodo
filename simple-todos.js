Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Meteor.subscribe("tasks");
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    }
  });
  Template.body.helpers({
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  //Connnect The Form To Display On The Page
  Template.body.events({
    "submit .new-task": function (event) {

      var text = event.target.text.value;

      Meteor.call("addTask", text);({
        text: text,
        createdAt: new Date(),            // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });

      event.target.text.value = "";

      return false;
    }
  });
  Template.body.events({
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });
  Template.task.events({
    "click .toggle-checked": function () {
      //Set The Checked Property Opposite To Its Current Value
      Meteor.call("setChecked", this._id, ! this.checked);(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("tasks", function () {
    return Tasks.find();
  });
}
