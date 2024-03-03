(function(){
  angular
       .module('users')
	   .directive("experiment",directiveFunction)
})();

var stage, exp_canvas, stage_width, stage_height;

var object_zoom_mask,vernier_zoom_top_mask,vernier_zoom_bottom_mask;

var CENTER_X,CENTER_Y,INITIAL_ROT_TOP,INITIAL_ROT_BOTTOM,PX_UNIT,DEGREE_UNIT;

var light_off_txt,light_on_txt,place_grating_txt,remove_grating_txt;

var current_angle,current_fine_angle,current_vernier_angle,min_max_limit;

var spectrums,spectrum_container,mercury,hydrogen,neon;

var selectedLamp;

var lampColorsArray,lampColorsRemovedArray;

var hit_flag,lamp_colors;

function directiveFunction(){
	return {
		restrict: "A",
		link: function(scope, element,attrs){
			/** Variable that decides if something should be drawn on mouse move */
			var experiment = true;
			if ( element[0].width > element[0].height ) {
				element[0].width = element[0].height;
				element[0].height = element[0].height;
			} else {
				element[0].width = element[0].width;
				element[0].height = element[0].width;
			}  
			if ( element[0].offsetWidth > element[0].offsetHeight ) {
				element[0].offsetWidth = element[0].offsetHeight;			
			} else {
				element[0].offsetWidth = element[0].offsetWidth;
				element[0].offsetHeight = element[0].offsetWidth;
			}
			 /** Array to store all file name of images used in experiment and it used to create each image objects */
            images_array = ["bg_side_view_bottom","bg_side_view_top","focus_object","bg_top_view",
            "grating_table","vernier_table","collimator_under","collimator","grating","grating_hanger",
            "telescope","telescope_under","main_scale","vernier_scale","light_off","light_mercury",
            "light_hydrogen","light_neon","arrow","arrow_two_side"];
            lamp_colors = ['Mercury','Hydrogen','Neon'];
            mercury_removed = [{colorVal:"225,225,225",first_order:0,second_order:0}]
            mercury = [{colorVal:"187,182,184",first_order:0,second_order:0},
            {colorVal:"112,48,160",first_order:14.05,second_order:29.05},
            {colorVal:"83,142,213",first_order:15.16,second_order:31.53},
            {colorVal:"146,208,80",first_order:19.13,second_order:40.94},
            {colorVal:"225,225,0",first_order:20.33,second_order:44.01},
            {colorVal:"225,0,0",first_order:23.23,second_order:52.08}];
            hydrogen_removed = [{colorVal:"252,251,80",first_order:0,second_order:0}]
            hydrogen = [{colorVal:"249,245,210",first_order:0,second_order:0},
            {colorVal:"112,48,160",first_order:14.25,second_order:29.49},
            {colorVal:"153,102,225",first_order:15.10,second_order:31.39},
            {colorVal:"102,225,225",first_order:16.96,second_order:35.68},
            {colorVal:"225,0,0",first_order:23.19,second_order:51.96}];
            neon_removed = [{colorVal:"181,60,154",first_order:0,second_order:0}]
            neon = [{colorVal:"245,211,237",first_order:0,second_order:0},
            {colorVal:"146,208,80",first_order:18.91,second_order:40.4},
            {colorVal:"225,225,0",first_order:20.56,second_order:44.61},
            {colorVal:"225,102,0",first_order:22.34,second_order:49.47},
            {colorVal:"204,0,0",first_order:23.19,second_order:51.96}];
            lampColorsArray = [mercury,hydrogen,neon];
            lampColorsRemovedArray = [mercury_removed,hydrogen_removed,neon_removed];
            exp_canvas=document.getElementById("demoCanvas");
			exp_canvas.width=element[0].width;
			exp_canvas.height=element[0].height;            
    		stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);
			object_zoom_mask = new createjs.Shape();
            vernier_zoom_top_mask = new createjs.Shape();
            vernier_zoom_bottom_mask = new createjs.Shape();
            spectrum_zoom_mask = new createjs.Shape();
            cross_line_vertical = new createjs.Shape();
            cross_line_horizontal = new createjs.Shape();
            spectrums = new createjs.Shape();
			queue.installPlugin(createjs.Sound);
			loadingProgress(queue, stage, exp_canvas.width);
			queue.on("complete", handleComplete, this);
			var queue_obj = [];/** Array to store object of each images */
            for ( i = 0; i < images_array.length; i++ ) {/** Creating object of each element */
                queue_obj[i] = {id: images_array[i],src: "././images/"+images_array[i]+".svg",type: createjs.LoadQueue.IMAGE};
            }
			queue.loadManifest(queue_obj);			
			stage.enableDOMEvents(true);
            stage.enableMouseOver();
            createjs.Touch.enable(stage);
        //    tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
            
            container = new createjs.Container(); /** Creating the circular coil container */
            container.name = "container";
            stage.addChild(container); /** Append it in the stage */

            container_final = new createjs.Container(); /** Creating the circular coil container */
            container_final.name = "container_final";
            stage.addChild(container_final); /** Append container to stage */

            spectrum_container = new createjs.Container(); /** Creating the circular coil container */
            spectrum_container.name = "spectrums";
            stage.addChild(spectrum_container); /** Append container to stage */
            stage.getChildByName("spectrums").alpha = 0;
			function handleComplete(){
                initialisationOfVariables(); /** Initializing the variables */			
                loadImages(queue.getResult("bg_side_view_bottom"),"background",0,0,"",0,container,1);                     
				loadImages(queue.getResult("bg_side_view_top"),"background",0,0,"",0,container,1);                     
				loadImages(queue.getResult("focus_object"),"focus_object",35,-60,"",0,container,1);                     
                object_zoom_mask.graphics.beginStroke("white").setStrokeStyle(3).drawCircle(235,146.5,116);
                container.addChild(object_zoom_mask);
                loadImages(queue.getResult("bg_top_view"),"bg_top_view",0,0,"",0,container_final,1);
                loadImages(queue.getResult("collimator_under"),"collimator_under",CENTER_X,CENTER_Y,"",0,container_final,1);
                loadImages(queue.getResult("telescope_under"),"telescope_under",CENTER_X,CENTER_Y,"",0,container_final,1);
                loadImages(queue.getResult("main_scale"),"main_scale",CENTER_X,CENTER_Y,"",INITIAL_ROT_TOP,container_final,0.143);
                loadImages(queue.getResult("vernier_scale"),"vernier_scale",CENTER_X,CENTER_Y,"",0,container_final,0.143);
                loadImages(queue.getResult("vernier_table"),"vernier_table",CENTER_X,CENTER_Y,"",0,container_final,1);
                loadImages(queue.getResult("collimator"),"collimator",CENTER_X,CENTER_Y,"",0,container_final,1);
                loadImages(queue.getResult("telescope"),"telescope",CENTER_X,CENTER_Y,"pointer",0,container_final,1);
                loadImages(queue.getResult("arrow"),"arrow_left",CENTER_X,CENTER_Y,"pointer",0,container_final,1);
                loadImages(queue.getResult("arrow"),"arrow_right",CENTER_X,CENTER_Y,"pointer",180,container_final,1);
                loadImages(queue.getResult("arrow_two_side"),"arrow_two_side",CENTER_X,CENTER_Y,"pointer",-90,container_final,1);
                loadImages(queue.getResult("grating_table"),"grating_table",CENTER_X,CENTER_Y,"",0,container_final,1);
                loadImages(queue.getResult("grating"),"grating",CENTER_X,CENTER_Y,"",0,container_final,1);
                loadImages(queue.getResult("grating_hanger"),"grating_hanger",CENTER_X,CENTER_Y,"",0,container_final,1);
                vernier_zoom_top_mask.graphics.beginStroke("white").setStrokeStyle(3).drawRoundRectComplex (410,10,280,160,10,10,10,10);
                container_final.addChild(vernier_zoom_top_mask);
                vernier_zoom_bottom_mask.graphics.beginStroke("white").setStrokeStyle(3).drawRoundRectComplex (410,530,280,160,10,10,10,10);
                container_final.addChild(vernier_zoom_bottom_mask);
                loadImages(queue.getResult("main_scale"),"main_scale_zoom_top",550,720,"",INITIAL_ROT_TOP,container_final,1);          
                loadImages(queue.getResult("vernier_scale"),"vernier_scale_zoom_top",550,717,"",0,container_final,1);
                loadImages(queue.getResult("main_scale"),"main_scale_zoom_bottom",550,1240,"",INITIAL_ROT_BOTTOM,container_final,1);          
                loadImages(queue.getResult("vernier_scale"),"vernier_scale_zoom_bottom",550,1237,"",0,container_final,1);
                spectrum_zoom_mask.graphics.beginStroke("white").beginFill("black").setStrokeStyle(2).drawCircle(90,90,80);
                container_final.addChild(spectrum_zoom_mask);
                spectrum_container.mask = spectrum_zoom_mask;
                drawSpectrum(mercury_removed);
                cross_line_vertical.graphics.setStrokeDash([4,3]);
                cross_line_vertical.graphics.beginStroke("white").setStrokeStyle(1);
                cross_line_vertical.graphics.moveTo(90,10);
                cross_line_vertical.graphics.lineTo(90,170);
                cross_line_vertical.alpha = 0.7;
                container_final.addChild(cross_line_vertical);
                cross_line_horizontal.graphics.setStrokeDash([4,3]);
                cross_line_horizontal.graphics.beginStroke("white").setStrokeStyle(1);
                cross_line_horizontal.graphics.moveTo(10,90);
                cross_line_horizontal.graphics.lineTo(170,90);
                cross_line_horizontal.alpha = 0.7;
                container_final.addChild(cross_line_horizontal);
                loadImages(queue.getResult("light_off"),"light_off",637,325,"",0,container_final,1);
                loadImages(queue.getResult("light_mercury"),"Mercury",543,320,"",0,container_final,1);
                loadImages(queue.getResult("light_hydrogen"),"Hydrogen",543,320,"",0,container_final,1);
                loadImages(queue.getResult("light_neon"),"Neon",543,320,"",0,container_final,1);


                /** Text box loading */
                setText("start_txt",515, 195,_("Vernier 1"),"white",1,container_final);
                setText("start_txt",515, 520,_("Vernier 2"),"white",1,container_final);
                
			    translationLabels(); /** Translation of strings using gettext */
				initialisationOfControls(scope); /** Function call for initialisation of control side variables */
				initialisationOfImages(); /** Function call for images used in the apparatus visibility */
				
                stage.update();
                dragTelescope(scope);
                clickRightArrow(scope);
                clickLeftArrow(scope);
			}
            
			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */	
			function translationLabels(){
                /** This help array shows the hints for this experiment */
				helpArray=[_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("help6"),_("help7"),_("Next"),_("Close"),_("help8"),_("help9")];
                scope.heading=_("Emission spectra");
				scope.variables=_("Variables");                 
				scope.result=_("Result");  
				scope.copyright=_("copyright"); 
				scope.calibrate_txt = _("Reset");
                scope.calibrate_slider_txt = _("Calibrate Telescope :");
                scope.select_lamp_txt = _("Select Lamp :");
                light_on_txt = _("Switch On Light");
                light_off_txt = _("Switch Off Light");
                place_grating_txt = _("Place grating");
                remove_grating_txt = _("Remove grating");
                scope.telescope_angle_txt = _("Angle of Telescope :");
                scope.vernier_table_angle_txt = _("Angle of Vernier Table :");
                scope.fine_angle_txt = _("Fine Angle of Telescope :");
                scope.start_txt = _("Start");
				scope.reset_txt = _("Reset");
                scope.lamp_array = [{
                        lamp:_("Mercury"),
                        index:0
                    },{
                        lamp:_("Hydrogen"),
                        index:1
                    },{
                        lamp:_("Neon"),
                        index:2
                    }];
                scope.$apply();				
			}
		}
	}
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container){
    var text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
    container.addChild(text); /** Adding text to the container */
    stage.update();
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot, container,scale){
    var _bitmap = new createjs.Bitmap(image).set({});
    if (name == 'grating_table' || name == 'vernier_table' || name == 'main_scale' || name == 'vernier_scale'
        || name == 'main_scale_zoom_top'|| name == 'vernier_scale_zoom_top' || name == 'main_scale_zoom_bottom'
        || name == 'vernier_scale_zoom_bottom') {
       
        _bitmap.regX = _bitmap.image.width/2;
        _bitmap.regY = _bitmap.image.height/2;
        if(name == "main_scale_zoom_top"){
            _bitmap.mask = vernier_zoom_top_mask; /** Adding mask to zoom portion of lense */ 
        }else if(name == "vernier_scale_zoom_top"){
            _bitmap.mask = vernier_zoom_top_mask; /** Adding mask to zoom portion of lense */ 
        }else if(name == "main_scale_zoom_bottom"){
            _bitmap.mask = vernier_zoom_bottom_mask; /** Adding mask to zoom portion of lense */ 
        }else if(name == "vernier_scale_zoom_bottom"){
            _bitmap.mask = vernier_zoom_bottom_mask; /** Adding mask to zoom portion of lense */ 
        }      
    }else if(name == "focus_object"){
        _bitmap.mask = object_zoom_mask; /** Adding mask to zoom portion of lense */ 
    }else if(name == "collimator_under"){
        _bitmap.regY = 143;
        _bitmap.regX = 12;
    }else if(name == "collimator"){
        _bitmap.regY = 29;
        _bitmap.regX = -24;
    }else if(name == "grating" || name == "grating_hanger"){
        _bitmap.regY = 117.5;
        _bitmap.regX = 125;
    }else if(name == "telescope_under"){
        _bitmap.regY = 61;
        _bitmap.regX = 160;
    }else if(name == "telescope"){
        _bitmap.regY = 54;
        _bitmap.regX = 263;
    }else if(name == "arrow_left"){
        _bitmap.regY = 64;
        _bitmap.regX = 132;
    }else if(name == "arrow_right"){
        _bitmap.regY = -55;
        _bitmap.regX = -99;
    }else if(name == "arrow_two_side"){
        _bitmap.regY = 245;
        _bitmap.regX = 35;
    }else if(name == "main_scale_zoom_top"){
        _bitmap.mask = vernier_zoom_top_mask; /** Adding mask to zoom portion of lense */ 
    }
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX=_bitmap.scaleY=scale;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor;    
    container.addChild(_bitmap); /** Adding bitmap to the container */ 
    stage.update();
}

/** function to return chiled element of container */
function getChild(chldName){
    return container.getChildByName(chldName);
}

/** function to return chiled element of containerm, 'container_final' */
function getChildFinal(chldName){
    return container_final.getChildByName(chldName);
}

function initialisationOfControls(scope){
    document.getElementById("site-sidenav").style.display = "block";
    scope.grating_txt = place_grating_txt;
    scope.light_on_off_txt = light_on_txt;
    scope.calibration_value = 0; /** enable mass slider */
    scope.start_btn_disable = true;
    scope.scene_one_hide = false;
    scope.scene_two_hide = false;
    scope.telescope_angle = 90;
    scope.vernier_table_angle = 0;
    scope.fine_angle = 0;
    scope.lightOn = false;
    scope.lamp = scope.lamp_array[0].lamp;
    scope.gratingPlaced = false;
    selectedLamp = 0;

}
/** All variables initialising in this function */
function initialisationOfVariables() {
    CENTER_X = 350; /** Horizontal center point of canvas */
    CENTER_Y = 350; /** Vertical enter point of canvas */
    INITIAL_ROT_TOP = -8;
    INITIAL_ROT_BOTTOM = 172;
    PX_UNIT = 4; /** Here 0.5 degree is considered as 2px */
    DEGREE_UNIT = 0.5; /** 0.5 considered as basic degree unit for line spectram */
    current_angle = 90;
    current_fine_angle = 0;
    current_vernier_angle = 0;
    min_max_limit = false;
    hit_flag=false;/** Hit telescope */
    
}
/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
   var _blur_apply = new createjs.BlurFilter(12, 12, 12);
   getChild("focus_object").filters = [_blur_apply]; 
   getChild("focus_object").cache(0, 0, getChild("focus_object").image.width, getChild("focus_object").image.height);
   stage.getChildByName("container_final").visible = false;
   getChildFinal("Mercury").alpha = 0;
   getChildFinal("Hydrogen").alpha = 0;
   getChildFinal("Neon").alpha = 0;
   getChildFinal("grating").alpha = 0;
   getChildFinal("arrow_two_side").alpha = 0;
}

function drawSpectrum(dataArray){
    spectrums.graphics.clear();
    for (var i = (dataArray.length - 1) * -1; i < dataArray.length; i++) {
        var j = i < 0 ? (-1 * i) : i;
        spectrums.graphics.beginStroke("rgba("+dataArray[j].colorVal+",1)").setStrokeStyle(2);
        var first_order_x = 90 + (dataArray[j].first_order/DEGREE_UNIT) * PX_UNIT * ( i == 0 ? 1 : i / j );
        spectrums.graphics.moveTo(first_order_x,5);
        spectrums.graphics.lineTo(first_order_x,175);
        spectrums.graphics.beginStroke("rgba("+dataArray[j].colorVal+",0.5)").setStrokeStyle(2);
        var second_order_x = 90 + (dataArray[j].second_order/DEGREE_UNIT) * PX_UNIT * i / j;
        spectrums.graphics.moveTo(second_order_x,5);
        spectrums.graphics.lineTo(second_order_x,175);

        spectrum_container.addChild(spectrums);
        stage.update();
    };
}
/** Resetting the experiment */
function resetExperiment(scope){
    
}
