import {el, p} from './guten-helpers.js';
import { iconText } from './ui-wrappers.js';

const {Popover, Card, CardBody, CardHeader, TextControl, Button} = wp.components;
const {useState, useEffect} = wp.element;


export const PopupSearch = ({
  sessions,
  setPopoverOpen, 
  setPopoverElement,
  addSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inject, setInject] = useState();
  useEffect(() => {
    if (scriptData) {
      setInject(scriptData);
      console.log(scriptData);
    }
  }, [scriptData]);
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
    results = ['No sessions found.'];
  }
  
  let createNew = null;
  if (inject && searchTerm != '') {
    createNew = el(
        Button,
        {
          onClick: (w) => {
            const e = w.nativeEvent;
            e.preventDefault();
            const postData = {
              title: searchTerm,
              status: "publish",
            };
            const createPost = new XMLHttpRequest();
            createPost.open("POST", inject.siteUrl + '/wp-json/wp/v2/post_sesh');
            createPost.setRequestHeader('X-WP-Nonce', inject.nonce);
            createPost.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            createPost.send(JSON.stringify(postData));
            createPost.onreadystatechange = () => {
              if (createPost.readyState == 4) {
                if (createPost.status == 201) {
                  closeSelf();
                  const res = JSON.parse(createPost.response);
                  const newId = res.id;
                  console.log(res, newId);
                } else {
                  alert('Error when trying to create a Session.');
                }
              }
            };
          },
        },
        iconText('edit', 'Create new Session titled "' + searchTerm + '"')
    );
  }

  results.push(createNew);

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