import { addRoute, Components } from 'meteor/vulcan:core'

import '../components/crags/CragItem.jsx'
import '../components/crags/CragMenu.jsx'
import '../components/common/ThreeScene.jsx'
import '../components/common/FrontPage.jsx'

// addRoute({ name: 'crags', path: '/crags/', componentName: 'CragMenu'});
addRoute({ name: 'crag', path: '/crag/:_id', componentName: 'CragItem'});
// addRoute({ name: 'index', path: '/', componentName: 'CragItem'});
// addRoute({ name: 'colorcube', path: '/:color', componentName: 'ThreeScene'});
addRoute({ name: 'index', path: '/', componentName: 'FrontPage'});
