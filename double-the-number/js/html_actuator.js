function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  if (tile.value >= Math.pow(10, 4)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 3)) + "K", positionClass];
  }
  if (tile.value >= Math.pow(10, 6)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 6)) + "M", positionClass];
  }
  if (tile.value >= Math.pow(10, 9)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 9)) + "B", positionClass];
  }
  if (tile.value >= Math.pow(10, 12)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 12)) + "T", positionClass];
  }
  if (tile.value >= Math.pow(10, 15)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 15)) + "q", positionClass];
  }
  if (tile.value >= Math.pow(10, 18)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 18)) + "Q", positionClass];
  }
  if (tile.value >= Math.pow(10, 21)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 21)) + "s", positionClass];
  }
  if (tile.value >= Math.pow(10, 24)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 24)) + "S", positionClass];
  }
  if (tile.value >= Math.pow(10, 27)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 27)) + "O", positionClass];
  }
  if (tile.value >= Math.pow(10, 30)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 30)) + "N", positionClass];
  }
  if (tile.value >= Math.pow(10, 33)) {
    var classes = ["tile", "tile-" + Math.floor(tile.value / Math.pow(10, 33)) + "D", positionClass];
  }
  if (tile.value < Math.pow(10, 4)) {
    var classes = ["tile", "tile-" + tile.value, positionClass];
  }

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  if (tile.value >= Math.pow(10, 4)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 3)) + "K";
  }
  if (tile.value >= Math.pow(10, 6)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 6)) + "M";
  }
  if (tile.value >= Math.pow(10, 9)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 9)) + "B";
  }
  if (tile.value >= Math.pow(10, 12)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 12)) + "T";
  }
  if (tile.value >= Math.pow(10, 15)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 15)) + "q";
  }
  if (tile.value >= Math.pow(10, 18)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 18)) + "Q";
  }
  if (tile.value >= Math.pow(10, 21)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 21)) + "s";
  }
  if (tile.value >= Math.pow(10, 24)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 24)) + "S";
  }
  if (tile.value >= Math.pow(10, 27)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 27)) + "O";
  }
  if (tile.value >= Math.pow(10, 30)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 30)) + "N";
  }
  if (tile.value >= Math.pow(10, 33)) {
    inner.textContent = Math.floor(tile.value / Math.pow(10, 33)) + "D";
  }
  if (tile.value < Math.pow(10, 4)) {
    inner.textContent = tile.value;
  }

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
