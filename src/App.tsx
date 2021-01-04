import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { INavLinkGroup, Nav, Stack } from '@fluentui/react';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import { SetQuestion } from './components/set-question';
import { Questions } from './components/questions';
import firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { QuestionService } from './models/question';

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: '出題',
        url: '/set-question',
        key: '/set-question'
      },
      {
        name: '問題',
        url: '/questions',
        key: '/questions'
      }
    ]
  }
]

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
}

function App() {
  const location = useLocation();
  const [user, setUser] = useState<firebase.User | null>(null);
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);
  const service = useMemo(() => {
    if (user) {
      return new QuestionService(user.uid);
    }
    else {
      return undefined;
    }

  }, [user])
  useEffect(() => {
    const f = async () => {
      await service?.load()
    };
    f()
  }, [user, service])

  if (!service || !user) {
    return (
      <div>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <Stack horizontal>
      <Stack.Item>
        <Nav
          groups={navLinkGroups}
          selectedKey={location.pathname}
        />
      </Stack.Item>
      <Stack.Item grow>
        <Switch>
          <Route exact path='/set-question' render={() => <SetQuestion service={service} />} />
          <Route exact path='/questions' render={() => <Questions service={service}/>} />
          <Route render={() => <Redirect to='/set-question' />} />
        </Switch>
      </Stack.Item>

    </Stack>
  );
}

export default App;
