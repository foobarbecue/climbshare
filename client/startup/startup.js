Meteor.startup(function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    // TODO most of this stuff should not happen if we're on a map page

    Router.route('/', function () {
        Session.set('area','socorro');
        this.render('areaMap');
    });

    Router.route('/:area/:boulder', function () {
        Session.set('area', this.params.area);
        Session.set('loadedBoulder', this.params.boulder);
        this.render('boulderPage');
    });

    Router.route('/:area', function () {
        Session.set('area', this.params.area);
        this.render('areaMap');
    });

    Climbsim.init();

    function colorAllClimbsWhite() {
        $(Climbsim.scene.children).each(function () {
            if (this instanceof THREE.Line) {
                this.material.color.set('white');
            }
        })
    }
    Climbsim.animate();
    // Load the currently selected 3D boulder model
    Deps.autorun(function () {
        try {
            boulderName = Session.get('loadedBoulder');
            Climbsim.loadBoulder(boulderName);
            $('#boulderList').val(boulderName);
        } catch (TypeError) {
            console.log('failed to load ' + boulderName);
        }
    })
    
    // Color the currently selected label and climb
    Deps.autorun(function () {
        // 
        labelId = Session.get('selectedLabel');
        if (typeof labelId === 'undefined') {
            $('.label3D,.ctrlPnlClimb').removeClass('selected');
            $('.label3D,.ctrlPnlClimb').children('.hidden').hide();
            colorAllClimbsWhite();
        } else {
            $('.label3D,.ctrlPnlClimb').children('.hidden').hide();
            $('.label3D,.ctrlPnlClimb').removeClass('selected');
            $('.' + labelId).addClass('selected');
            $('.' + labelId).children('.hidden').fadeIn();
            var label = Labels.findOne(labelId);
            if (label && (label.refers_to_type == "climb")) {
                climbId = label.refers_to_id
                selectedThreeObj = Climbsim.scene.getObjectByName(climbId);
                colorAllClimbsWhite();
                // turn the selected one red
                selectedThreeObj.material.color.set('red');
            }
        }
        positionLabelIcons();
    })
    
    // Draw climb if it changes
    Deps.autorun(function(){
        Climbsim.loadClimbs();
    }
    )

    Session.set('mouseTool', 'addLabel');
    Session.set('toolboxTip','Click a tool, then double click on the rock.')
})