# Climba

Climba is an open platform for virtual 3D climbing stuff.

"Stuff" includes guides, route planning, simulations, games, and community building.

"Climbing" includes indoors, outdoors, sport, trad. Probably not mountaineering, but maybe that too, someday.

## Getting started

For now, email me at <mail@aaroncurt.is> for access to the testing server. We will launch it publicly once we are confident it's secure and relatively stable.

You can also run your own server. We'll have a guide up soon, but Climba is just a Vulcan package so if you can get [vulcan](http://vulcanjs.org) working on your system it should be pretty straightforward.


## Features

### Working now

 - Progressive mesh display using [Nexus]()
 	- Nexus is open source
 	- Nexus is better than technology used on commercial sites like Sketchfab, clara.io, etc. Because it loads based on camera location.
 - Climb display
 - Drawing climbs on meshes and saving to database

### Priorities to add
 - Crag upload
 - Routesetting and route archiving tools for climbing gyms
 - Smartphone support
 - Built-in SfM engine which can add photos one by one (let's use [AliceVision](https://alicevision.github.io/))
 - Augmented reality
 - Stick figure climber on the 3D
 - Solar exposure predictor
 - Rock temperature forecast


## Philosophy

Climbing is about community. I'm calling all the coders who climb and climbers who code -- let's put our heads together and build the premeire virtual 3D climbing platform. C'mon, it'll be fun.

There is certainly financial profit to be had in this space, and there will be competition. We all have fantasies of passive income and whatnot. My dream, right now, is to start a collaborative community working on an infinitely flexible tool for all sorts of 3D climbing informatics and games. I has so much fun hacking on the ArduPilot project in the early days and I'd like to experience that sort of thing again.

Everyone will wants to use Climba in their own particular way, and that's why an open source, infinitely customizable platform is the way to go. People can host their own instances and use them to make money -- they can sell services to gyms or guiding services or use the tool for geological research. Who knows!?

## Terminology
- Climba uses the word *crag* in a weirdly broad sense. We have one database schema for "the thing that climbs are on" which could be a boulder, an entire climbing gym, a cliff, etc. In climba, we call all these things crags.