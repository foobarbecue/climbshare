import Helmet from "react-helmet";
import React from "react";
import { Components, replaceComponent } from "meteor/vulcan:core"

const Layout = ({children}) =>
  <div className="wrapper" id="wrapper">
    <Helmet>
      <title>Climba</title>
      <link name="bootstrap" rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css"/>
    </Helmet>
    <Components.AccountsLoginForm />
    <div className="main">
      {children}

    </div>
  </div>;

replaceComponent('Layout', Layout);
