function addNewClimb(){
    boulder = Boulders.findOne({name:Session.get('loadedBoulder')})
    return Climbs.insert({
        climbName: 'new climb',
        boulder_id: boulder._id,
        createdBy:Meteor.userId(),
    })
}

function addVertexToClimb(climb){
    climb.vertices.push(
        mouse3D.position.x,
        mouse3D.position.y,
        mouse3D.position.z        
    )
}