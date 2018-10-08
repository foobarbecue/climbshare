import React, { Component } from 'react'
import { Components, registerComponent } from 'meteor/vulcan:core'

const FrontPage = () =>
  <Components.CragList />



registerComponent({name:'FrontPage', component: FrontPage });
