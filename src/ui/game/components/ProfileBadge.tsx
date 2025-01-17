import React from 'react';

import { Player } from '../../../index.js';
import { gameStore } from '../../index.js';
import classNames from 'classnames';

/**
 * Component for rendering a Player's name and avatar in their color. Also
 * capture online status and displays (as `className` `"online"`) and flashes
 * when the player is the current player (`className` `"current"`).
 *
 * @category UI
 */
export function ProfileBadge({player}: {player: Player}) {
  const [userOnline] = gameStore(s => [s.userOnline, s.boardJSON]);
  const online = userOnline.has(player.id)
  return (
    <div className={classNames("profile-badge", {online, current: player.isCurrent()})} style={{backgroundColor: player.color}}>
      <div className="avatar"><img src={player.avatar} /></div>
      <div className="player-name">{player.name}</div>
    </div>
  );
}
