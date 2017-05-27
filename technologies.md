# Technologies considered
## Webgl & mesh format
### Three.js
Used this for the first iteration of Climbshare. Great but lacks geospatial awareness, and progressive mesh delivery.

### OpenCTM
Compressed mesh technology which works with three.js and delivers the best compression for meshes I've been able to find. Unfortunately development seems to have ended. I ran into a problem with seams between UV islands but figured out a workaround.

### Cesium.js
I almost switched to Cesium because their 3D tiles massive mesh delivery looks pretty good (b3dm / glb / glTF). Then I figured out that the only converter available for 3d tiles is going to be paid and the results hosted on cesium.com.

### Nexus
Looks promising: https://github.com/cnr-isti-vclab/nexus

## Web framework
