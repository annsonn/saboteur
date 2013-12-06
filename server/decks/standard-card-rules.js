module.exports = {
  'start': {top: true, right: true, left: true, bottom: true},

  'connected-top-bottom': {top: true, bottom: true},
  'connected-right-left': {right: true, left: true},
  'connected-top-right': {top: true, right: true},
  'connected-top-left': {top: true, left: true},
  'connected-top-bottom-left': {top: true, left: true, bottom: true},
  'connected-top-right-left': {top: true, right: true, left: true},
  'connected-cross': {top: true, right: true, left: true, bottom: true},

  'deadend-top': {block: true, top: true},
  'deadend-right': {block: true, right: true},
  'deadend-top-right': {block: true, top: true, right: true},
  'deadend-top-left': {block: true, top: true, left: true},
  'deadend-top-bottom': {block: true, top: true, bottom: true},
  'deadend-right-left': {block: true, right: true, left: true},
  'deadend-top-right-bottom': {block: true, top: true, right: true, bottom: true},
  'deadend-right-bottom-left': {block: true, bottom: true, right: true, left: true},
  'deadend-cross': {block: true, top: true, right: true, left: true, bottom: true},

  'coal-left': {top: true, left: true},
  'coal-right': {top: true, right: true},
  'gold': {top: true, right: true, left: true, bottom: true}

}