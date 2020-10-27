const {
  Card,
  conversation,
  Link,
  List,
  Image,
  Suggestion
} = require('@assistant/conversation');
const functions = require('firebase-functions');

const OPTION_1_IMAGE = new Image({
  url: 'https://image.cnbcfm.com/api/v1/image/106161538-1570071966284gettyimages-1178179427.jpeg',
  alt: 'Mark Cuban'
});

const OPTION_2_IMAGE = new Image({
  url: 'https://assets.entrepreneur.com/content/3x2/2000/20181128171929-GettyImages-1055859052.jpeg',
  alt: 'Mark Cuban'
});

const OPTION_3_IMAGE = new Image({
  url: 'https://image.cnbcfm.com/api/v1/image/105799901-1552925702277gettyimages-1126310196.jpeg',
  alt: 'Mark Cuban'
});

const OPTION_4_IMAGE = new Image({
  url: 'https://image.cnbcfm.com/api/v1/image/105943060-1559325051155gettyimages-1142308157.jpeg',
  alt: 'Mark Cuban'
});

const app = conversation({
  debug: true,
  clientId: '501525608956-t4i023fihp8d7r1hn8uokugal5dgibo2.apps.googleusercontent.com'
});

function urlString (url, conv) {
  const defaultGUID = 'xxxxxx';
  const token = (conv.user.params.tokenPayload && conv.user.params.tokenPayload.email) ? conv.user.params.tokenPayload.email : defaultGUID;
  const feedback = conv.session.params.feedback ?  conv.session.params.feedback : 'none';
  const comeback = conv.session.params.comeback ?  conv.session.params.comeback : 'none';
  let urlReq = new URL(url);
	urlReq.searchParams.set('t', token);
	urlReq.searchParams.set('f', feedback);
	urlReq.searchParams.set('c', comeback);
	const encodedUrl = encodeURI(urlReq);  
  return encodedUrl;
}

app.handle('option', (conv) => {
  const selectedOption = conv.session.params.prompt_option;
	if (conv.session.params.feedback) {
    conv.session.params.comeback = conv.request.intent.query;
  } else {
    conv.session.params.feedback = conv.request.intent.query;    
  }
  //conv.add(`You selected ${selectedOption}, last said was ${conv.request.intent.query}, gave feedback of ${conv.session.params.feedback}, and a comeback of ${conv.session.params.comeback}.`);
  conv.scene.next.name = selectedOption;	
});

app.handle('list', (conv) => {displayMenu(conv);});

function displayMenu(conv) {
  conv.session.typeOverrides = [{
    name: 'prompt_option',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'OPTION_1',
          synonyms: ['CTA', 'Next', 'Action', 'For Now', 'For Right Now'],
          display: {
             title: 'For Right Now',
             description: 'Fast Check-In',
             image: OPTION_1_IMAGE
          }
        },
        {
          name: 'OPTION_2',
          synonyms: ['Digest', 'Dose', 'Daily Dose', 'Daily Digest', 'today', 'For Today'],
          display: {
             title: 'For Today',
             description: 'My Daily Dose',
             image: OPTION_2_IMAGE
          },
        },
        {
          name: 'OPTION_3',
          synonyms: ['Just for Me', 'My Personal Message', 'Mine', 'For Me'],
          display: {
             title: 'For Me',
             description: 'Today\'s Message',
             image: OPTION_3_IMAGE
          }
        },
        {
          name: 'OPTION_4',
          synonyms: ['Promo', 'Deal of the Day', 'First item', 'Daily Deal', 'For Us'],
          display: {
             title: 'For Us',
             description: 'Deal of the Day',
             image: OPTION_4_IMAGE
          }
        }
      ]
    },
  }];
  conv.add(new List({
    title: 'Ask Mark Cuban',
    subtitle: 'About Voice',
    items: [
      {
        key: 'OPTION_1'
      },
      {
        key: 'OPTION_2'
      },
      {
        key: 'OPTION_3'
      },
      {
        key: 'OPTION_4'
      }
    ],
  }));
	conv.add(new Suggestion({'title': 'For Right Now'}));
  conv.add(new Suggestion({'title': 'For Today'}));
	conv.add(new Suggestion({'title': 'For Me'}));
	conv.add(new Suggestion({'title': 'For Us'}));
  return conv;
}


app.handle('intro', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/mark_cuban_1.mp3">Ask Mark Cuban about Voice</audio></speak>');
});

app.handle('followUp1', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/mark_cuban_question_2.mp3">Ask Mark Cuban about Voice</audio></speak>');
  displayMenu(conv);
});

app.handle('followUp2', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/mark_cuban_question_3.mp3">Ask Mark Cuban about Voice</audio></speak>');
  displayMenu(conv);
});

app.handle('followUp3', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/mark_cuban_final.mp3">Ask Mark Cuban about Voice</audio></speak>');
});

app.handle('goodbye', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/mark_cuban_outro.mp3">Come back soon!</audio></speak>');
});

app.handle('option1', (conv) => {
	const encodedUrl = urlString('https://mark-cuban.about-voice.com', conv);
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/steve_case.php">Forms and Docs</audio></speak>');
  conv.add(new Card({
    'title': 'For Right Now',
    'subtitle': 'Quick Check-In Form',
    'text': 'Fast access to your next steps',
    'image': OPTION_1_IMAGE,
    'button': {
      'name': 'Check-In Now',
      'open': {
              'url': encodedUrl
            }
    }
  }));
	conv.add(new Suggestion({'title': 'Get Daily Reminders'}));
	conv.add(new Suggestion({'title': 'For Right Now'}));
  conv.add(new Suggestion({'title': 'For Today'}));
	conv.add(new Suggestion({'title': 'For Me'}));
	conv.add(new Suggestion({'title': 'For Us'}));
	conv.add(new Suggestion({'title': 'Menu'}));
});

app.handle('option2', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/steve_case.php">For Us</audio></speak>');
  conv.add(new Card({
    'title': 'For Us',
    'subtitle': 'Deal of the Day',
    'text': 'Special offers for the community',
    'image': OPTION_2_IMAGE,
    'button': {
      'name': 'Get My Deal of the Day',
      'open': {
              'url': urlString('https://mark-cuban.about-voice.com/deals.html', conv)
            }
    }
  }));
	conv.add(new Suggestion({'title': 'Send Me Deals Daily'}));
	conv.add(new Suggestion({'title': 'For Right Now'}));
  conv.add(new Suggestion({'title': 'For Today'}));
	conv.add(new Suggestion({'title': 'For Me'}));
	conv.add(new Suggestion({'title': 'For Us'}));
	conv.add(new Suggestion({'title': 'Menu'}));
});

app.handle('option3', (conv) => {
  conv.add('<speak><audio src="https://02b7cf4.netsolhost.com/audio/steve_case.php">For Today</audio></speak>');
  conv.add(new Card({
    'title': 'For Today',
    'subtitle': 'Daily Dose',
    'text': 'Get the full version',
    'image': OPTION_3_IMAGE,
    'button': {
      'name': 'Visit Mark Cuban about Voice',
      'open': {
              'url': urlString('https://mark-cuban.about-voice.com', conv)
            }
    }
  }));
  conv.add(new Suggestion({'title': 'Send Me Daily Digest'}));
	conv.add(new Suggestion({'title': 'For Right Now'}));
	conv.add(new Suggestion({'title': 'For Today'}));
	conv.add(new Suggestion({'title': 'For Me'}));
	conv.add(new Suggestion({'title': 'For Us'}));
	conv.add(new Suggestion({'title': 'Menu'}));
});

app.handle('option4', (conv) => {
  const who = (conv.user.params.tokenPayload && conv.user.params.tokenPayload.given_name) ? conv.user.params.tokenPayload.given_name : 'Me';
  conv.add(`<speak><audio src="https://02b7cf4.netsolhost.com/audio/steve_case.php">For ${who}</audio></speak>`);
  conv.add(new Card({
    'title': `For ${who}`,
    'subtitle': 'A Message for Me',
    'text': 'Let me know how this helped.',
    'image': OPTION_4_IMAGE,
    'button': {
      'name': 'Share Your Thoughts',
      'open': {
              'url': urlString('https://mark-cuban.about-voice.com', conv)
            }
    }
  }));
	conv.add(new Suggestion({'title': 'Get Daily Messages'}));
	conv.add(new Suggestion({'title': 'For Right Now'}));
  conv.add(new Suggestion({'title': 'For Today'}));
	conv.add(new Suggestion({'title': 'For Me'}));
	conv.add(new Suggestion({'title': 'For Us'}));
	conv.add(new Suggestion({'title': 'Menu'}));
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
