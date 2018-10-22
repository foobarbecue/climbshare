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
      <div className={"site-header"}>
        {'CLIMBA'.split("").map((letter)=>
          <h1 key={letter}>{letter}</h1>
        )}
      </div>

      <Components.FlashMessages />
      {children}

    </div>
  </div>;

replaceComponent('Layout', Layout);
