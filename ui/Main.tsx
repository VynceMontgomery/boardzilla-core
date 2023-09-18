import React, { useState, useEffect, useCallback } from 'react';
import { gameStore } from './';
import Game from './game/Game';
import Setup from './setup/Setup';
import { serializeArg } from '../game/action/utils';

import type {
  User,
  SetupState,
  UpdateEvent,
  UserEvent,
  MessageProcessed,
  SetupUpdated,
  ReadyMessage,
  StartMessage,
  MoveMessage,
} from './types';
import type { Player } from '../game/player';
import type { Move } from '../game/action/types';

export default () => {
  const [game, updateBoard] = gameStore(s => [s.game, s.updateBoard]);
  const [setupState, setSetupState] = useState<SetupState>({players: [], settings: []});
  const [phase, setPhase] = useState('new');
  const [users, setUsers] = useState<User[]>([]);
  const [readySent, setReadySent] = useState<boolean>(false);

  const listener = useCallback((event: any) => {
    const data = JSON.parse(event.data);
    console.log('message', event, data);
    switch(data.type) {
    case 'update':
      console.log('update');
      if (data.phase === 'new') {
        setSetupState(data.state);
      } else {
        game.setState(data.state);
        updateBoard();
        setPhase('started');
      }
      break;
    case 'user':
      const { id, name } = data;
      if (data.added) {
        setUsers(users => {
          if (users.find(p => p.id === id)) return users
          return [...users, { id, name }]
        });
      } else {
        setUsers((users) => users.filter(p => p.id !== id))
      }
      break;
    }
  }, [game]);

  useEffect(() => {
    window.addEventListener('message', listener, false)
    console.log('ready', readySent);
    const message: ReadyMessage = {type: "ready"};
    if (!readySent) {
      window.top!.postMessage(message, "*");
      setReadySent(true);
    }
    return () => window.removeEventListener('message', listener)
  }, [listener])

  const move = (move: Move<Player>) => {
    const message: MoveMessage = {
      type: "move",
      id: "todo",
      data: [move.action, ...move.args.map(serializeArg)]
    };
    window.top!.postMessage(message, "*");
  };

  const update = (setupState: SetupState) => {
    console.log('update setupState', setupState);
    setSetupState(setupState);
    const message: SetupUpdated = {type: "setupUpdated", data: setupState};
    window.top!.postMessage(message, "*");
  }

  const start = () => {
    console.log('start');
    const message: StartMessage = {type: "start", id: 'todo', setup: setupState};
    window.top!.postMessage(message, "*");
  }

  console.log('RENDER MAIN', phase);

  return phase === 'new' ?
    <Setup users={users} setupState={setupState} onUpdate={update} onStart={start}/> :
    <Game onMove={move}/>
}
