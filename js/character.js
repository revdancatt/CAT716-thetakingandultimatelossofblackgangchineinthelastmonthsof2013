character = {
  
  current: {},
  
  
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
    
    //  We need to show the character creation form
    $('#characterCreationForm').fadeIn('fast');
    
    //  make sure the form doesn't do anything when we submit it
    $('#newCharacter').bind('submit', function() { 
      character.current.name = $('#char_name').val();
      character.current.born = Math.floor(+new Date/1000);
      character.current.lastUpdate = Math.floor(+new Date/1000);
      character.save();
      $('#characterCreationForm').fadeOut('fast', function() { character.tick() });
      return false;
    });
    
  },
  
  load: function() {
    
    return null;
    
  },
  
  save: function() {
  
    //  try and save character here
      
  },
  
  die: function() {
    
    character.current.lastUpdate = Math.floor(+new Date/1000);
    character.current.died = Math.floor(+new Date/1000);

    var lifespan = character.current.died - character.current.born;
    
    //  if they only lived 1 second (sad) then just display that
    //  otherwise display total seconds unless we've moved into minutes
    if (lifespan == 1) {
      lifespan = '1 second';
    } else if (lifespan < 60) {
      lifespan = lifespan + ' seconds';
    } else {

      //  ok we have to do minute stuff, so here we go, work out the minutes and seconds
      var minutes = Math.floor(lifespan/60);
      var seconds = lifespan - minutes * 60;
      
      //  pluralise it
      if (minutes == 1) {
        lifespan = '1 minute';
      } else {
        lifespan = minutes + ' minutes';
      }
      
      //  see if we need to add the second on too
      if (seconds == 1) {
        lifespan+=' 1 second';
      } else if (seconds != 0) {
        lifespan+= ' ' + seconds + ' seconds';
      }
    }
    
    $('#status').html(character.current.name + ' has died<br />They lived for ' + lifespan + '<br />');
    $('#status').append($('<a>').attr('href', '#').html('Play again').bind('click', function() { window.location.reload() }));
    $('#status').fadeIn('slow');
    
  },
  
  tick: function() {
  
    //  fade out the current status
    $('#status').fadeOut('fast', function() {
      if (utils.rollDie(100) == 1) {
        character.die();
      } else {
        $('#status').html(character.current.name + ' is alive').fadeIn('slow', function() {
          character.current.lastUpdate = Math.floor(+new Date/1000);
          setTimeout("character.tick()", 1000);
        });
      }
    })

  }
  
  
}