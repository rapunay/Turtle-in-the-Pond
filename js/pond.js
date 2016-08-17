"use strict"

var Pond = (function(){
	function Pond(options){
		this.container;
		this.turtle;
		this.rows;
		this.cols;
		
		$.extend(this, options);
	};
	
	var shortErrors = {
			execErr: "Unable to execute command!"
		},
		longErrors = {
			tooFewArgs: "There are too few information for the command.",
			tooManyArgs: "There are too many information for the command.",
			placeInvalidPos: "Please enter a valid coordinates for PLACE command.",
			noTurtle: "Please put a turtle in the pond using PLACE before executing another command.",
			invCommand: "The command is not available in the list of supported commands."
		};
	
	$.extend(Pond.prototype, {
		create: function(){
			var $pondContainer = $("<div id='pondContainer'><div class='errorContainer'><div class='shortErr'></div><div class='longErr'></div></div><div id='pond' tabindex='-1'></div></div>"),
				pondContent = [];
			
			for(var i=(this.rows-1); i>=0; i--){
				pondContent.push("<div class='pond-row' id='" +i+ "'>");
				for(var j=0; j<this.cols; j++){
					pondContent.push("<div class='pond-col' id='" +j+ "'></div>");
				}
				pondContent.push("</div>")
			}
			$pondContainer.find("#pond").append(pondContent.join(""));
			
			this.container = $pondContainer;
			return $pondContainer;
		},
		
		executeCommand: function(command){
			var params = command.toUpperCase().split(" "),
				$errorCont = this.container.find(".errorContainer");
			
			if(params[0] == "PLACE"){
				if(params.length < 2){
					_displayError($errorCont, shortErrors["execErr"], longErrors["tooFewArgs"]);
				}else if(params.length > 2){
					_displayError($errorCont, shortErrors["execErr"], longErrors["tooManyArgs"]);
				}else{
					var placePos = params[1].split(","),
						turtle = this.turtle;
					
					if(placePos.length < 3 || placePos.length > 3){
						_displayError($errorCont, shortErrors["execErr"], longErrors["placeInvalidPos"]);
					}else{
						if(!turtle){
							turtle = this.createTurtle(this.container.find("#pond"), this.rows-1, this.cols-1);
						}
						if(turtle.place(placePos[0], placePos[1], placePos[2])){
							this.turtle = turtle;
							_hideError($errorCont);
						}else{
							_displayError($errorCont, shortErrors["execErr"], longErrors["placeInvalidPos"]);
						}
					}
				}
			}else{
				if(!this.turtle){
					_displayError($errorCont, shortErrors["execErr"], longErrors["noTurtle"]);
				}else{
					if(params.length > 1){
						_displayError($errorCont, shortErrors["execErr"], longErrors["tooManyArgs"]);
					}else{
						if(params[0] == "MOVE"){
							this.turtle.move();
							_hideError($errorCont);
						}else if(params[0] == "LEFT"){
							this.turtle.left();
							_hideError($errorCont);
						}else if(params[0] == "RIGHT"){
							this.turtle.right();
							_hideError($errorCont);
						}else if(params[0] == "REPORT"){
							this.turtle.report();
							_hideError($errorCont);
						}else{
							_displayError($errorCont, shortErrors["execErr"], longErrors["invCommand"]);
						}
						
						
					}
				}
			}
		},
		
		createTurtle: function($pond, maxRow, maxCol){
			var turtle = new Turtle({
					pond: $pond,
					maxRow:maxRow,
					maxCol:maxCol
				});
				
			return turtle;
		}
	});
	
	function _displayError($errorCont, shortErr, longErr){
		$errorCont.addClass("hasError");
		$errorCont.find(".shortErr").empty().text(shortErr);
		$errorCont.find(".longErr").empty().text(longErr);
	};
	
	function _hideError($errorCont){
		$errorCont.removeClass("hasError");
		$errorCont.find(".shortErr").empty();
		$errorCont.find(".longErr").empty();
	};
	
	return Pond;
})();

var Turtle = (function(){
	function Turtle(options){
		this.pond = $(document);
		this.maxCol;
		this.maxRow;
		this.col;
		this.row;
		this.direction = "";
		
		$.extend(this, options)
	};
	
	var directions = ["NORTH", "EAST", "SOUTH", "WEST"];
	
	$.extend(Turtle.prototype, {
		place: function(col, row, direction){
			if(directions.indexOf(direction) < 0){
				return 0;
			}
			if(isNaN(col) || parseInt(col) > this.maxCol || parseInt(col) < 0){
				return 0;
			}
			if(isNaN(row) || parseInt(row) > this.maxRow || parseInt(row) < 0){
				return 0;
			}
		
			var $pond = this.pond,
				pondCell = $pond.find(".pond-row#" +row+ " .pond-col#" +col),
				turtleCell = $pond.find(".turtleCell");
		
			turtleCell.removeClass("turtleCell");
			turtleCell.removeClass(this.direction.toLowerCase());
			pondCell.addClass("turtleCell");
			pondCell.addClass(direction.toLowerCase());
			
			this.col = col;
			this.row = row;
			this.direction = direction;
			return 1;
		},
		
		move: function(){
			var direction = this.direction,
				col = parseInt(this.col, 10),
				row = parseInt(this.row, 10);
			
			if(direction == "NORTH" && parseInt(row) < this.maxRow){
					row++;
			}else if(direction == "EAST" && parseInt(col) < this.maxCol){
					col++;
			}else if(direction == "WEST" && parseInt(col) > 0){
					col--;
			}else if(direction == "SOUTH" && parseInt(row) > 0){
					row--;
			}
			
			this.place(col, row, direction);
		},
		
		right: function(){
			var newDirection = (directions.indexOf(this.direction) + 1) % directions.length;
			this.place(this.col, this.row, directions[newDirection]);
		},
		
		left: function(){
			var newDirection = (directions.indexOf(this.direction) + directions.length - 1) % directions.length;
			this.place(this.col, this.row, directions[newDirection]);
		},
		
		report: function(){
			console.log(this.col, this.row, this.direction.toUpperCase());
		}
	});
	
	return Turtle;
})();
