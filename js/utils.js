utils = {
  
  log: function(msg) {
    
    try {
      console.log(msg)
    } catch(er) {
      // ignore
    }
  },
  
  rollDie: function(sides) {
    
    return Math.ceil(Math.random()*sides);
    
  }

}