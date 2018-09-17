import { addRoute, Components } from 'meteor/vulcan:core'

import '../components/crags/CragItem.jsx'
import '../components/crags/CragList.jsx'
import '../components/ThreeScene.jsx'

addRoute({ name: 'crag', path: '/crag/:name', componentName: 'CragItem'});
addRoute({ name: 'craglist', path: '/', componentName: 'CragList'});
