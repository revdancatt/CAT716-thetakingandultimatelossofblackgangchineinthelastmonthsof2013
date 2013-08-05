character = {

  current: {
    name: null,
    born: null,
    died: null,
    lastUpdate: null,
    actions: [],
    health: 100,
    bleeding: 0,
    injured: 0,
    infected: 0,
    chanceOfAttack: 1
  },
  startDateTime: new Date(2013, 9, 1, 8, 0, 0),


  init: function() {

    var tmpChar = this.load();

    //  Here we need to see if there is a current character running, if so use that
    //  otherwise create a new one
    if (tmpChar === null) {
      this.createNew();
    } else {
      util.log('We have loaded a character, we need to backfill from the last time it was ticked');
    }

  },

  createNew: function() {

    //  make sure the form doesn't do anything when we submit it
    $('#newCharacter').bind('submit', function() {

      character.current.name = $('#char_name').val();
      character.current.born = Math.floor(new Date()/1000);
      character.current.lastUpdate = Math.floor(new Date()/1000);
      character.current.actions.push({action: $('#char_name').val() + ' woke up', tally: 0, timestamp: character.current.born});
      character.current.health = 100;
      character.current.bleeding = 0;
      character.current.injured = 0;
      character.current.infected = 0;
      character.current.chanceOfAttack = 1;

      character.save();

      $('#page1').fadeOut('fast', function() { character.tick(); });
      $('#page2').fadeIn('slow', function() {
        //mapper.reset();
      });
      return false;
    });

    //  set the focus to the name input form.
    $('#char_name').focus();

  },

  load: function() {

    return null;

  },

  save: function() {

    //  try and save character here

  },

  die: function() {

    character.current.lastUpdate = Math.floor(new Date()/1000);
    character.current.died = Math.floor(new Date()/1000);

    var lifespan = character.current.died - character.current.born;
    lifespan = utils.lifespan(lifespan);

    document.title = 'dead, ' + lifespan;

    var newAction = { action: character.current.name + ' has died', tally: 1,   timestamp: Math.floor(new Date()/1000) };
    character.current.actions.unshift(newAction);
    newAction = { action: 'dead',                               tally: 1,   timestamp: Math.floor(new Date()/1000) };
    character.current.actions.unshift(newAction);
    newAction = { action: 'They survived for ' + lifespan,      tally: 1,   timestamp: Math.floor(new Date()/1000) };
    character.current.actions.unshift(newAction);

  },

  tick: function() {

    //  fade out the current status
    $('#status').fadeOut('fast', function() {

      //  find out how long it's been since the last update
      var nowt = Math.floor(new Date()/1000);
      var secSinceLastUpdate = nowt - character.current.lastUpdate;

      //  Now do that many turns
      if (secSinceLastUpdate > 0) {
        character.turns(secSinceLastUpdate);
      }

      character.displayStatus();
      var niceTime = utils.HHMM(utils.magicTime(character.current.lastUpdate));
      var newStatus = niceTime + ' - ' + character.current.actions[0].action;

      //  flash the background if we have been attacked
      var showBlood = {'fought off a zombie attack': 1, 'scratched by a zombie': 1, 'bitten by a zombie': 1 };
      if (character.current.actions[0].action in showBlood) {
        $('#blood').stop(true, true).css({display: 'inline', opacity: 1}).fadeOut(333);
      }

      //  Update the status and call the next tick
      if (character.current.died === null) {
        $('#status').html(newStatus).fadeIn('slow', function() {

          //  set the lastupdate to the time it was *before* we did all this calculations
          character.current.lastUpdate = nowt;

          //  in 5 seconds time.
          setTimeout("character.tick()", 1000);

        });
      }

    });

  },

  turns: function(t) {

    var newAction = null;
    var chanceOfAttack = null;
    var attackType = null;

    for (var i = 0; i < t; i++) {

      //  find out if we are attacked
      chanceOfAttack = Math.floor(character.current.chanceOfAttack + character.current.injured / 4);
      if (utils.rollDie(100) <= chanceOfAttack) {

        // if we have been attacked, increase the chance of being attacked again
        character.current.chanceOfAttack++;

        attackType = utils.rollDie(20);
        if (attackType == 1) {

          //  we have been bitten, this injures us, makes us bleed and infects us
          newAction = {
            action: 'bitten by a zombie',
            tally: 1,
            timestamp: Math.floor(new Date()/1000)-(t-i)
          };
          character.current.injured+=5;
          character.current.bleeding+=5;
          character.current.infected++;

        } else if (attackType >= 2 && attackType <= 10) {

          //  we have been bitten, this injures us and makes us bleed, not as much as being bitten
          newAction = {
            action: 'scratched by a zombie',
            tally: 1,
            timestamp: Math.floor(new Date()/1000)-(t-i)
          };
          character.current.injured++;
          character.current.bleeding++;

        } else {

          //  we go attacked and nothing too bad happened (note our chance of being attacked again
          //  has still increased though
          newAction = {
            action: 'fought off a zombie attack',
            tally: 1,
            timestamp: Math.floor(new Date()/1000)-(t-i)
          };

        }

      } else {

        //  make the action
        newAction = {
          action: 'still alive',
          tally: 1,
          timestamp: Math.floor(new Date()/1000)-(t-i)
        };

        if (character.current.injured > 0) {
          newAction.action = 'injured';
        }

        if (character.current.bleeding > 0) {
          newAction.action = 'bleeding';
        }

        if (character.current.infected > 0) {
          newAction.action = 'infected';
        }

      }

      //  if the action is the same as the most recent action then just update the times
      //  on the most recent action
      if (newAction.action == character.current.actions[0].action) {
        character.current.actions[0].tally++;
        character.current.actions[0].timestamp = Math.floor(new Date()/1000)-(t-i);
      } else {
        character.current.actions.unshift(newAction);
      }

      //  Adjust the players health
      character.current.health-=Math.floor(character.current.bleeding/4);
      character.current.health-=character.current.infected;
      if (character.current.health <= 0) {
        character.current.health = 0;
        character.die();
        return;
      }

    }
  },

  displayStatus: function() {

    var niceTime = null;

    $('#oldStatus ul').empty();
    for (var i in character.current.actions) {
      if (i === 0) continue;
      if (character.current.actions[i].action == 'still alive') continue;
      if (character.current.actions[i].action == 'injured') continue;
      if (character.current.actions[i].action == 'infected') continue;
      if (character.current.actions[i].action == 'bleeding') continue;
      niceTime = utils.HHMM(utils.magicTime(character.current.actions[i].timestamp));
      $('#oldStatus ul').prepend($('<li>').html(niceTime + ' - ' + character.current.actions[i].action));
    }

    $('#details ul').empty();

    var status = 'fine';
    var status_a = [];
    if (character.current.injured > 0) status_a.push('injured');
    if (character.current.infected > 0) status_a.push('infected');
    if (character.current.bleeding > 0) status_a.push('bleeding');
    if (character.current.health === 0) status_a.push('dead');
    if (status_a.length > 0) {
      status = status_a.join(', ');
    }


    var lifespan = character.current.lastUpdate - character.current.born;
    lifespan = utils.lifespan(lifespan);

    var fullDate = '';
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var niceDate = utils.magicTime(character.current.lastUpdate);
    var minutes = niceDate.getMinutes();
    var ampm = 'am';
    var stndrdth = 'th';
    if (minutes < 10) minutes = '0' + minutes;
    if (niceDate.getHours() >= 12) ampm = 'pm';
    if (niceDate.getDate() == 1 || niceDate.getDate() == 21 || niceDate.getDate() == 31) stndrdth = 'st';
    if (niceDate.getDate() == 2 || niceDate.getDate() == 22) stndrdth = 'nd';
    if (niceDate.getDate() == 3 || niceDate.getDate() == 23) stndrdth = 'rd';
    fullDate = 'It\'s ' + niceDate.getHours() + ':' + minutes + ampm + ' on ' + days[niceDate.getDay()] + ' ' + niceDate.getDate() + '<sup>' + stndrdth + '</sup> ' + months[niceDate.getMonth()] + ', ' + (niceDate.getYear() + 1900);
    //fullDate = fullDate + minutes;

    niceTime = utils.HHMM(utils.magicTime(character.current.lastUpdate));
    if (character.current.health === 0) {
      niceTime = 'dead ' + niceTime;
    }
    document.title = niceTime + ' | The taking and ultimate loss of Blackgang Chine in the last months of 2013';

    $('.currentDateTime').html(fullDate);

    $('#details ul').append($('<li>').html('current location: Robin Hill Adventure Park and Gardens'));
    $('#details ul').append($('<li>').html('current destination: Blackgang Chine'));
    $('#details ul').append($('<li>').html('survied: ' + lifespan));
    $('#details ul').append($('<li>').html('health: ' + character.current.health));
    $('#details ul').append($('<li>').html('status: ' + status));

  }

};
