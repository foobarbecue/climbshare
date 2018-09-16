import { addRoute, Components } from 'meteor/vulcan:core'

import '../components/crags/CragItem.jsx'
import '../components/ThreeScene.jsx'

addRoute({ name: 'crags', path: '/crags', componentName: 'CragItem'});
addRoute({ name: 'threescene', path: '/', componentName: 'ThreeScene'});
