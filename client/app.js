import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

class FeedReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      subs: [],
      items: [],
      meta: {}
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.getSubs = this.getSubs.bind(this);
    this.updateSubs = this.updateSubs.bind(this);

    this.addFeed = this.addFeed.bind(this);

    this.subscribe = this.subscribe.bind(this);
    this.delete = this.delete.bind(this);

    this.displayFeed = this.displayFeed.bind(this);
  }

  login(username, password) {
    $.post("/api/auth/login", { username: username, password: password })
    .then(res => {
      if (res.ok) {
        this.setState({ user: res.data });
        return res.data;
      } else {
        console.log(res.error);
      }
    })
    .then(user => {
      this.getSubs();
    }) 
    .catch(err => console.log(err));
  }

  logout() {
    $.get("/api/auth/logout")
    .then(res => {
      if (res.ok) {
        this.setState({ user: {} });
      } else {
        console.log(res.error);
      }
    })
    .then(user => {
      this.getSubs();
    }) 
    .catch(err => console.log(err));
  }

  getSubs() {
    $.get("/api/subs/")
    .then(res => {
      if (res.ok) {
        this.setState({ subs: res.data });
      } else {
        console.log(res.error);
      }
    })
    .catch(err => console.log(err));
  }

  updateSubs() {
    $.post("/api/subs/", {subs: this.state.subs})
    .then(res => {
      if (res.ok) {
        console.log("subs saved!");
      } else {
        console.log(res.error);
      }
    })
    .catch(err => console.log(err));
  }

  addFeed(name, rss, image) {
    return new Promise((resolve, reject) => {
      $.post("/api/feed/", { name, rss, image })
      .then(res => {
        if (res.ok)
          resolve(res.data);
        else
          reject(res.error);
      })
    })
    
  }

  subscribe(feedUrl) {
    this.parseFeed(feedUrl)
    .then(feed => {
      console.log(feed);
      let meta = feed.meta;
      return this.addFeed(meta.title, feedUrl, meta.image)
    })
    .then(feed => {
      this.state.subs.push({ name:feed.name, rss: feed.rss });
      this.setState({subs: this.state.subs});
      this.updateSubs();  
    })

    
    //localStorage.setItem('danwei_feedReaderSubs', JSON.stringify(subscriptions));
  }

  delete(i) {
    this.state.subs.splice(i, 1);
    this.setState({subs: this.state.subs});
    this.updateSubs();
    //localStorage.setItem('danwei_feedReaderSubs', JSON.stringify(subscriptions));
  }

  parseFeed(feedUrl) {
    return new Promise((resolve, reject) => {
      $.get("/parsefeed/?feedUrl=" + feedUrl)
      .done((res) => {
        if (res.ok)
          resolve(res.data);
      });
    })
  }

  displayFeed(url) {
    this.parseFeed(url)
    .then(feed => this.setState({items: feed.items, meta: feed.meta}));
  }

  componentDidMount() {
    $.get("/api/auth/logged-in-user")
    .then((res) => {
      if (res.ok) {
        this.setState({user: res.data});
        return res.data;
      }
      return;
    })
    .then(user => this.getSubs());

    //this.setState({subs: subscriptions});
  }

  render() {
    const { subs, items, meta, user } = this.state;

    return (
      <div className="feedReader">
        <LoginBox
          loggedIn = {user}
          handleLogin = {(username, password) => this.login(username, password)}
          handleLogout = {() => this.logout()}
        />
        <SubscriptionBox
          subs={subs}
          handleSelect={(url) => this.displayFeed(url)}
          handleAdd={(name, url) => this.subscribe(url)}
          handleDelete={(i) => this.delete(i)}
        />
        
        <FeedItems
          meta={meta}
          items={items}
        />
      </div>
    );
  }
}


const SubscriptionBox = ({ subs, handleSelect, handleAdd, handleDelete }) => {
  var subscriptionNodes = subs.map( (sub, i) =>
    <li key={sub.rss} className="subItem">
        <i className="material-icons mdl-list__item-icon">person</i>
        <a href='#' onClick={() => handleSelect(sub.rss)}>{sub.name}</a>
        <a style={{float: 'right'}} href="#" onClick={() => handleDelete(i)}><i className="material-icons mdl-list__item-icon">delete</i></a>
    </li>
  );

  return (
    <div className="subscriptionBox">
      <ul className="subList">
        {subscriptionNodes}
      </ul>

      <SubscribeInput
        handleAdd={handleAdd}
      />
        
    </div>
  );
}


const SubscribeInput = ({ handleAdd }) => {
  var name, rss;

  var addClick = () => {
    handleAdd(name.value, rss.value);
    name.value = rss.value = '';
  }

  return (
    <div className="subscribeInput">
      <input className="mdl-textfield__input" type="text" placeholder="Feed Title"
        ref={(c) => name = c}
      />
      <input className="mdl-textfield__input" type="text" placeholder="Feed URL"
        ref={(c) => rss = c}
        onKeyPress={(e) => {if (e.key === 'Enter') addClick() } } 
      />
      <button onClick={() => addClick()}>
        <i className="material-icons">add</i>
      </button>
    </div>
  );
}


const LoginBox = ({ loggedIn, handleLogin, handleLogout }) => {
  var username, password;

  var loginForm = 
    <div className="loginForm">
      <input type="text" placeholder="Username" ref={(c) => username = c} />
      <input type="password" placeholder="Password" ref={(c) => password = c} />
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


const FeedItems = ({ meta, items }) => {
  var itemNodes = items.map((item, i) => {
    return (
      <FeedItem key={item.guid}
        item={item}
      />
    );
  });

  return (
    <div className="feedItems">
      <div className="feedTitle">{meta.title}</div>
        {itemNodes}
    </div>
  )
}


const FeedItem = ({ item }) => {

  var itemImg = item.image || 'https://getmdl.io/assets/demos/welcome_card.jpg';

  var description = $('<div/>').html(item.description).text();

  return (
    <a href={item.link} target="_blank">
      <div className="feedItem mdl-card mdl-shadow--2dp">
        <div className="titlePicture" style={{backgroundImage: 'url(' +itemImg+ ')'}}>
        </div>
        <div className="mdl-card__supporting-text">
          <div className="titleText">
           {item.title}
          </div>
          <div className="description">
            {description}
          </div>
        </div>
      </div>
    </a>
  );
}


ReactDOM.render(<FeedReader />, document.getElementById('content'));