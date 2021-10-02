import {el, p} from './guten-helpers.js';

const {SearchControl, Popover, Card, CardBody, CardHeader, TextControl} = wp.components;
const {useState} = wp.element;
export const PopupSearch = ({
  sessions,
  setPopoverOpen, 
  setPopoverElement,
  addSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(sessions);

  const closeSelf = () => {
    setPopoverOpen(false);
    setPopoverElement(null);
  };
  const searchLabel = el(
      'label',
      {
        for: 'insert-session-search',
      },
      'Search for Sessions to add to this time slot'
  );
  const searchBar = el(
      TextControl,
      {
        id: 'insert-session-search',
        onChange: (value) => {
          setSearchTerm(value);
          console.log(sessions);
        },
        value: searchTerm,
      }
  );
  const sorted = [...sessions].sort((a, b) => a.date - b.date);
  const filtered = sorted.filter((e) => {
    const a = e.title.raw.toLowerCase();
    const b = searchTerm.toLowerCase();
    return a.includes(b);
  });
  const numResults = 5;
  const slicedSessions = filtered.slice(0, numResults);
  const resultSessions = slicedSessions.map((session) => {
    const name = p(session.title.raw);
    return el(
        'a', 
        {
          onClick: (w) => {
            const e = w.nativeEvent;
            e.preventDefault();
            addSession(session);
            closeSelf();
          },
          href: '',
        },
        name
    );
  });
  let results = resultSessions;
  if (resultSessions.length == 0) {
    results = 'No sessions found.';
  }

  const cardBody = el(
      CardBody,
      {
        style: {
          width: '350px',
        },
      },
      [searchLabel, searchBar, results]
  );
  
  const card = el(
      Card,
      {},
      [cardBody]
  );

  return el(
      Popover,
      {
        style: {
          pointerEvents: 'visible',
        },
        position: 'bottom center',
        noArrow: false,
        onKeyDown: (e) => {
          if (e.keyCode === 27) {
            closeSelf();
          }
        }
      },
      [card]
  );
};