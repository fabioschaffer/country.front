import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CountryList from './Country/CountryList';
import CountryDetail from './Country/CountryDetail';
import CountryEdit from './Country/CountryEdit';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return <React.Fragment>
    <Switch>
      <Route path="/" exact component={CountryList} />
      <Route path="/detail" exact component={CountryDetail} />
      <Route path="/edit" exact component={CountryEdit} />
      <Redirect to="/" />
    </Switch>
  </React.Fragment>;
};

export default App;