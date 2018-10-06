import React, { Component } from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const PrivacyPage = () =>
  <p>
    Climba's privacy policy is to take good care of your data and not do
    anything shady with it. We don't sell it or give it to anyone else. We
    don't store any passwords, just hashes.
  </p>;

registerComponent('PrivacyPage',PrivacyPage);
