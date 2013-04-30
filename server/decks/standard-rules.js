var JobRule = function(saboteurs, miners, hand) {
  return {
    saboteurs: saboteurs,
    miners: miners, 
    hand: hand
  };
};
// Players to JobRule
module.exports = {
  3: JobRule(1, 3, 6),
  4: JobRule(1, 4, 6),
  5: JobRule(2, 4, 5),
  6: JobRule(2, 5, 5),
  7: JobRule(3, 5, 4),
  8: JobRule(3, 6, 4),
  9: JobRule(3, 7, 4),
  10: JobRule(4, 7, 4),  
}