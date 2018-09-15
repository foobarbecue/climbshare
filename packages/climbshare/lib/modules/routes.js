import { addRoute, Components } from 'meteor/vulcan:core'

import '../components/crags/CragItem.jsx'

addRoute({ name: 'crags', path: '/', componentName: 'CragItem'});
