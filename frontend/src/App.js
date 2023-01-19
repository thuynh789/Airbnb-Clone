import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import OneSpot from "./components/OneSpot";
import AddSpotModal from "./components/AddSpotModal";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>

          <Route path='/spots/:spotId'>
            <OneSpot />
          </Route>

          <Route exact path='/'>
            <AllSpots />
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
