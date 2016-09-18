import React from 'react';
import ReactDOM from 'react-dom';
import normalizeUrl from 'normalize-url';

import './styles.css';

import api from './api';

class FeedReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      subs: [],
      subEditMode: false,
      sources: [],
      sourcesMode: false,
      feed: {}
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.getSubs = this.getSubs.bind(this);
    this.addSub = this.addSub.bind(this);
    this.deleteSub = this.deleteSub.bind(this);
    this.updateSubs = this.updateSubs.bind(this);
    this.swapSubs = this.swapSubs.bind(this);

    this.getSources = this.getSources.bind(this);
    this.displaySources = this.displaySources.bind(this);
    this.syncSourcesAndSubs = this.syncSourcesAndSubs.bind(this);

    this.subscribe = this.subscribe.bind(this);
    this.subscribeByUrl = this.subscribeByUrl.bind(this);

    this.displayFeed = this.displayFeed.bind(this);
  }

  login(username, password) {
    api.login_post(username, password)
    .then(user => {
      this.setState({ user: user });
      this.getSubs();
    })
    .catch(err => console.log(err));
  }

  logout() {
    api.logout_get()
    .then(() => {
      this.setState({ user: {} });
    })
    .catch(err => console.log(err));
  }

  getSubs() {
    api.subs_get()
    .then(subs => this.syncSourcesAndSubs(subs, false))
    .catch(err => console.log(err));
  }

  addSub(source) {
    let { name, rss, image } = source;
    this.state.subs.push({ name, rss, image });
    this.updateSubs(this.state.subs);
  }

  deleteSub(i) {
    this.state.subs.splice(i, 1);
    this.updateSubs(this.state.subs);
  }

  updateSubs(subs) {
    this.syncSourcesAndSubs(subs, false);
    api.subs_post(subs)
    .then(() => console.log("subs saved!"))
    .catch(err => console.log(err));
  }

  swapSubs(i, j) {
    var subs = this.state.subs;
    var drag = subs.splice(i, 1);
    var tail = subs.splice(j);
    subs = subs.concat(drag, tail);
    this.updateSubs(subs);
  }

  getSources() {
    api.source_list()
    .then(sources => this.syncSourcesAndSubs(sources, true))
    .catch(err => console.log(err));
  }

  displaySources() {
    this.setState({ sourcesMode: true });
    this.getSources();
  }

  /**
    use this to update the state of either sources and subs, so that the state of which sources are subscribed to is always current
  **/
  syncSourcesAndSubs(newState, isSources) {
    var sources, subs = null;
    if (isSources) {
      sources = newState;
      subs = this.state.subs;
    } else {
      sources = this.state.sources;
      subs = newState;
      this.setState({ subs: subs });
    }
    for (var i=0; i<sources.length; i++) {
      let s = sources[i];
      s.added = subs.findIndex((e, i, a) => {return e.rss === s.rss}) !== -1;
    }
    this.setState({ sources: sources });
  }

  subscribe(rss) {
    api.source_get(rss)
    .then(source => {
      this.addSub(source);
    })
    .catch(err => console.log(err));
  }

  /**
    0. If the RSS source already exists in the user's subs, display it and return.
    1. Search the feed database for a source with the same RSS url.
    2a. If found, hold the source.
    2b. If not found, parse the url for metadata, then add it to the feed database.
    3. Add the source to the user's list of subscriptions.
    4. Parse the url to retrieve feed items.
  **/
  subscribeByUrl(feedUrl) {
    feedUrl = normalizeUrl(feedUrl);

    let find = this.state.subs.findIndex((e, i, a) => {
      return e.rss === feedUrl;
    });
    if (find !== -1) {
      this.displayFeed(feedUrl);
      return;
    }

    api.source_get(feedUrl)
    .then(source => {
      if (source) return Promise.all([false, source]);
      else return Promise.all([true, api.feedMeta_get(feedUrl)]);
    })
    .then(r => {
      if (r[0]) {
        return api.source_post(r[1]); 
      }
      else return r[1]; 
    })
    .then(source => {
      
      this.addSub(source);
      return source;
    })
    .then(source => this.displayFeed(source.rss))
    .catch(err => console.log(err));
  }

  displayFeed(url) {
    api.parseFeed_get(url)
    .then(feed => this.setState({ sourcesMode: false, feed: feed }))
    .catch(err => console.log(err));
  }


  componentDidMount() {
    this.displaySources();

    api.loggedInUser_get()
    .then(user => {
      if (user) this.setState({user: user});
      return;
    })
    .then(() => this.getSubs());
  }

  render() {
    const { user, subs, subEditMode, sources, sourcesMode, feed } = this.state;

    var feedOrSourcesButton = sourcesMode ?
      <a href="#" onClick={() => this.setState({ sourcesMode: false })}>Back To Newsfeed</a> :
      <a href="#" onClick={() => this.displaySources()}>Show Sources</a>;

    var feedOrSources = sourcesMode ?
      <Sources
        sources={sources}
        handleSubscribe={(rss) => this.subscribe(rss)}
      /> :
      <FeedItems
        feed={feed}
      />;

    return (
      <div className="feedReader">
        <div className="sidebar">
          <Subscriptions
            subs={subs}
            editMode={subEditMode}
            handleEditMode={() => this.setState({ subEditMode: !subEditMode })}
            handleDrop={(i, j) => this.swapSubs(i, j)}
            handleSelect={(url) => this.displayFeed(url)}
            handleDelete={(i) => this.deleteSub(i)}
          />
          <div>
            {feedOrSourcesButton}
          </div>
          <SubscribeInput
            handleSubscribe={(url) => this.subscribeByUrl(url)}
          />
          <LoginBox
            loggedIn = {user}
            handleLogin = {(username, password) => this.login(username, password)}
            handleLogout = {() => this.logout()}
          />
        </div>

        <div className="mainArea">
          {feedOrSources}
        </div>
      </div>
    );
  }
}


const Subscriptions = ({ subs, editMode, handleEditMode, handleDrag, handleDrop, handleSelect, handleDelete }) => {
  /* 
    http://www.html5rocks.com/en/tutorials/dnd/basics I modified the parts where HTML is transferred to fire events to rearrange the subscription array instead, so we don't have to deal with any child HTML messes
  */
  var dragged = null; // tracks the index of the sub that was dragged. When it is dropped onto a sub, it is sent together with the index of that sub

  // enable drag-and-drop only in edit mode
  var itemProps = editMode ?
    {
      draggable: true,
      onDragEnter: (e) => e.target.classList.add('dragOver'),
      onDragLeave: (e) => e.target.classList.remove('dragOver'),
      onDragOver: (e) => e.preventDefault(), 
      onDragEnd: (e) => e.target.classList.remove('drag')
    } : null;
  var editIcon = editMode ? "check" : "mode_edit";

  var subscriptionNodes = subs.map((sub, i) => {
    var nameText = editMode ?
      sub.name :
      <a href='#' onClick={() => handleSelect(sub.rss)}>{sub.name}</a>;

    var deleteIcon = editMode ? 
      <a href="#" className="sidebarRightIcon" onClick={() => handleDelete(i)}>
        <i className="material-icons mdl-list__item-icon">delete</i>
      </a> : null;

      

      if (editMode) {
        itemProps.onDragStart = () => dragged = i;
        itemProps.onDrop = (e) => { e.target.classList.remove('dragOver'); handleDrop(dragged, i); };
      }

    return (
      <li key={sub.rss} className="subItem" 
        {...itemProps}
      >
        <span className="subWrap">
          <i className="material-icons mdl-list__item-icon">rss_feed</i>
          {nameText}
          {deleteIcon}
        </span>
      </li>
    );
  }
    
  );

  return (
    <div className="subscriptions">
      <div className="subsTitle">
        My Subscriptions
        <a href="#" className="sidebarRightIcon" onClick={() => handleEditMode()}>
          <i className="material-icons mdl-list__item-icon">{editIcon}</i>
        </a>
      </div>
      <ul className="subList">
        {subscriptionNodes}
      </ul>
    </div>
  );
}


const SubscribeInput = ({ handleSubscribe }) => {
  var rss;
  var addClick = () => {
    handleSubscribe(rss.value);
    rss.value = '';
  }

  return (
    <div className="subscribeInput">
      Subscribe by URL:
      <input className="mdl-textfield__input" type="text" placeholder="Feed URL" 
        style={{width: '85%', display: 'inline'}}
        ref={(c) => rss = c}
        onKeyPress={(e) => {if (e.key === 'Enter') addClick() } } 
      />
      <a href="#" className="sidebarRightIcon" onClick={() => addClick()}>
        <i className="material-icons">add</i>
      </a>
    </div>
  );
}


const LoginBox = ({ loggedIn, handleLogin, handleLogout }) => {
  var username, password;

  var loginForm = 
    <div className="loginForm" style={{textAlign: 'center'}}>
      <input type="text" className="mdl-textfield__input" placeholder="Username" ref={(c) => username = c} />
      <input type="password" className="mdl-textfield__input" placeholder="Password" ref={(c) => password = c} />
      <button onClick={() => handleLogin(username.value, password.value)}>Login</button>
    </div>;

  var loggedInDisplay =
    <div className = "loggedInDisplay">
      Welcome, {loggedIn.username}!
      <button onClick={() => handleLogout()}>Logout</button>
    </div>;

  var loginOrLogout = loggedIn._id ? loggedInDisplay : loginForm;

  return (
    <div className="loginBox">
      {loginOrLogout}
    </div>
  );
}

const Sources = ({ sources, handleSubscribe }) => {
  const sourceNodes = sources.map((source, i) => {
    return (
      <SourceItem key={source.rss}
        item={source}
        handleSubscribe={handleSubscribe}
      />
    );
  });

  return (
    <div className="feedItems">
      <div className="titlebar">Subscribe to more feeds</div>
      {sourceNodes}
    </div>
  );
}


const SourceItem = ({ item, handleSubscribe }) => {

  const { name, rss } = item
  const image = item.image || 'https://getmdl.io/assets/demos/welcome_card.jpg';
  const description = $('<div/>').html(item.description).text();

  var addButton = item.added ? 
    <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
      <i className="material-icons">done</i>
    </button> :
    <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick={() => handleSubscribe(rss)}>
      <i className="material-icons">add</i>
    </button>;

  return (
      <div className="sourceItem mdl-card mdl-shadow--2dp">
        <div className="sourcePicture" style={{backgroundImage: 'url(' +image+ ')'}} /> 
        <div className="mdl-card__supporting-text">
          <div className="sourceTitle">
           {name}
          </div>
          <div className="sourceDescription">
            {description}
          </div>
          <div className="actions">
              {addButton}
          </div>
        </div>
      </div>
  );
}



const FeedItems = ({ feed }) => {
  const { items, meta } = feed;

  var itemNodes = items ? items.map((item, i) => <FeedItem key={item.guid} item={item} />) : null;
  
  var titlebar = meta ?
    <div className="titlebar">
      {meta.name}
      <a className="titlebarIcon" href={meta.rss} target="_blank">
        <i className="material-icons">rss_feed</i>
      </a>
    </div> :
    null;

  return (
    <div className="feedItems">
      {titlebar}
      {itemNodes}
    </div>
  );
}


const FeedItem = ({ item }) => {

  const { title, link } = item
  const image = item.image || 'https://getmdl.io/assets/demos/welcome_card.jpg';
  const description = $('<div/>').html(item.description).text();

  return (
      <div className="feedItem mdl-card mdl-shadow--2dp">
        <a href={link} target="_blank">
          <div className="titlePicture" style={{backgroundImage: 'url(' +image+ ')'}} />
        </a>
        <div className="mdl-card__supporting-text">
          <a href={link} target="_blank">
            <div className="titleText">{title}</div>
          </a>
          <div className="description">
            {description}
          </div>
          <div className="actions">
            <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
              <i className="material-icons">add</i>
            </button>
          </div>
        </div>
      </div>
  );
}


ReactDOM.render(<FeedReader />, document.getElementById('content'));