insertBoulder = function(boulder){
    for (var climbName in boulder.climbs){
        climb=boulder.climbs[climbName];
        climb_id=Climbs.upsert({climbName:climbName},climb);
        Labels.upsert(
            {content:climbName},
            {content:climbName,
            position:{
                x:climb.vertices[0][0],
                y:climb.vertices[0][1],
                z:climb.vertices[0][2]
            },
            refers_to_id:climb_id
        })
        
    }
}