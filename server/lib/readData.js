insertBoulder = function(boulder){
    var boulderUpsertRes = Boulders.upsert({name:boulder.name},boulder);
    for (var climbName in boulder.climbs){
        var climb=boulder.climbs[climbName];
        climb.boulder_id = boulderUpsertRes['insertedId'];
        //TODO climbName is being duplicated in a bad way here, fix it.
        var climbUpsertRes=Climbs.upsert({climbName:climbName},climb);
            Labels.upsert(
                {content:climbName},
                {content:climbName,
                position:{
                    x:climb.vertices[0][0],
                    y:climb.vertices[0][1],
                    z:climb.vertices[0][2]
                },
                refers_to_boulder:boulderUpsertRes['insertedId'],
                refers_to_id:climbUpsertRes['insertedId'],
                refers_to_type:'climb',
                createdBy:'automatic',
                createdOn:new Date()}
            )
        }
    }