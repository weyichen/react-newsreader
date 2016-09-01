import React from 'react';
import ReactDOM from 'react-dom';

var subscriptions = [
  {name: 'BBC News', rss: 'http://feeds.bbci.co.uk/news/rss.xml'},
  {name: 'NY Times', rss: 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'},
  {name: 'CNN', rss: 'http://rss.cnn.com/rss/cnn_topstories.rss'},
  {name: 'NPR', rss: 'http://www.npr.org/rss/rss.php?id=1001'},
  {name: 'Reddit', rss: 'https://www.reddit.com/r/all/.rss'}  
];

var sampleItems = GETSAMPLES();

class FeedReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subs: [],
      items: sampleItems.items
    };

    this.parseFeed = this.parseFeed.bind(this);
  }

  parseFeed(feedUrl) {
    $.get("/parsefeed/?feedUrl=" + feedUrl
    ,(res) => {
      if (res.ok) {
        this.setState({items: res.items});    
      }
    })
  }

  componentDidMount() {
    this.setState({subs: subscriptions});
  }

  render() {
    var itemNodes = this.state.items.map((item, i) => {
      return (
        <FeedItem key={item.guid}
          item={item}
        />
      );
    });

    return (
      <div className="feedReader">
        <SubscriptionBox
          subs={this.state.subs}
          handleSelectFeed={(url) => this.parseFeed(url)}
          handleSubmit={(url) => this.parseFeed(url)}
        />

        <div className="itemCards">
          {itemNodes}
        </div>
      </div>
    );
  }
}

const SubscriptionBox = ({ subs, handleSelectFeed, handleSubmit }) => {
  var input;

  return (
    <div className="subscriptionBox">
      <div className="subs">
        {subs.map( (sub, i) =>
          <div key={i} className="sub">
            <a href='#' onClick={() => handleSelectFeed(sub.rss)}>{sub.name}</a>
          </div>
        )}
      </div>
      <div className="subscribeInput">
        <input type="text" ref={(c) => input = c} />
        <button onClick={() => handleSubmit(input.value)}>Parse Feed</button>
      </div>
    </div>
  );
}

const FeedItem = ({ item }) => {
  function openLink(url) {
    window.open(url, "_blank");
  }

  var itemImg = item.image || 'https://getmdl.io/assets/demos/welcome_card.jpg';

  var description = $('<div/>').html(item.description).text();

  return (
    <div className="feedItem mdl-card mdl-shadow--2dp"
      onClick={() => openLink(item.link)}>

      <div className="mdl-card__title" style={{backgroundImage: 'url(' +itemImg+ ')'}}>
        
      </div>
    

    <div className="mdl-card__supporting-text">
      <div className="title-text">{item.title}</div>

      <div className="description">
        {description}
      </div>

    </div>
    </div>
  );
}

ReactDOM.render(<FeedReader />, document.getElementById('content'));

function GETSAMPLES() {
  return {
ok: true,
items: [
{
guid: "http://www.nytimes.com/2016/09/01/us/politics/donald-trump-immigration-speech.html",
title: "Donald Trump Gambles on Immigration but Sends Conflicting Signals",
description: "Mr. Trump’s dual speeches in Mexico City and Phoenix were so jarring that his true vision and intentions on immigration were hard to discern.",
date: "2016-09-01T04:04:44.000Z",
link: "http://www.nytimes.com/2016/09/01/us/politics/donald-trump-immigration-speech.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/us/01trump3/01trump3-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/us/politics/donald-trump-far-from-softening-lays-out-tough-immigration-plans.html",
title: "Explaining What Donald Trump Wants to Do Now on Immigration",
description: "His proposals include ending so-called sanctuary cities, assembling a deportation task force, maintaining “zero tolerance for criminal aliens” and putting up a wall.",
date: "2016-09-01T08:21:08.000Z",
link: "http://www.nytimes.com/2016/09/02/us/politics/donald-trump-far-from-softening-lays-out-tough-immigration-plans.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/us/02POLICYweb1/02POLICYweb1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/world/americas/trump-mexico-pena-nieto-reaction.html",
title: "Mexicans Accuse President of ‘Historic Error’ in Welcoming Donald Trump",
description: "Many Mexican citizens are angry that President Enrique Peña Nieto would meet with Mr. Trump, let alone extend him an invitation.",
date: "2016-09-01T00:48:42.000Z",
link: "http://www.nytimes.com/2016/09/01/world/americas/trump-mexico-pena-nieto-reaction.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/world/01mexico-web/01mexico-web-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/us/politics/trump-campaign.html",
title: "News Analysis: Trailing Hillary Clinton, Donald Trump Turns to Political Gymnastics",
description: "Mr. Trump is trying to avoid discussion of his former campaign pledges without renouncing them, and to make conciliatory gestures without withdrawing offensive remarks.",
date: "2016-09-01T04:37:24.000Z",
link: "http://www.nytimes.com/2016/09/01/us/politics/trump-campaign.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/us/01ASSESSweb2/01ASSESSweb2-moth.jpg"
},
{
guid: "http://www.nytimes.com/video/us/100000004622115/trump-mexico-wall-phoenix.html",
title: "Watch: ‘We Will Build a Great Wall’",
description: "After a more restrained appearance with President Enrique Peña Nieto of Mexico earlier in the day, Donald J. Trump returned to Phoenix to emphasize his uncompromising stance on immigration.",
date: "2016-09-01T10:00:51.000Z",
link: "http://www.nytimes.com/video/us/100000004622115/trump-mexico-wall-phoenix.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
},
{
guid: "http://www.nytimes.com/2016/09/02/us/us-mexico-border-wall-tunnels.html",
title: "As Donald Trump Calls for Wall on Mexican Border, Smugglers Dig Tunnels",
description: "Fences along the frontier have only helped push smugglers underground, and experts say it may be years before the technology exists to reliably detect the tunnels.",
date: "2016-09-01T16:34:09.000Z",
link: "http://www.nytimes.com/2016/09/02/us/us-mexico-border-wall-tunnels.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/us/02tunnel1/02tunnel1-moth-v2.jpg"
},
{
guid: "http://www.nytimes.com/video/us/100000004622903/tunneling-under-the-border-with-mexico.html",
title: "Tunneling Under the Border With Mexico",
description: "On the U.S.-Mexico border, a large fence has done little to deter enterprising drug smugglers. In Nogales, Ariz., they’ve been digging out tunnels for years in order to cross the border undetected.",
date: "2016-09-01T15:55:21.000Z",
link: "http://www.nytimes.com/video/us/100000004622903/tunneling-under-the-border-with-mexico.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
},
{
guid: "http://www.nytimes.com/2016/09/02/business/economy/if-trump-gets-his-way-real-estate-will-get-even-more-tax-breaks.html",
title: "Common Sense: If Trump Gets His Way, Real Estate Will Get Even More Tax Breaks",
description: "A proposal to shave the tax rate on business income would also help out hedge funds and private equity shops.",
date: "2016-09-01T15:01:20.000Z",
link: "http://www.nytimes.com/2016/09/02/business/economy/if-trump-gets-his-way-real-estate-will-get-even-more-tax-breaks.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/business/02STEWARTsub1/02STEWARTsub1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/world/europe/wikileaks-julian-assange-russia.html",
title: "How Russia Often Benefits When Julian Assange Reveals the West’s Secrets",
description: "American officials say Mr. Assange and WikiLeaks probably have no direct ties to Russian intelligence services. But the agendas of WikiLeaks and the Kremlin have often dovetailed.",
date: "2016-08-31T22:15:42.000Z",
link: "http://www.nytimes.com/2016/09/01/world/europe/wikileaks-julian-assange-russia.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/08/30/world/asssange-web1/asssange-web1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/us/politics/dnc-hack-russia.html",
title: "Trying to Smoke Out the Players in the Hacking of the D.N.C.",
description: "A tangle of questions about what might connect Guccifer, the Russians, WikiLeaks and the Democratic National Committee.",
date: "2016-08-31T22:13:56.000Z",
link: "http://www.nytimes.com/2016/09/01/us/politics/dnc-hack-russia.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/08/31/world/assange-sidebar1/assange-sidebar1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/briefing/donald-trump-dilma-rousseff-florida.html",
title: "Donald Trump, Dilma Rousseff, Florida: Your Thursday Briefing",
description: "Here’s what you need to know to start your day.",
date: "2016-09-01T14:04:27.000Z",
link: "http://www.nytimes.com/2016/09/01/briefing/donald-trump-dilma-rousseff-florida.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/world/01NYTNow-Hermine1/01NYTNow-Hermine1-moth-v2.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/nyregion/new-york-today-best-murals-nyc-street-art-cicadas.html",
title: "New York Today: New York Today: Wonders on Our Walls",
description: "Thursday: Must-see murals, a unicycle festival and cicadas in the city.",
date: "2016-09-01T14:56:29.000Z",
link: "http://www.nytimes.com/2016/09/01/nyregion/new-york-today-best-murals-nyc-street-art-cicadas.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/nyregion/1NYTODAY1/1NYTODAY1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/us/slaves-georgetown-university.html",
title: "Georgetown University Plans Steps to Atone for Slave Past",
description: "The school, which in 1838 sold 272 slaves, plans to award preferential status in the admissions process to descendants of slaves, among other moves.",
date: "2016-09-01T12:00:02.000Z",
link: "http://www.nytimes.com/2016/09/02/us/slaves-georgetown-university.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/04/14/us/00georgetown1/00georgetown1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/science/spacex-rocket-explosion.html",
title: "SpaceX Rocket Explodes at Launchpad in Cape Canaveral",
description: "The fiery blast also destroyed a satellite that Facebook had planned to use to expand internet services in Africa.",
date: "2016-09-01T18:10:49.000Z",
link: "http://www.nytimes.com/2016/09/02/science/spacex-rocket-explosion.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
},
{
guid: "http://www.nytimes.com/2016/09/01/technology/a-silicon-valley-dream-collapses-in-allegations-of-fraud.html",
title: "A Silicon Valley Dream Collapses in Allegations of Fraud",
description: "The disintegration of WrkRiot has gripped Silicon Valley, though it is a familiar tale to many who arrive with the dream of creating the next tech juggernaut.",
date: "2016-09-01T00:12:13.000Z",
link: "http://www.nytimes.com/2016/09/01/technology/a-silicon-valley-dream-collapses-in-allegations-of-fraud.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/business/01STARTUPsub/01STARTUPsub-moth.jpg"
},
{
guid: "http://www.nytimes.com/crosswords/game/mini",
title: "Your Daily Mini Crossword",
description: "Solve a bite-size crossword in just a few minutes.",
date: "2016-02-25T07:18:20.000Z",
link: "http://www.nytimes.com/crosswords/game/mini?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
},
{
guid: "http://www.nytimes.com/2015/08/04/fashion/dan-buettner-longevity-tips-blue-zones-solution.html",
title: "12 Tips for Living a Longer Life",
description: "You don’t have to eat a dinner cooked by Dan Buettner, the author of “The Blue Zones Solution,” to incorporate his advice into your life: a life that will hopefully be longer after reading this.",
date: "2015-08-04T13:34:26.000Z",
link: "http://www.nytimes.com/2015/08/04/fashion/dan-buettner-longevity-tips-blue-zones-solution.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/08/31/nytnow/xxsmarteryoga/xxsmarteryoga-moth.jpg"
},
{
guid: "http://well.blogs.nytimes.com/2015/11/17/ask-well-eye-twitches/",
title: "Well: Ask Well: Eye Twitches",
description: "A reader asks, what causes eye twitches?",
date: "2016-09-01T14:14:43.000Z",
link: "http://well.blogs.nytimes.com/2015/11/17/ask-well-eye-twitches/?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2015/11/17/health/well_eye/well_eye-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/us/st-georges-school-sex-ause.html",
title: "‘Private Hell’: Prep School Sex Abuse Inquiry Paints Grim Picture",
description: "An investigation commissioned by St. George’s School in Rhode Island found that at least 51 students were abused by staff members in the 70s and 80s.",
date: "2016-09-01T16:58:30.000Z",
link: "http://www.nytimes.com/2016/09/02/us/st-georges-school-sex-ause.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/us/02stgeorges/02stgeorges-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/world/middleeast/as-trump-vs-clinton-captivates-world-netanyahu-is-unusually-silent.html",
title: "Memo from Jerusalem: As Trump vs. Clinton Captivates World, Netanyahu Is Unusually Silent",
description: "Four years after he was accused of meddling in the American election, Prime Minister Benjamin Netanyahu of Israel is being careful not to take sides.",
date: "2016-09-01T17:37:26.000Z",
link: "http://www.nytimes.com/2016/09/02/world/middleeast/as-trump-vs-clinton-captivates-world-netanyahu-is-unusually-silent.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/world/02israel1/02israel1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/world/europe/britain-brexit-eu.html",
title: "2 Months After ‘Brexit’ Vote, Britain’s Push to Leave E.U. Is a Muddle",
description: "Between turf wars and competing interests, the government is having trouble devising a coherent plan for ending four decades of integration with Europe.",
date: "2016-08-31T14:01:13.000Z",
link: "http://www.nytimes.com/2016/09/01/world/europe/britain-brexit-eu.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
},
{
guid: "http://www.nytimes.com/2016/09/04/sports/olympics/paralympics-tatyana-mcfadden-wheelchair.html",
title: "A Paralympian Races to Remove Obstacles for the Next Generation",
description: "Tatyana McFadden, who with her mother has fought for students with disabilities to participate in sports, could leave the Rio Paralympics with seven gold medals.",
date: "2016-09-01T09:00:49.000Z",
link: "http://www.nytimes.com/2016/09/04/sports/olympics/paralympics-tatyana-mcfadden-wheelchair.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/08/31/sports/04MCFADDEN1/04MCFADDEN1-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/world/americas/brazil-economy-michel-temer.html",
title: "With Impeachment Over, Brazil’s Next Challenge Is Its Flailing Economy",
description: "The new president, Michel Temer, must navigate his own controversies and a quarrelsome Congress to lead Latin America’s largest nation out of a deepening fiscal crisis.",
date: "2016-09-01T09:00:26.000Z",
link: "http://www.nytimes.com/2016/09/02/world/americas/brazil-economy-michel-temer.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
},
{
guid: "http://www.nytimes.com/2016/09/02/public-editor/anthony-weiner-huma-abedin-hillary-clinton-liz-spayd-new-york-times-public-editor.html",
title: "The Public Editor: Getting Burned by a Hot Story",
description: "The Times jumped right onto the Anthony Weiner-Huma Abedin separation story. Then it stumbled.",
date: "2016-09-01T16:35:32.000Z",
link: "http://www.nytimes.com/2016/09/02/public-editor/anthony-weiner-huma-abedin-hillary-clinton-liz-spayd-new-york-times-public-editor.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/opinion/02pubedWeb/02pubedWeb-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/us/chicago-august-homicides.html",
title: "Chicago Has Its Deadliest Month in About Two Decades",
description: "By midnight on Wednesday, 90 murders had occurred in August, as the city has experienced more homicides this year than Los Angeles and New York combined.",
date: "2016-09-01T10:12:59.000Z",
link: "http://www.nytimes.com/2016/09/02/us/chicago-august-homicides.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/us/02chicago/02chicago-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/world/middleeast/cluster-bombs-syria-yemen.html",
title: "Report Finds Ban Hasn’t Halted Use of Cluster Bombs in Syria or Yemen",
description: "Most of the world’s countries have signed a treaty banning the munitions, but not the United States and Russia, where many such bombs were made.",
date: "2016-09-01T08:00:14.000Z",
link: "http://www.nytimes.com/2016/09/02/world/middleeast/cluster-bombs-syria-yemen.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/world/01munitions/01munitions-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/technology/apple-tax-ireland-tim-cook.html",
title: "Tim Cook, Apple Chief, Defends Tax Practices and Says Cash Will Return to U.S.",
description: "The company’s chief executive said in an interview with an Irish broadcaster that the European Union’s tax decision was “maddening” and politically motivated.",
date: "2016-09-01T10:48:37.000Z",
link: "http://www.nytimes.com/2016/09/02/technology/apple-tax-ireland-tim-cook.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/business/02appletax/02appletax-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/02/technology/artificial-intelligence-ethics.html",
title: "How Tech Giants Are Devising Real Ethics for Artificial Intelligence",
description: "Four people involved in the creation of an industry partnership say its intent will be clear: to ensure that A.I. research is focused on things that will benefit people, not hurt them.",
date: "2016-09-01T07:01:01.000Z",
link: "http://www.nytimes.com/2016/09/02/technology/artificial-intelligence-ethics.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/02/business/02artificial1/02artificial1-moth-v2.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/us/phoenix-weather-forecaster-seeks-viewers-help-saying-its-hot.html",
title: "On the Ground: The Curse of a Phoenix Weatherman: Finding New Ways to Say ‘It’s Hot’",
description: "Night after night in the summer, this meteorologist must deliver the same news to his television viewers: It’s really, really hot out there.",
date: "2016-09-01T09:45:13.000Z",
link: "http://www.nytimes.com/2016/09/01/us/phoenix-weather-forecaster-seeks-viewers-help-saying-its-hot.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/08/19/us/00otg-arizonaweather/00otg-arizonaweather-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/fashion/berluti-haider-ackermann-creative-director.html",
title: "On the Runway: Haider Ackermann Named Creative Director of Berluti",
description: "Expect more disruption in the men’s wear world as the designer known for his high romance enters the big leagues.",
date: "2016-09-01T05:00:01.000Z",
link: "http://www.nytimes.com/2016/09/01/fashion/berluti-haider-ackermann-creative-director.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/fashion/01OTRSUB/01OTRSUB-moth-v2.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/business/smallbusiness/preserving-a-lifetime-of-memories-for-posterity-and-profit.html",
title: "Have a Story to Tell? Your Personal Memoirist Is Here",
description: "Personal historians make a business of helping people chronicle the events of their lives in memoirs.",
date: "2016-09-01T08:01:02.000Z",
link: "http://www.nytimes.com/2016/09/01/business/smallbusiness/preserving-a-lifetime-of-memories-for-posterity-and-profit.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/business/01EBIZ/01EBIZ-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/08/31/world/what-in-the-world/thailand-buddhism-meditation.html",
title: "What in the World: Corpses, Pythons, Sleep Deprivation: Meditation Rituals in Thailand Can Be Intense",
description: "At some Buddhist temples, methods include meditating beside a dead body, to learn about selflessness, or in total darkness, to enhance concentration.",
date: "2016-08-30T09:00:24.000Z",
link: "http://www.nytimes.com/2016/08/31/world/what-in-the-world/thailand-buddhism-meditation.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/08/25/world/what-in-the-world/00wit_thai-meditation/00wit_thai-meditation-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/01/world/asia/couple-fake-everest-photos.html",
title: "Suspicions Confirmed: Couple Faked Photographs in Everest Climb",
description: "They claimed they were the first Indian couple to ascend the world’s highest peak, but their “proof” consisted of clumsy forgeries, as many climbers had said.",
date: "2016-08-31T14:58:21.000Z",
link: "http://www.nytimes.com/2016/09/01/world/asia/couple-fake-everest-photos.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/01/world/01Nepal-web2/01Nepal-web2-moth.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/04/arts/television/network-sitcoms-prime-time-the-good-place.html",
title: "Welcome to the Zoo. Or Call It Prime-Time TV.",
description: "NBC, Fox and ABC, dogged by cable, are gambling this season on outside-the-box comedies and quirky niche shows.",
date: "2016-09-01T10:00:26.000Z",
link: "http://www.nytimes.com/2016/09/04/arts/television/network-sitcoms-prime-time-the-good-place.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/04/arts/04COMEDIES1/04COMEDIES1-moth-v2.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/04/arts/television/pamela-adlon-louis-ck-better-things-fx.html",
title: "Pamela Adlon Is Starring in Her Very Own Zen Riddle",
description: "With help from Louis C.K., Ms. Adlon has her own show on FX, “Better Things,” loosely based on her real life as a divorced mother of three working in Hollywood.",
date: "2016-09-01T14:00:20.000Z",
link: "http://www.nytimes.com/2016/09/04/arts/television/pamela-adlon-louis-ck-better-things-fx.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/04/arts/04BETTERTHINGS1/04BETTERTHINGS1-moth-v2.jpg"
},
{
guid: "http://www.nytimes.com/2016/09/04/magazine/once-a-bucknell-professor-now-the-commander-of-an-ethiopian-rebel-army.html",
title: "Feature: Once a Bucknell Professor, Now the Commander of an Ethiopian Rebel Army",
description: "Why Berhanu Nega traded a tenured position for the chance to lead a revolutionary force against an oppressive regime.",
date: "2016-08-31T09:00:02.000Z",
link: "http://www.nytimes.com/2016/09/04/magazine/once-a-bucknell-professor-now-the-commander-of-an-ethiopian-rebel-army.html?partner=rss&emc=rss",
image: "https://static01.nyt.com/images/2016/09/04/magazine/04professor_portrait/04mag-04professor-t_CA0-moth.jpg"
}
]
}
}