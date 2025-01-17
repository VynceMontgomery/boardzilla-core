import React from 'react';

import type { ResolvedSelection } from '../../../action/selection.js';
import type { Player } from '../../../player/index.js';
import type { Argument } from '../../../action/action.js';

const Selection = ({selection, value, error, onChange} : {
  selection: ResolvedSelection<Player>,
  value: Argument<Player> | undefined,
  error?: string,
  onChange: (value: Argument<Player>) => void
}) => (
  <div className={`selection ${selection.name}`}>
    {selection.prompt && selection.type !== 'button' && !selection.isBoardChoice() && <span className="prompt">{selection.prompt}</span>}

    {selection.type === 'choices' && selection.choices?.map(choice => (
      <button
        type="button"
        className={(typeof choice === 'object' && 'choice' in choice ? choice.choice : choice) === value ? 'selected' : ''}
        key={String(choice)}
        onClick={() => onChange((typeof choice === 'object' && 'choice' in choice ? choice.choice : choice))}
      >
        {String(typeof choice === 'object' && 'label' in choice ? choice.label : choice)}
      </button>
    )
    )}

    {selection.type === 'number' && (
      <input
        name={selection.name}
        type="number"
        min={selection.min ?? 1}
        max={selection.max}
        onChange={e => onChange(parseInt(e.target.value))}
        value={String(value)}
        autoComplete='off'
      />
    )}

    {selection.type === 'text' && (
      <input
        name={selection.name}
        onChange={e => onChange(e.target.value)}
        value={String(value)}
        autoComplete='off'/>
    )}

    {selection.type === 'button' &&
      <button name={selection.name} value='confirm' type="submit">{selection.prompt ?? String(selection.value)}</button>
    }

    {error && <div className="error">{error}</div>}
  </div>
);

export default Selection;
