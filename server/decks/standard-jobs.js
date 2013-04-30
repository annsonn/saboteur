var GameRules = function(saboteurs, miners, hand) {
  return {
    saboteurs: saboteurs,
    miners: miners, 
    hand: hand
  };
};
// Players to JobRule
module.exports = {
  3: GameRules(1, 3, 6),
  4: GameRules(1, 4, 6),
  5: GameRules(2, 4, 5),
  6: GameRules(2, 5, 5),
  7: GameRules(3, 5, 4),
  8: GameRules(3, 6, 4),
  9: GameRules(3, 7, 4),
  10: GameRules(4, 7, 4),  
}