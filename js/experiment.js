/** Controls and all functionalities of experiments defined here*/

function calibration(scope){
	applyBlurFn(scope, getChild("focus_object"));
	scope.start_btn_disable = scope.calibration_value == 12 ? false : true;
}

function startExperiment (scope) {
	stage.getChildByName("container").visible  = false;
	stage.getChildByName("container_final").visible = true;
	scope.scene_one_hide = true;
	scope.scene_two_hide = true;
	stage.update();
}

 /** Function for apply blur effect */
function applyBlurFn(scope, obj_name){
	var _blur = Math.abs((12- scope.calibration_value));
    var _blur_apply = new createjs.BlurFilter(_blur, _blur, _blur);
    obj_name.filters = [_blur_apply]; 
    obj_name.cache(0, 0, obj_name.image.width, obj_name.image.height);
	stage.update();
}

/** Function for calibrate telescope */
function calibrateTelescope(scope){
	stage.getChildByName("container").visible  = true;
	stage.getChildByName("container_final").visible = false;
	scope.scene_one_hide = false;
	scope.scene_two_hide = false;
	scope.calibration_value = 0; /** enable mass slider */
    scope.start_btn_disable = true;
    stage.getChildByName("spectrums").alpha = 0;
    getChildFinal("main_scale_zoom_top").rotation = INITIAL_ROT_TOP;
	getChildFinal("main_scale_zoom_bottom").rotation = INITIAL_ROT_BOTTOM;
	getChildFinal("telescope_under").rotation = 0;
	getChildFinal("telescope").rotation = 0;
	getChildFinal("main_scale").rotation = INITIAL_ROT_TOP;
	getChildFinal("vernier_table").rotation = 0;
	getChildFinal("vernier_scale").rotation = 0;
	getChildFinal("grating_table").rotation = 0;
	getChildFinal("grating").rotation = 0;
	getChildFinal("grating_hanger").rotation = 0;
	getChildFinal("arrow_left").rotation = 0;
	getChildFinal("arrow_right").rotation = 180;
	getChildFinal("arrow_two_side").rotation = -90;
	stage.getChildByName("spectrums").x = 0;
    current_angle = 90;
    current_fine_angle = 0;
    current_vernier_angle = 0;
    initialisationOfImages();
    initialisationOfControls(scope);
    drawSpectrum(mercury_removed);
	stage.update();
}

function changeLamp(scope){
	selectedLamp = scope.lamp;
	selectedLamp = scope.lamp;
	for(i = 0; i < lamp_colors.length; i++){
		getChildFinal(lamp_colors[i]).alpha = 0;
	}
	getChildFinal(lamp_colors[selectedLamp]).alpha = scope.lightOn ? 1 : 0;
	if(scope.gratingPlaced){
		drawSpectrum(lampColorsArray[selectedLamp]);
	}else{
		drawSpectrum(lampColorsRemovedArray[selectedLamp]);
	}
	stage.update();
}

function lightOnOff(scope){
	scope.light_on_off_txt = scope.lightOn ? light_on_txt : light_off_txt;
	getChildFinal(lamp_colors[selectedLamp]).alpha = scope.lightOn ? 0 : 1;
	scope.lightOn = !scope.lightOn;
	stage.getChildByName("spectrums").alpha = scope.lightOn ? 1 : 0;
	stage.update();
}

function placeGrating(scope){
	scope.grating_txt = scope.gratingPlaced ? place_grating_txt : remove_grating_txt;
	getChildFinal("grating").alpha = scope.gratingPlaced ? 0 : 1;
	scope.gratingPlaced = !scope.gratingPlaced;
	if(scope.gratingPlaced){
		stage.getChildByName("spectrums").x = ((90 - current_angle - current_vernier_angle - current_fine_angle) / DEGREE_UNIT) * PX_UNIT;
		drawSpectrum(lampColorsArray[selectedLamp]);
	}else{
		drawSpectrum(lampColorsRemovedArray[selectedLamp]);
	}
	stage.update();
}

function changeTelescopeAngle(scope){
	current_angle = scope.telescope_angle;
	getChildFinal("main_scale_zoom_top").rotation = INITIAL_ROT_TOP + current_fine_angle - current_vernier_angle +(90 - current_angle);
	getChildFinal("main_scale_zoom_bottom").rotation = INITIAL_ROT_BOTTOM + (current_fine_angle - current_vernier_angle + (90 - current_angle));
	getChildFinal("telescope_under").rotation = current_fine_angle + (90 - current_angle);
	getChildFinal("telescope").rotation = current_fine_angle + (90 - current_angle);
	getChildFinal("main_scale").rotation = INITIAL_ROT_TOP + current_fine_angle + (90 - current_angle);
	getChildFinal("arrow_left").rotation = current_fine_angle + (90 - current_angle);
	getChildFinal("arrow_right").rotation = 180 + current_fine_angle + (90 - current_angle);
	getChildFinal("arrow_two_side").rotation = -90 + current_fine_angle + (90 - current_angle);
	scope.fine_angle = 0;
	stage.getChildByName("spectrums").x = ((90 - current_angle) / DEGREE_UNIT) * PX_UNIT;
	stage.update();
}

function changeVernierTableAngle(scope){
	current_vernier_angle = scope.vernier_table_angle;
	getChildFinal("vernier_table").rotation = scope.vernier_table_angle;
	getChildFinal("vernier_scale").rotation = scope.vernier_table_angle;
	getChildFinal("grating_table").rotation = scope.vernier_table_angle;
	getChildFinal("grating").rotation = scope.vernier_table_angle;
	getChildFinal("grating_hanger").rotation = scope.vernier_table_angle;
	getChildFinal("main_scale_zoom_top").rotation = (90 - current_angle - current_fine_angle) + INITIAL_ROT_TOP - scope.vernier_table_angle;
	getChildFinal("main_scale_zoom_bottom").rotation = (90 - current_angle - current_fine_angle) + INITIAL_ROT_BOTTOM - scope.vernier_table_angle;
	if(scope.gratingPlaced){
		stage.getChildByName("spectrums").x = ((90 - current_angle - current_vernier_angle - current_fine_angle) / DEGREE_UNIT) * PX_UNIT;
	}
	
	stage.update();
}

function fineAngle(scope){
	current_fine_angle = scope.fine_angle;
	getChildFinal("main_scale_zoom_top").rotation = (90 - current_angle - current_vernier_angle) + INITIAL_ROT_TOP - scope.fine_angle;
	getChildFinal("main_scale_zoom_bottom").rotation = (90 - current_angle - current_vernier_angle) + INITIAL_ROT_BOTTOM - scope.fine_angle;
	getChildFinal("telescope_under").rotation = (90 - current_angle) - scope.fine_angle;
	getChildFinal("telescope").rotation = (90 - current_angle) - scope.fine_angle;
	getChildFinal("main_scale").rotation = (90 - current_angle) - scope.fine_angle;
	getChildFinal("arrow_left").rotation = (90 - current_angle) - scope.fine_angle;
	getChildFinal("arrow_right").rotation = 180 + (90 - current_angle) - current_fine_angle;
	getChildFinal("arrow_two_side").rotation = -90 + (90 - current_angle) - current_fine_angle;
	scope.telescope_angle = (current_angle + scope.fine_angle).toFixed(3);
	stage.getChildByName("spectrums").x = ((90 - current_angle - scope.fine_angle - current_vernier_angle) / DEGREE_UNIT) * PX_UNIT;
	stage.update();	
}

/** Drag telescope to adjust the telescope movement */
function dragTelescope(scope) { 
    var  _limit_flag = false;
    var _angle = scope.telescope_angle;    
    getChildFinal("telescope").on("pressmove", function (evt) { /** Drag telescope */
       	if(evt.stageY <= CENTER_Y){
       		if(_angle >= 0){            
	            var _adj = evt.stageX - CENTER_X;
	            var _opp = CENTER_Y - evt.stageY;
	            _angle = Math.atan2(_opp, _adj);
	            _angle = _angle * (180/Math.PI) - 90;
	            _angle=Math.round(_angle*10)/10;
	            if( hit_flag == false){
	                if(_angle > -270 && _angle < -180){                
	                    _angle = 90 - (-270 - _angle);
	                              
	                }
	            }                  
	            _angle = Math.round(_angle*10)/10;
	            scope.telescope_angle = parseFloat(_angle.toFixed(1)); 
	            scope.$apply();       
	            changeTelescopeAngle(scope);
	            stage.update();              
	        }else{
	            _limit_flag = true;            
	        }
       }else{
       		if(evt.stageX <= CENTER_X ){            
	            var _adj = evt.stageX - CENTER_X;
	            var _opp = CENTER_Y - evt.stageY;
	            _angle = Math.atan2(_opp, _adj);
	            _angle = _angle * (180/Math.PI) - 90;
	            _angle=Math.round(_angle*10)/10;
	            if( hit_flag == false){
	                if(_angle > -270 && _angle < -180){                
	                    _angle = 90 - (-270 - _angle);
	                        
	                }
	            }                  
	            _angle = Math.round(_angle*10)/10;
	            scope.telescope_angle = parseFloat(_angle.toFixed(1)); 
	            scope.$apply();       
	            changeTelescopeAngle(scope);
	            stage.update();              
	        }else{
	            _limit_flag = true;            
	        }
       }

      
    });
   getChildFinal("telescope").on("pressup", function (evt) { 
       if(_limit_flag){
            _limit_flag = false;   
            if(_angle > 180){
                _angle = 180; 
                hit_flag=true;               
            }else if(_angle < 0){
                _angle = 0;
                hit_flag=false;                  
            }else{
                hit_flag=false;
            } 
        } 
         
        var _tel_slider_val= _angle;
        scope.telescope_angle = parseFloat(_tel_slider_val.toFixed(3));                
        scope.$apply(); 
        changeTelescopeAngle(scope);
        stage.update();
    });
}

/** Right arrow click for fine adjustment of telescope */
function clickRightArrow(scope) { 
    var _angle;    
    getChildFinal("arrow_right").on("click", function (evt) { /** Drag telescope */
     
     _angle = scope.fine_angle;
    if(_angle <= 19.9){
    	scope.fine_angle = parseFloat((_angle + 0.1).toFixed(1));
     	scope.$apply();
     	fineAngle(scope);
    }
     
 	});
 	getChildFinal("arrow_right").on("mousedown", function (evt) {
 		
 		getChildFinal("arrow_right").alpha = 0.5;
 		stage.update();
 	});

 	getChildFinal("arrow_right").on("pressup", function (evt) {
 		
 		getChildFinal("arrow_right").alpha = 1;
 		stage.update();
 	});
}
/** Left arrow click for fine adjustment of telescope */
function clickLeftArrow(scope) { 
    var _angle;   
    getChildFinal("arrow_left").on("click", function (evt) { /** Drag telescope */
 		_angle = scope.fine_angle;
    if(_angle >= -19.9){
    	scope.fine_angle = parseFloat((_angle - 0.1).toFixed(1));
     	scope.$apply();
     	fineAngle(scope);
    }     
 	});

 	getChildFinal("arrow_left").on("mousedown", function (evt) {
 		
 		getChildFinal("arrow_left").alpha = 0.5;
 		stage.update();
 	});

 	getChildFinal("arrow_left").on("pressup", function (evt) {
 		
 		getChildFinal("arrow_left").alpha = 1;
 		stage.update();
 	});

 	getChildFinal("telescope").on("mouseover", function (evt) { /** Drag telescope */
	 	getChildFinal("arrow_two_side").alpha = 1;
	 	stage.update();    
 	});
 	getChildFinal("telescope").on("mouseout", function (evt) { /** Drag telescope */
	 	getChildFinal("arrow_two_side").alpha = 0;
	 	stage.update();    
 	});
}