import { addRoute, Components } from 'meteor/vulcan:core'

import '../components/common/Layout.jsx'
import '../components/climbs/ClimbDetails.jsx'
import '../components/crags/CragDisp.jsx'
import '../components/crags/CragList.jsx'
import '../components/crags/CragMenu.jsx'
import '../components/climbs/ClimbItem.jsx'
import '../components/climbs/ClimbList.jsx'
import '../components/climbs/ClimbsNewForm.jsx'
import '../components/climbs/ClimbsEditForm.jsx'
import '../components/common/Toolbox.jsx'
import '../components/common/Instructions.jsx'
import '../components/climbs/ClimbsDisp.jsx'
import '../components/common/ThreeScene.jsx'
import '../components/common/FrontPage.jsx'
import '../components/common/PrivacyPage.jsx'

import '../components/crags/CragFileDisp.jsx'
import '../components/crags/CragUpload.jsx'
import '../components/crags/CragsNewForm.jsx'

addRoute({ name: 'privacy', path: '/privacy', componentName: 'PrivacyPage'});
addRoute({ name: 'climbs', path: '/climbs/', componentName: 'ClimbList'});
addRoute({ name: 'crag', path: '/crag/:_id', componentName: 'CragDispAnnoyingWrapper'});
addRoute({ name: 'index', path: '/', componentName: 'CragList'});
addRoute({ name: 'climbsNew', path: '/climbs/new', componentName: 'ClimbsNewForm'});
addRoute({ name: 'cragUpload', path: '/cragupload', componentName: 'CragUpload'});
