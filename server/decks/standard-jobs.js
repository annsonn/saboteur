var JobRule = function(saboteurs, miners) {
  return {
    saboteurs: saboteurs,
    miners: miners
  };
};
// Players to JobRule
module.exports = {
  3: JobRule(1, 3),
  4: JobRule(1, 4),
  5: JobRule(2, 4),
  6: JobRule(2, 5),
  7: JobRule(3, 5),
  8: JobRule(3, 6),
  9: JobRule(3, 7),
  10: JobRule(4, 7),  
}