"use strict"

var Project;
(function(Project){
	Project.ViewPort = (function(){
		function ViewPort(options){
			this.elem;
			this.rows;
			this.cols;
			this.inputField;
			this.button;
			this.pond;
			
			$.extend(this, options);
		};
			
		$.extend(ViewPort.prototype, {
			init: function(){
				_initContent(this);
				_initEventHandlers(this);
			}
		});
			
		function _initContent(ViewPort){
			var $viewPort = ViewPort.elem,
				$inputField = $viewPort.find("#commandField"),
				$button = $viewPort.find("#commandBtn");
			
			ViewPort.inputField = $inputField;
			ViewPort.button = $button;
			
			ViewPort.pond = new Pond({
				rows:ViewPort.rows,
				cols:ViewPort.cols
			});
			$viewPort.append(ViewPort.pond.create());
			
			ViewPort.inputField.focus();
		};
		
		function _initEventHandlers(ViewPort){
			ViewPort.button.on("click", {_ViewPort: ViewPort}, function(e){
				var _ViewPort = e.data._ViewPort;
				_getAndExecuteCommand(_ViewPort);
			});
			
			ViewPort.inputField.on("keydown", {_ViewPort: ViewPort}, function(e){
				if(e.which == 13){
					var _ViewPort = e.data._ViewPort;
					_getAndExecuteCommand(_ViewPort);
				}
			});
			
			ViewPort.elem.find("#pond").on("keydown", {_pond: ViewPort.pond}, function(e){
				var _pond = e.data._pond;
			
				if(e.which == 38){
					_pond.executeCommand("MOVE");
				}else if(e.which == 37){
					_pond.executeCommand("LEFT");
				}else if(e.which == 39){
					_pond.executeCommand("RIGHT");
				}else if(e.which == 40){
					_pond.executeCommand("REPORT");
				}
				
				e.preventDefault();
			});
			
			ViewPort.elem.find("#pond .pond-col").on("click", {_ViewPort: ViewPort}, function(e){
				var _ViewPort = e.data._ViewPort,
					pond = _ViewPort.pond,
					row = $(e.target).closest(".pond-row").attr("id"),
					col = $(e.target).attr("id"),
					direction = "NORTH";
					
				if(!pond.turtle){
					pond.turtle = pond.createTurtle(pond.container.find("#pond"), _ViewPort.rows-1, _ViewPort.cols-1);
				}else{
					direction = pond.turtle.direction;
				}
					
				pond.turtle.place(col, row, direction);
			});
		};
		
		function _getAndExecuteCommand(viewPort){
			var command = viewPort.inputField.val();
			
			if(command != ""){
				viewPort.pond.executeCommand(command);
				viewPort.inputField.val("");
			}
		};
		
		return ViewPort;
	})();
})(Project || (Project = {}));

$(function(){
	var viewPort = new Project.ViewPort({
		elem:$("#viewPort"),
		rows: 5,
		cols: 5
	});
	viewPort.init();
});