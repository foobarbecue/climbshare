 
Meteor.startup(function () {
    Climbsim.init();

    function colorAllClimbsWhite() {
        $(threeScene.children).each(function () {
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
        } catch (TypeError) {
            console.log('failed to load ' + boulderName)
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
                selectedThreeObj = threeScene.getObjectByName(climbId);
                colorAllClimbsWhite();
                // turn the selected one red
                selectedThreeObj.material.color.set('red');
            }
        }
        positionLabelIcons();
    })

    Session.set('loadedBoulder', 'Streambed');
    Session.set('mouseTool', 'addLabel');
})