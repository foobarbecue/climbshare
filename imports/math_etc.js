import THREE from 'three';
/**
 * Convenience function for making Vector3s
 */
v = function (x, y, z) {
    return new THREE.Vector3(x, y, z);
}

/**
 * Given @start and @end points, create a curve that is "pulled" at the midpoint towards @pull.
 * @param {Vector3} start
 * @param {Vector3} end
 * @param {Vector3} pull
 */
midPullPoint = function (start, end, pull) {
    // have to work on a clone because lerp modifes in place
    midPullPointSln = start.clone()
    midPullPointSln.lerp(end, 0.5);
    midPullPointSln.add(pull);
    return midPullPointSln
}

/**
 * Given a list of vectors representing a boulder problem, produce splines that curve away
 * from the rock so as to stay visible.
 * @param {Array} pointlist
 * @param {Vector3} pull
 * @param {Material} material
 */
curvify = function (pointlist, pull, material) {
    // Check that there's more than one point in the list -- otherwise
    // makes no sense to draw curves.
    if (pointlist.length > 1){
        var pull = pull || v(0,-1,0)
        var material = material || new THREE.LineBasicMaterial();
        var cp = new THREE.CurvePath();
        for ( var i=0 ; i < pointlist.length-1 ; i++){
            start = pointlist[i]
            end = pointlist[i+1]
            midPointPulled=midPullPoint(start, end, pull)
            curveSegment=new THREE.QuadraticBezierCurve3(start, midPointPulled, end); 
            cp.add(curveSegment);
        }
        curvifiedProblem = new THREE.Line(cp.createPointsGeometry(200) , material)
        return curvifiedProblem
    }
    else{
        return null
    }
}

// TODO should go in UI.js once packaging figured out
positionLabelIcons = function (){
    // position label images on top of right edge of labels
    Labels.find().forEach(function(lbl){
        var lbl_el=$('.label3D.'+lbl._id);
        // only attempt if label is already drawn
        if (lbl_el.length > 0){
            var lbl_type_img=lbl_el.children('img');
            lbl_type_img.position(
                {my:'center',
                 at:'right top',
                 of:lbl_el,
                 offset:'0 10',
//                  using: function(pos) {
//                     $(this).animate(pos, 50, "linear");
//                 }
                });
        }
    })
}
