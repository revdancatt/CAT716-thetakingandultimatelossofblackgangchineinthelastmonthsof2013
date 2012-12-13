utils = {
  
  timeModifier: 6,
  
  log: function(msg) {
    
    try {
      console.log(msg)
    } catch(er) {
      // ignore
    }
  },
  
  rollDie: function(sides) {
    
    return Math.ceil(Math.random()*sides);
    
  },

  lifespan: function(duration) {

    var rtnLifespan = ''
    
    //  remember time is speeded up, so we need to multiply by 6
    duration = duration * this.timeModifier;
    
    //  if they only lived 1 second (sad) then just display that
    //  otherwise display total seconds unless we've moved into minutes
    if (duration == 1) {
      rtnLifespan = '1 second';
    } else if (duration < 60) {
      rtnLifespan = duration + ' seconds';
    } else {

      //  ok we have to do minute stuff, so here we go, work out the minutes and seconds
      var minutes = Math.floor(duration/60);
      var seconds = duration - minutes * 60;
      
      //  pluralise it
      if (minutes == 1) {
        rtnLifespan = '1 minute';
      } else {
        rtnLifespan = minutes + ' minutes';
      }
      
      //  see if we need to add the second on too
      if (seconds == 1) {
        rtnLifespan+=' 1 second';
      } else if (seconds != 0) {
        rtnLifespan+= ' ' + seconds + ' seconds';
      }
    }

    return rtnLifespan;

  },
  
  magicTime: function(thisTime) {

    //  Magic Time means that we run 6 times faster than real time, so 4 hours = a full day
    //  to work out what the correct time is for the time passed in, we take the start time
    //  and add the number of seconds that have passed since the character was "born" and
    //  multiply by 6
    var newTime = new Date(character.startDateTime.getTime() + ((thisTime - character.current.born) * 1000)*this.timeModifier);
    return newTime;

  },
  
  HHMM: function(d) {
    
    var hours = d.getHours();
    var minutes = d.getMinutes();
    
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    
    return hours + ':' + minutes;

  }

}