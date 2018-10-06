# Climba: Investigate the climb scene
 
Climba is an open platform for virtual 3D climbing stuff. "Stuff" includes guides, route planning, simulations, games, and community building. "Climbing" includes indoors, outdoors, sport, trad. Probably not mountaineering, but maybe that too, someday.

## Getting started

For now, email me at <aaron@climbscene.com> for access to the testing server. We will launch it publicly once we are confident it's secure and relatively stable.
You can also run your own server. Here's how:

 1. Install [meteor](https://install.meteor.com) 
 2. Clone this repository
 3. Run `npm install`
 4. Run `npm start`
 
## Features 

 [x] Climb display
 [x] Drawing climbs on meshes and saving to database 
 [x] Crag upload
 [x] Progressive mesh display using [Nexus](https://github.com/cnr-isti-vclab/nexus)
 [ ] Routesetting and route archiving tools for climbing gyms
 [ ] Smartphone support
 [ ] Built-in SfM engine which can add photos one by one (let's use [AliceVision](https://alicevision.github.io/))
 [ ] Augmented reality
 [ ] Stick figure climber on the 3D
 [ ] Solar exposure predictor
 [ ] Rock temperature forecast


## Philosophy

Climbing is all about community, and so is software. Everyone will wants to use Climba in their own particular way, and that's why an open source, infinitely customizable platform is the way to go. People can host their own instances and use them to make money -- they can sell services to gyms or guiding services or use the tool for geological research. Who knows!? 

## Terminology

Climba (mis)uses the word *crag* in a weirdly broad sense. We have one database schema for "the thing that climbs are on" which could be a boulder, an entire climbing gym, a cliff, etc. In climba, we call all these things crags.