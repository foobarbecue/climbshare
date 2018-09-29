import * as THREE from 'three';


/**
 * Given @start and @end points, create a curve that is "pulled" at the midpoint towards @pull.
 * @param {Vector3} start
 * @param {Vector3} end
 * @param {Vector3} pull
 */
const midPullPoint = function (start, end, pull) {
    // have to work on a clone because lerp modifes in place
    const midPullPointSln = start.clone();
    midPullPointSln.lerp(end, 0.5);
    midPullPointSln.add(pull);
    return midPullPointSln
};

/**
 * Given a list of vectors representing a boulder problem, produce splines that curve away
 * from the rock so as to stay visible.
 * @param {Array} pointlist
 * @param {Vector3} pull
 * @param {Material} material
 */
const curvify = function (pointlist, pull = new THREE.Vector3(0,-1,0), material = new THREE.LineBasicMaterial()) {
    // Check that there's more than one point in the list -- otherwise
    // makes no sense to draw curves.
    if (pointlist.length > 1){
        // const pull = pull || new THREE.Vector3(0,-1,0);
        // const material = material || new THREE.LineBasicMaterial();
        let cp = new THREE.CurvePath();
        for ( let i=0 ; i < pointlist.length-1 ; i++){
            let start = pointlist[i];
            let end = pointlist[i+1];
            let midPointPulled=midPullPoint(start, end, pull);
            let curveSegment=new THREE.QuadraticBezierCurve3(start, midPointPulled, end);
            cp.add(curveSegment);
        }
        const cpPoints = cp.getPoints(200);
        const geom = new THREE.Geometry();
        geom.setFromPoints(cpPoints);
      return new THREE.Line(geom, material)
    }
    else{
        return null
    }
};

export default curvify;
