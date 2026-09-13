/* Joiners — content data.
   Extracted verbatim from Joiners.dc.html. Copy is final; do not paraphrase.
   In Webflow, most of this becomes CMS Collections — see README-webflow.md. */
(function (w) {
'use strict';
const VENUES = [
  {slug:'kitchen', name:'Joiners Kitchen', line:'All-day restaurant and bar. Breakfast from eight, last orders at ten.', long:'The flagship. Breakfast from eight, lunch, small plates through the afternoon and a proper dinner menu from six. The bar stays open later than the kitchen.', distance:'South Street', address:'16 South Street, Sheffield, S2 5QX', phone:'0114 299 6477', today:'Open until 11pm', shot:'Joiners Kitchen — dining room, warm light'},
  {slug:'arms', name:'The Joiners Arms', line:'Pub with nine rooms. Roasts, walkers, dogs.', long:'A corner pub on South Street with nine rooms upstairs. Sunday lunch runs from noon until it goes. Dogs everywhere except the bedrooms.', distance:'On the corner', address:'16 South Street, Sheffield, S2 5QX', phone:'0114 299 6477', today:'Open until 11pm', shot:'The Joiners Arms — South Street exterior, low light'},
  {slug:'coffee-house', name:'Joiners Coffee House', line:'Coffee and bakery, counter service, two doors down.', long:'Coffee, bread and pastry from six in the morning. Counter service, no table service, and the corner table is worth waiting for.', distance:'Two doors down', address:'16 South Street, Sheffield, S2 5QX', phone:'0114 299 6477', today:'Closed', shot:'Joiners Coffee House — counter and bakery'},
  {slug:'engine-room', name:'The Engine Room', line:'Cookery classes, supper clubs and private dining, twelve to sixty covers.', long:'The room above Joiners Kitchen. Classes and supper clubs through the week, then twelve to sixty covers for private dining, one long table or several, and a kitchen you can talk to.', distance:'Above Joiners Kitchen', address:'16 South Street, Sheffield, S2 5QX', phone:'0114 299 6477', today:'Classes and events by arrangement', shot:'The Engine Room — class in progress at the long bench'}
];

const MENUS = {
  Lunch: [
    {name:'Welsh rarebit, pickled walnut', price:'£9.50', tags:'V', allergens:'Gluten, milk, mustard, sulphites'},
    {name:'Hathersage trout, cucumber, dill', price:'£16.00', tags:'GF DF', allergens:'Fish'},
    {name:'Roast squash, freekeh, sage oil', price:'£14.50', tags:'VG DF', allergens:'Gluten'},
    {name:'Steak sandwich, onions, horseradish', price:'£17.00', tags:'', allergens:'Gluten, milk, mustard, sulphites'},
    {name:'Chips, beef dripping', price:'£5.00', tags:'GF DF NF', allergens:'None'}
  ],
  Dinner: [
    {name:'Grouse, bread sauce, game chips', price:'£29.00', tags:'', allergens:'Gluten, milk, celery'},
    {name:'Hake, mussels, cider', price:'£24.00', tags:'GF', allergens:'Fish, molluscs, milk, sulphites'},
    {name:'Celeriac, hazelnut, brown butter', price:'£18.50', tags:'V', allergens:'Milk, nuts'},
    {name:'Hogget, turnip, mint', price:'£26.00', tags:'GF DF NF', allergens:'None'},
    {name:'Buttermilk pudding, damsons', price:'£8.50', tags:'V GF NF', allergens:'Milk, eggs'}
  ],
  Sunday: [
    {name:'Sirloin of Derbyshire beef', price:'£22.00', tags:'', allergens:'Gluten, milk, eggs, mustard'},
    {name:'Pork loin, crackling, apple', price:'£20.00', tags:'DF NF', allergens:'Gluten, sulphites'},
    {name:'Whole roast onion, lentils, gravy', price:'£17.00', tags:'VG DF NF', allergens:'Gluten, celery'},
    {name:'Extra Yorkshire pudding', price:'£2.50', tags:'V', allergens:'Gluten, milk, eggs'},
    {name:'Sticky toffee pudding', price:'£8.00', tags:'V NF', allergens:'Gluten, milk, eggs'}
  ],
  Drinks: [
    {name:'Abbeydale Moonshine, pint', price:'£5.20', tags:'VG DF NF', allergens:'Gluten (barley)'},
    {name:'Thornbridge Jaipur, pint', price:'£5.80', tags:'VG DF NF', allergens:'Gluten (barley)'},
    {name:'Peak cider, half', price:'£3.10', tags:'VG GF DF NF', allergens:'Sulphites'},
    {name:'House red, Cotes du Rhone, 175ml', price:'£7.40', tags:'VG GF DF NF', allergens:'Sulphites'},
    {name:'Coffee House filter, cup', price:'£3.20', tags:'VG GF DF NF', allergens:'None'}
  ]
};

const DIETS = [
  {key:'V', label:'Vegetarian'},
  {key:'VG', label:'Vegan'},
  {key:'GF', label:'Gluten free'},
  {key:'DF', label:'Dairy free'},
  {key:'NF', label:'Nut free'}
];

const AIRSHIP = {color:'#8D00D4', lockup:'Airship', isAirship:true, isToggle:false, headFont:"'Montserrat',sans-serif", headWeight:600};
const TOGGLE = {color:'#1770FD', lockup:'toggle', isAirship:false, isToggle:true, headFont:"'Manrope',Montserrat,sans-serif", headWeight:800};

const PINS = {
  1:{...AIRSHIP, n:1, where:'Home · hero', title:'Proof of Presence',
    what:'The page view is recorded against an anonymous device record before anybody fills in anything. When an email address arrives later, this history is already attached to it.',
    fields:[{k:'device_id',v:'anonymous'},{k:'first_seen',v:'this session'},{k:'pages_viewed',v:'running'},{k:'dwell_seconds',v:'running'},{k:'source',v:'direct'}],
    journey:[{t:'On view',label:'Anonymous record created or matched'},{t:'On identify',label:'History merged into the named contact'},{t:'Ongoing',label:'Every later visit appends to the same record'}],
    number:'Every visit', numberLabel:'A record or a waste. There is no third option.', source:'Illustrative. No benchmark claimed.'},
  2:{...AIRSHIP, n:2, where:'Home · the four places', title:'Venue preference signal',
    what:'Which venue card a visitor opens is written to the contact record as venue_preference. It weights every later send, so a Hathersage regular does not get Kelham Island offers.',
    fields:[{k:'venue_preference',v:'derived'},{k:'venue_views',v:'counted per venue'},{k:'last_venue_viewed',v:'timestamped'}],
    journey:[{t:'On click',label:'venue_preference weighted'},{t:'Next send',label:'Content block selected by venue'},{t:'After 3 signals',label:'Preference locked until it changes'}],
    number:'4 venues', numberLabel:'One list, four different conversations.', source:'Illustrative. No benchmark claimed.'},
  3:{...AIRSHIP, n:3, where:'Home · Join the Table', title:'The Joiners Club form',
    what:'Four fields, written straight to the contact record and grouped so segmentation works from the first submission. No progressive profiling, no second form later.',
    fields:[{k:'first_name',v:'text'},{k:'email',v:'text'},{k:'birth_date',v:'day, month, year'},{k:'venue_preference',v:'enum'},{k:'group',v:'club-members'},{k:'consent_marketing',v:'true'}],
    journey:[{t:'Immediate',label:'Welcome email, Table Friday dates'},{t:'-6 weeks',label:'Birthday journey armed'},{t:'Annual',label:'Anniversary journey armed'},{t:'Day 21 quiet',label:'Lapsing journey armed'}],
    number:'7 fields', numberLabel:'Seven fields arm five journeys that run for years.', source:'Illustrative. No benchmark claimed.'},
  4:{...AIRSHIP, n:4, where:'Home · Join the Table', title:'Value Exchange',
    what:'Every field on the form has a stated return, written next to the form rather than in a privacy policy. The guest knows what they get before they type.',
    fields:[{k:'principle',v:'stated return per field'},{k:'fields_without_return',v:'0'},{k:'consent_type',v:'explicit'}],
    journey:[{t:'Before',label:'Ask stated with its return'},{t:'On submit',label:'Return delivered in the first email'},{t:'Ongoing',label:'Cadence promise held: two a month'}],
    number:'[SOURCE NEEDED]', numberLabel:'Form completion uplift when the value exchange is stated.', source:'Airship form completion benchmark. Not yet sourced or cleared.',
    argument:'Every field earns its place or comes off the form.'},
  5:{...TOGGLE, n:5, where:'Home · Gifts', title:'Presold revenue',
    what:'A gift card is money in the bank today against a visit that happens later, usually with more spend attached than the card carries. Toggle handles the product, the validity rules and the redemption at the till.',
    fields:[{k:'product_type',v:'gift_card | experience | ticket'},{k:'face_value',v:'currency'},{k:'purchased_at',v:'timestamp'},{k:'expiry_rule',v:'from product'},{k:'redeemed_at',v:'null until used'}],
    journey:[{t:'Day 0',label:'Sale settles, card issued'},{t:'Day 30',label:'Reminder if unredeemed'},{t:'Day 60',label:'Second reminder'},{t:'-30 days',label:'Expiry warning'}],
    number:'[SOURCE NEEDED]', numberLabel:'Average redemption spend above card face value.', source:'Toggle redemption uplift. Not yet sourced or cleared.'},
  6:{...AIRSHIP, n:6, where:'The Arms · menus', title:'Menu interest signal',
    what:'Which menu tab a visitor opens and which dietary filter they apply is written to the contact record. It drives dish selection in later emails, so a vegan does not get a grouse photograph.',
    fields:[{k:'menu_viewed',v:'lunch | dinner | sunday | drinks'},{k:'dietary_filter',v:'multi-select'},{k:'allergen_expanded',v:'dish id'}],
    journey:[{t:'On filter',label:'Dietary flag set on the contact'},{t:'Next send',label:'Dish blocks filtered to match'},{t:'Ongoing',label:'Flag persists across venues'}],
    number:'0 forms', numberLabel:'This is captured without asking a single question.', source:'Illustrative. No benchmark claimed.'},
  7:{...AIRSHIP, n:7, where:'The Arms · rooms', title:'Stay data and the anniversary',
    what:'Stay history is appended to the contact: dates, room, lead time, spend. The first stay date becomes the anniversary trigger, captured passively with no form and no ask.',
    fields:[{k:'first_stay_date',v:'derived'},{k:'stay_count',v:'integer'},{k:'booking_lead_days',v:'integer'},{k:'room_type',v:'enum'},{k:'dog',v:'boolean'}],
    journey:[{t:'+1 day',label:'Post-stay thank you and feedback'},{t:'+11 months',label:'Anniversary invitation to book'},{t:'Annual',label:'Repeats with no maintenance'}],
    number:'0 questions', numberLabel:'The date was never asked for.', source:'Illustrative. No benchmark claimed.',
    argument:'We never asked for this date. We just remembered it.'},
  8:{...AIRSHIP, n:8, where:'The Arms · also ours', title:'Cross-venue segmentation',
    what:'Four venues on one contact record means the gaps are visible. A coffee regular who has never booked a table is a segment, not a guess.',
    fields:[{k:'venues_visited',v:'array'},{k:'venues_never_booked',v:'derived'},{k:'visit_frequency',v:'per venue'}],
    journey:[{t:'Nightly',label:'Segment recalculated'},{t:'On match',label:'One email, one offer, one Tuesday'},{t:'On conversion',label:'Contact exits the segment'}],
    number:'1,840', numberLabel:'Coffee House regulars who have never booked the Kitchen.', source:'Illustrative example, not a measured figure.'},
  9:{...AIRSHIP, n:9, where:'Joiners Club · the seven things we ask', title:'The Value Exchange pattern',
    what:'This block is the pattern in full: seven fields, seven stated returns, nothing asked that is not paid back. It is a UI rule, not a slogan.',
    fields:[{k:'first_name',v:'→ written to, not "valued customer"'},{k:'email',v:'→ two a month, never more'},{k:'mobile',v:'→ one text if the table is at risk'},{k:'birth_date',v:'→ a table and a glass'},{k:'anniversary_date',v:'→ the same on your own date'},{k:'postcode',v:'→ your nearest place only'},{k:'venue_preference',v:'→ your place, not all four'}],
    journey:[{t:'Design',label:'Every field gets a stated return'},{t:'Review',label:'Fields without one are deleted'},{t:'Result',label:'Shorter form, better data'}],
    number:'7 of 7', numberLabel:'Fields on this form with a stated return.', source:'By design.',
    argument:'Every field on a hospitality form should have a stated return. The ones that do not should be deleted.'},
  10:{...AIRSHIP, n:10, where:'Joiners Club · success state', title:'The success state',
    what:'The page transforms rather than showing a modal. Behind it, the contact is written, the groups applied and four journeys armed with real trigger dates.',
    fields:[{k:'contact_id',v:'created'},{k:'group',v:'club-members'},{k:'segments_matched',v:'3 of 14'},{k:'journeys_armed',v:'4'}],
    journey:[{t:'Now',label:'Welcome email with Table Friday dates'},{t:'3 Oct',label:'First Table Friday reminder'},{t:'-6 weeks',label:'Birthday invitation to book'},{t:'+12 months',label:'Anniversary of joining'}],
    number:'4 journeys', numberLabel:'Armed by one submission, running for years.', source:'Illustrative. No benchmark claimed.'},
  11:{...AIRSHIP, n:11, where:'Joiners Club · a member\u2019s year', title:'Birthdays',
    what:'The birthday journey starts six weeks out, not the day before. At six weeks you are the first idea. At three days you are competing with a decision already made.',
    fields:[{k:'birth_date',v:'day, month, year'},{k:'birthday_booked',v:'boolean'},{k:'party_size',v:'integer'},{k:'preorder',v:'boolean'}],
    journey:[{t:'-6 weeks',label:'Invitation to book'},{t:'-2 weeks',label:'Reminder if no booking'},{t:'-3 days',label:'Confirmation and pre-order'},{t:'+1 day',label:'Thank you and feedback'}],
    number:'[SOURCE NEEDED]', numberLabel:'Booking rate on the birthday journey.', source:'Airship birthday journey booking rate. Not yet sourced or cleared.',
    argument:'Six weeks out you are the first idea. Three days out you are competing with a decision already made.'},
  12:{...AIRSHIP, n:12, where:'Joiners Club · a member\u2019s year', title:'Anniversaries',
    what:'Derived, not asked. First booking date, first stay date, first Table Friday. Each becomes an annual trigger that fires with no maintenance and no campaign to build.',
    fields:[{k:'first_booking_date',v:'derived'},{k:'first_stay_date',v:'derived'},{k:'joined_table_date',v:'derived'}],
    journey:[{t:'-3 weeks',label:'Anniversary invitation'},{t:'-1 week',label:'Reminder if no booking'},{t:'Annual',label:'Repeats forever, unattended'}],
    number:'0 maintenance', numberLabel:'Built once. Runs every year after that.', source:'Illustrative. No benchmark claimed.'},
  13:{...AIRSHIP, n:13, where:'Joiners Club · the join block', title:'The Value Exchange',
    what:'The newsletter form is replaced with an incentive-led sign-up: a reward on joining, birthday and celebration incentives, and a monthly prize draw. The ask is prominent across every digital and in-venue touchpoint rather than buried in a footer.',
    fields:[{k:'source',v:'web | QR | POS | competition'},{k:'reward_on_join',v:'issued at sign-up'},{k:'celebration_dates',v:'birthday, anniversary'},{k:'prize_draw_entry',v:'monthly'},{k:'segment_route',v:'by form and source'},{k:'tier',v:'prospect → platinum'}],
    journey:[{t:'Immediate',label:'Welcome email sets expectations'},{t:'Delayed',label:'First incentive held back to earn a repeat visit'},{t:'35–60 days',label:'Structured awareness sequence'},{t:'Annual',label:'Check-in keeps the lifecycle connection'},{t:'180+ days',label:'Lapsed re-engagement'}],
    number:'5 tiers', numberLabel:'Prospect, Bronze, Silver, Gold, Platinum. Behaviour-based rewards, not points.', source:'The Value Exchange, Airship. Internal deck, no external benchmark claimed.',
    argument:'Surprise and delight, not constant discounting.'},
  14:{...AIRSHIP, n:14, where:'Parties · group bookers', title:'Single Customer View',
    what:'Party bookers are a segment, and the Single Customer View puts that segment on a live dashboard next to every other one. Percentage of base, spend, value and demographics at a glance, with no exports to stitch together.',
    fields:[{k:'segment',v:'parties of 8+'},{k:'pct_of_base',v:'share of database'},{k:'segment_movement',v:'7 / 14 / 30 / 60 / 90 days'},{k:'avg_spend_per_visit',v:'currency'},{k:'vital_stats',v:'customers, value, visits, tenure'},{k:'demographics',v:'age and gender'}],
    journey:[{t:'Overnight',label:'Segment membership refreshes'},{t:'On entry',label:'Journey triggers, email sends the next day'},{t:'Ongoing',label:'Keeps sending as new people qualify'},{t:'Proof',label:'Proof of Presence links the journey to real visits and spend'}],
    number:'3,150', numberLabel:'Guests in the parties of 8+ segment.', source:'Single Customer View and Segment Journey Triggers, Airship. Example tile figure, not a Joiners number.',
    argument:'Set the audience once. Send forever.'},
  15:{...AIRSHIP, n:15, where:'Home · hero', title:'What running the journeys is worth',
    what:'Airship compared accounts with the core journeys switched on against accounts without them, across five months of trading. The gap is not marginal.',
    fields:[{k:'date_triggers',v:'live / not live'},{k:'welcome_journey',v:'live / not live'},{k:'birthday_journey',v:'live / not live'},{k:'measure_1',v:'email click to visit conversion'},{k:'measure_2',v:'average Proofs of Presence'}],
    journey:[{t:'Date triggers',label:'+27% click to visit, +55% average PoPs'},{t:'Welcome',label:'+68% click to visit, +37% average PoPs'},{t:'Birthday',label:'+34% click to visit, +60% average PoPs'}],
    number:'+68%', numberLabel:'Email click-to-visit conversion uplift where the welcome journey is live.', source:'Airship & Toggle Best Practice 2026. Averages across five months, January to May 2023.',
    argument:'Three journeys, built once. Every account without them is leaving that on the table.'},
  16:{...AIRSHIP, n:16, where:'Home · what\u2019s on', title:'Competitions as a data engine',
    what:'A competition is the cheapest data you will ever buy. Chopstix ran one from an Airship form embedded in their own site, with an immediate bounce-back email confirming the entry and the winner drawn using Randomise across every entrant.',
    fields:[{k:'entry_route',v:'embedded Airship form'},{k:'bounce_back',v:'immediate confirmation'},{k:'winner_selection',v:'Randomise'},{k:'source',v:'tracked per competition'},{k:'consent_marketing',v:'captured at entry'}],
    journey:[{t:'On entry',label:'Bounce-back email confirms the entry'},{t:'Monthly',label:'Low-effort giveaway, prize varied by target segment'},{t:'On close',label:'Winner email sent to all entrants via Randomise'},{t:'After',label:'Entrants feed the welcome journey'}],
    number:'1,200', numberLabel:'Entries to one Chopstix competition from a form on their own website.', source:'Airship & Toggle Best Practice 2026, Chopstix example.'},
  17:{...AIRSHIP, n:17, where:'Home · footer, two emails a month', title:'What the best operators actually send',
    what:'The brands Airship rates highest almost never send the same thing to the whole database. They send localised, seasonal and reactive, with layouts that change to suit the message.',
    fields:[{k:'send_scope',v:'segment, rarely whole base'},{k:'content',v:'localised and merged blocks'},{k:'cadence',v:'weekly, but not to everyone'},{k:'reactive_trigger',v:'weather, events, what\u2019s on'},{k:'layout',v:'varies to support the message'}],
    journey:[{t:'Weekly',label:'Localised send to a segment, not the base'},{t:'Seasonal',label:'Content led by the time of year'},{t:'Reactive',label:'Surprise and delight, triggered by weather or events'}],
    number:'Rarely', numberLabel:'How often a good operator sends the same email to the whole database.', source:'Airship & Toggle Best Practice 2026, \u201CWhat other brands are doing well\u201D.'},
  18:{...AIRSHIP, n:18, where:'Home · Joiners Club band', title:'Data collection: the basics',
    what:'Collect the same information everywhere, and make every form a form. Contact-us and enquiry pages that fire a mailto command capture nothing and offer no opt-in.',
    fields:[{k:'fields',v:'identical across every form'},{k:'mailto_links',v:'replaced with forms'},{k:'opt_in',v:'on every form'},{k:'form_source',v:'tracked'},{k:'passive_capture',v:'EPOS, WiFi, booking, redemption'}],
    journey:[{t:'Active',label:'The guest opts in and joins the CRM'},{t:'Passive',label:'The majority of data arrives without being asked for'},{t:'Routing',label:'Every form lands in the right segment'}],
    number:'Most of it', numberLabel:'The share of a good database that arrives through passive collection.', source:'Airship & Toggle Best Practice 2026, Data Collection: The Basics.',
    argument:'A mailto link is a form that captures nothing.'},
  19:{...AIRSHIP, n:19, where:'Joiners Club · the seven things', title:'Form design, learned from Ego Club',
    what:'Ego Club\u2019s sign-up is the reference for a club form aimed at an older, higher-spending audience. It is why this form asks for an anniversary and a mobile, not just a birthday.',
    fields:[{k:'anniversary_date',v:'a second occasion to trade on'},{k:'email',v:'entered twice to cut errors'},{k:'drink_preference',v:'drop-down'},{k:'offers',v:'stated clearly on the form'},{k:'fulfilment',v:'single-use vouchers, POS integrated'}],
    journey:[{t:'On join',label:'Offers delivered as single-use vouchers'},{t:'At the till',label:'Voucher validated through the POS integration'},{t:'Anniversary',label:'Second occasion traded, Valentine\u2019s included'}],
    number:'2 dates', numberLabel:'A birthday and an anniversary give you two occasions a year instead of one.', source:'Airship & Toggle Best Practice 2026, Ego Club example.'},
  20:{...AIRSHIP, n:20, where:'Joiners Club · what joining gets you', title:'Proof of Presence tiers',
    what:'Guests sit in a visit-frequency tier and the email they get depends on which one. Movement between tiers is itself the trigger, so the journey drives the next visit rather than rewarding the last one.',
    fields:[{k:'tier',v:'lapsed | prospect | bronze | silver | gold | platinum'},{k:'tier_movement',v:'triggers the send'},{k:'treatment',v:'incentive or reward by tier'},{k:'lapsed_window',v:'180+ days'}],
    journey:[{t:'Prospect',label:'Strong incentive to drive a first visit'},{t:'Bronze / Silver',label:'Reward the previous visit, then incentivise the next'},{t:'Gold / Platinum',label:'VIP information and reward, not discount'},{t:'Lapsed',label:'Win-back message at 180+ days'}],
    number:'6 tiers', numberLabel:'Lapsed through to Platinum, each with its own treatment.', source:'Airship & Toggle Best Practice 2026, Driving Visits.',
    argument:'Behaviour-based rewards, not points.'},
  21:{...AIRSHIP, n:21, where:'Joiners Club · success state', title:'The welcome journey',
    what:'Five emails over two weeks, each with one job and one call to action. It introduces the brand, collects the data the sign-up form did not, and ends by letting the guest tag themselves.',
    fields:[{k:'trigger',v:'sign-up +0'},{k:'self_tag',v:'guest-selected interests'},{k:'unique_code',v:'per contact'},{k:'key_date_optouts',v:'guest can mute a date'},{k:'whitelist_prompt',v:'deliverability'}],
    journey:[{t:'+0 days',label:'Promise and the value exchange. CTA: whitelist us'},{t:'+1 day',label:'Our food and our rooms. CTA: book a table'},{t:'+3 days',label:'Voucher with a unique code. CTA: download'},{t:'+7 days',label:'Gift. CTA: claim'},{t:'+14 days',label:'Segmenter form. CTA: tell us what you care about'}],
    number:'5 emails', numberLabel:'Two weeks of welcome, then it can run for a year. \u201CCan you believe it has been a year.\u201D', source:'Airship & Toggle Best Practice 2026, The Welcome Journey.',
    argument:'The welcome journey is where you collect what the form was too short to ask.'},
  22:{...TOGGLE, n:22, where:'Joiners Club · success state', title:'The £5 welcome voucher',
    what:'A Toggle voucher inside the Airship welcome journey. It is the single best-performing mechanic in the deck: over half of them get redeemed, and the basket is worth six times the voucher.',
    fields:[{k:'voucher_value',v:'£5'},{k:'delivery',v:'inside the welcome journey'},{k:'redemption',v:'at the till, POS integrated'},{k:'basket_spend',v:'tracked per redemption'}],
    journey:[{t:'On join',label:'Voucher issued with the welcome email'},{t:'On redemption',label:'Visit and spend written back to the contact'},{t:'After',label:'Read-to-visit conversion measured, not guessed'}],
    number:'55%', numberLabel:'Redemption rate on a £5 Toggle welcome voucher. 3,000 redeemed generated £20k of additional revenue, at an average basket of £31.', source:'Airship & Toggle Best Practice 2026, anonymised client, 1 January to 22 April 2024. Clear before external use.'},
  23:{...AIRSHIP, n:23, where:'Joiners Club · a member\u2019s year', title:'What Airship recommends for birthdays',
    what:'Four emails, and the two reminders suppress anyone who has already redeemed. Guests with a missing date of birth do not need to rejoin, they just complete the one field.',
    fields:[{k:'birth_date',v:'day, month, year'},{k:'offer_redeemed',v:'suppression flag'},{k:'unique_code',v:'per email'},{k:'callback_request',v:'for larger parties'},{k:'sms_consent',v:'reinforces the email'}],
    journey:[{t:'DoB -45',label:'Email 1: birthday offer. CTA: claim'},{t:'DoB -14',label:'Email 2: reminder, suppressed if redeemed'},{t:'DoB',label:'Email 3: happy birthday, no suppression'},{t:'DoB +7',label:'Email 4: reminder, suppressed if redeemed'}],
    number:'4 emails', numberLabel:'An easy win: quick to set up, warm to receive, and it books tables.', source:'Airship & Toggle Best Practice 2026, Birthdays.',
    argument:'Add a click-for-callback to one of the birthday emails and the bigger parties come to you.'},
  24:{...AIRSHIP, n:24, where:'Joiners Club · bring someone new', title:'Rewards journeys',
    what:'Three months of rewards, each one earned. The next reward only sends once the last was redeemed, so only genuinely repeat guests keep getting them.',
    fields:[{k:'booking_type',v:'reward-eligible type on the booking platform'},{k:'reward_issued',v:'night before the reservation'},{k:'redeemed',v:'boolean, gates the next send'}],
    journey:[{t:'Post visit',label:'Email with a booking link to the next visit type'},{t:'Night before',label:'Reward voucher triggered by the booking type'},{t:'On redemption',label:'Next reward email released'}],
    number:'3 months', numberLabel:'A rolling reward sequence that only pays out to guests who come back.', source:'Airship & Toggle Best Practice 2026, Rewards Journeys.'},
  25:{...AIRSHIP, n:25, where:'The Arms · rooms', title:'Sell the little things',
    what:'Rooms guests choose on detail. Dog-friendly rooms and an EV charger convert better than an adjective, and loyalty members get their own newsletter about room discounts rather than the general send.',
    fields:[{k:'dog',v:'boolean'},{k:'ev_charging',v:'boolean'},{k:'room_type',v:'enum'},{k:'loyalty_member',v:'separate send list'}],
    journey:[{t:'Pre-stay',label:'Confirm the details that made them book'},{t:'Members',label:'Separate newsletter: monthly rewards and room discounts'},{t:'Post-stay',label:'Feedback, then the anniversary trigger'}],
    number:'Specifics', numberLabel:'\u201CDog friendly rooms\u201D and \u201CEV charging\u201D outperform \u201Cwelcoming\u201D.', source:'Airship & Toggle Best Practice 2026, Hotels and Pubs examples.'},
  26:{...AIRSHIP, n:26, where:'The Arms · also ours', title:'Filling a new site from nothing',
    what:'Rudy\u2019s opened in Soho with no local database. They built a lookalike audience from their best northern customers, offered a free pizza, and drip-fed the booking email over seven hours so the kitchen survived it.',
    fields:[{k:'lookalike_audience',v:'built from best-customer profiles'},{k:'holding_group',v:'\u201Cwaiting\u201D'},{k:'drip_rate',v:'7,000 emails over 7 hours'},{k:'booking_link',v:'ResDiary form in the email'}],
    journey:[{t:'Step 1',label:'Targeted ads to a lookalike audience, into an Airship form'},{t:'Step 2',label:'Data written to a waiting group'},{t:'Step 3',label:'Drip-fed email directs the waiting list to book'}],
    number:'17 minutes', numberLabel:'To fill the first three days of trade. 6,040 pizzas claimed in two hours, 92% of claimants turned up, and a post-visit email took them to 26th on Tripadvisor in London.', source:'Airship & Toggle Best Practice 2026, Rudy\u2019s Soho.'},
  27:{...AIRSHIP, n:27, where:'Places · loyalty', title:'Loyalty that sits on top of the CRM',
    what:'Loyalty and CRM are not the same system and should not pretend to be. Almond Family Pubs and New Dawn Pubs run Zonal loyalty alongside Airship: the club handles points, Airship handles who hears what.',
    fields:[{k:'member_number',v:'shown in every email'},{k:'loyalty_points',v:'from the till, swapped for spend'},{k:'regulars_club',v:'separate list and content'},{k:'wallet_pass',v:'card lives in the digital wallet'}],
    journey:[{t:'On sign-up',label:'Welcome journey introduces the loyalty club'},{t:'Other routes',label:'Welcome journey pushes them to join loyalty too'},{t:'Ongoing',label:'Every email shows the member number or the prompt'},{t:'Regulars',label:'Separate sends with rewards assigned in the app'}],
    number:'10th visit', numberLabel:'Tortilla\u2019s Burrito Society: stamp-based, card in the digital wallet, scanned at the point of purchase, free burrito on the tenth.', source:'Airship & Toggle Best Practice 2026, Zonal Loyalty and Tortilla examples.'},
  28:{...AIRSHIP, n:28, where:'Parties · Christmas', title:'The Christmas journey, and January',
    what:'December is won in the enquiry and January is won in December. The same journey does both: prize draw and menu while they are booking, then a voucher that only spends in January.',
    fields:[{k:'christmas_booker',v:'group, carried year on year'},{k:'prize_draw_entry',v:'on sign-up'},{k:'january_voucher',v:'unique code'},{k:'qr_capture',v:'scanned on the day of the booking'}],
    journey:[{t:'Immediately',label:'Prize draw. CTA: enter'},{t:'+2 days',label:'Christmas menu. CTA: find out more'},{t:'+6 days',label:'Reminder. CTA: claim your gift'},{t:'+10 days',label:'Thanks for visiting in December. CTA: claim your January voucher'}],
    number:'Two months', numberLabel:'Revenue in December, and again in January, which every operator knows is the quiet one.', source:'Airship & Toggle Best Practice 2026, Christmas and January Campaign.',
    argument:'Put a QR code on the table on the day of the booking and the party becomes contacts, not covers.'},
  29:{...TOGGLE, n:29, where:'Gift Shop · physical cards', title:'The card is the first touchpoint',
    what:'A physical gift card is often the first thing a new guest ever holds of yours. Daniel Thwaites treat theirs as brand, not stationery. Permanently Unique went further and used the card itself as the offer.',
    fields:[{k:'product_type',v:'physical | digital | experience'},{k:'face_value',v:'currency'},{k:'validity_rules',v:'from the product'},{k:'carrier',v:'branded sleeve and insert'}],
    journey:[{t:'Purchase',label:'Cash banked today'},{t:'Gifting',label:'Recipient becomes a contact in their own right'},{t:'Redemption',label:'Visit and spend written back'}],
    number:'£499', numberLabel:'Permanently Unique sold a metal seasonal card for Tattu in 2024 carrying £800 of spend across four visits, for £499.', source:'Airship & Toggle Best Practice 2026, Physical Gifting examples.',
    argument:'A gift card should not just represent the brand. It should elevate it.'},
  30:{...AIRSHIP, n:30, where:'The Engine Room · classes and supper clubs', title:'A diary is a segmentation tool',
    what:'Every date in this diary is a segment waiting to happen. Which type a guest opens, which they book and which they let sell out without acting is written to the contact record and decides what they are told about next.',
    fields:[{k:'event_type_viewed',v:'classes | supper clubs | tastings | private hire'},{k:'event_booked',v:'event id'},{k:'ticket_product',v:'Toggle, dated and limited'},{k:'waiting_list',v:'group, for sold-out dates'},{k:'lead_time_days',v:'integer'}],
    journey:[{t:'On filter',label:'Event interest written to the contact'},{t:'Sold out',label:'Added to the waiting group, told first next time'},{t:'-7 days',label:'Reminder and pre-order'},{t:'+1 day',label:'Feedback, then the next date that fits what they booked'}],
    number:'1 week', numberLabel:'Members hear about new dates a week before general sale, which is what a members\u2019 window is actually for.', source:'Illustrative. Ticketing mechanics per Toggle products.',
    argument:'A dated, limited product sells out. A permanent one never does.'},
  31:{...AIRSHIP, n:31, where:'WiFi · the splash page', title:'WiFi capture through Fydelia',
    what:'The splash page is Fydelia, and it writes straight into Airship. The device is recognised on the next visit so the guest never fills this in twice, and the interaction is appended to the contact whether or not they opt in.',
    fields:[{k:'email',v:'text'},{k:'mac_address',v:'device, recognised on return'},{k:'venue',v:'detected from the SSID'},{k:'connected_at',v:'timestamp'},{k:'dwell_minutes',v:'session length'},{k:'birth_date',v:'day, month, year, optional'},{k:'consent_email',v:'boolean'},{k:'consent_sms',v:'boolean'}],
    journey:[{t:'On connect',label:'Presence appended to the contact, consent or not'},{t:'If opted in',label:'Welcome journey starts'},{t:'Return visit',label:'Device recognised, no form shown'},{t:'Ongoing',label:'Every connection is another visit on the record'}],
    number:'0 friction', numberLabel:'Proof of Presence without a consent wall. Marketing only where the box was ticked.', source:'Fydelia splash page for Joiners Kitchen, live. Mechanics per Fydelia and Airship.',
    argument:'Presence without consent friction. Marketing only with it.'},
  32:{...AIRSHIP, n:32, where:'WiFi · the splash page', title:'Time-of-day patterning',
    what:'Three coffee visits before nine on weekdays is a commuter, not a weekend browser. The connection times build that picture without a single question, and the send time changes to match.',
    fields:[{k:'connection_times',v:'array of timestamps'},{k:'day_part',v:'derived'},{k:'weekday_pattern',v:'derived'},{k:'send_time',v:'set per contact'}],
    journey:[{t:'3 connections',label:'Pattern established'},{t:'Nightly',label:'Segment recalculated'},{t:'Next send',label:'Sent at the hour that guest is actually awake and near you'}],
    number:'Before 9am', numberLabel:'The difference between a commuter and a browser, and between an email read and an email deleted.', source:'Illustrative. Patterning derived from connection data.'},
  33:{...AIRSHIP, n:33, where:'The Joints · national what\u2019s on', title:'The diary is the campaign calendar',
    what:'Five hundred and twenty-one dates, each with an impact rating and a lead time. Sort by start date minus lead time and you have a working marketing calendar rather than a list of things you missed.',
    fields:[{k:'event_date',v:'fixed | confirmed | typical'},{k:'impact',v:'critical | high | medium | low'},{k:'scope',v:'UK-wide or city'},{k:'lead_weeks',v:'when the campaign starts'},{k:'segment_target',v:'chosen per date'}],
    journey:[{t:'Minus lead time',label:'Campaign built, stock and staffing set'},{t:'Minus 3 weeks',label:'Send to the segment that date actually suits'},{t:'On the day',label:'Capture at the till and on the table'},{t:'After',label:'Attendees become a segment for next year'}],
    number:'521 dates', numberLabel:'Critical and High are worth a plan. Medium and Low are menu and social content, and nothing more.', source:'UK Hospitality Trading Diary, September 2026 to December 2027.',
    argument:'Sunday 14 February 2027 is Valentine\u2019s Day, England v France and Super Bowl LXI at once. Pick your audience before you write the menu.'},
  34:{...AIRSHIP, n:34, where:'Contact us · the form', title:'A contact form is a form, not a mailto',
    what:'Every enquiry is routed by topic to the right segment and the right named person, and the reason for the enquiry is written to the contact record. A mailto link would have captured none of it.',
    fields:[{k:'enquiry_topic',v:'booking | party | rooms | classes | gifts | feedback'},{k:'first_name',v:'text'},{k:'email',v:'text'},{k:'message',v:'free text'},{k:'owner',v:'named person, by topic'},{k:'consent_marketing',v:'separate tick, never bundled'}],
    journey:[{t:'Immediate',label:'Acknowledgement naming who will reply'},{t:'Same day',label:'Routed to the owner for that topic'},{t:'On close',label:'Outcome written to the record'},{t:'If opted in',label:'Welcome journey starts, separately from the enquiry'}],
    number:'7 routes', numberLabel:'One form, seven destinations, seven segments. The guest still only sees one form.', source:'Airship & Toggle Best Practice 2026, Data Collection: The Basics.',
    argument:'Segment enquiry follow-ups by type, or you are answering everyone the same way.'}
};

const CONTACT_OWNERS = {
  'A booking': 'Ruth, who runs the floor',
  'A party or private hire': 'Dan, who does the events diary',
  'Rooms': 'Priya, who looks after the nine rooms',
  'Classes and events': 'Marcus, the head chef',
  'Gift cards': 'Ellie in the office',
  'Feedback': 'Ruth, who runs the floor',
  'Something else': 'Ellie in the office'
};

const DIARY_TYPES = ['Everything', 'Classes', 'Supper clubs', 'Tastings', 'Private hire'];

const DIARY = [
  {id:'d1', date:'Thu 17 Sep', time:'6.30pm', type:'Classes', title:'Bread, start to finish', note:'Four hours, one oven each, everything you make goes home with you.', price:'£85', status:'4 places left'},
  {id:'d2', date:'Sat 20 Sep', time:'7pm', type:'Supper clubs', title:'Peak District supper club', note:'Six courses, everything within twenty miles, the kitchen in the room.', price:'£65', status:'Sold out'},
  {id:'d3', date:'Wed 24 Sep', time:'7pm', type:'Tastings', title:'Abbeydale and cheese', note:'Six beers, six cheeses, a brewer who will not stop talking.', price:'£38', status:'Available'},
  {id:'d4', date:'Thu 2 Oct', time:'10am', type:'Classes', title:'Knife skills, properly', note:'Three hours. You will chop faster than everyone you live with.', price:'£65', status:'Available'},
  {id:'d5', date:'Thu 9 Oct', time:'7pm', type:'Supper clubs', title:'Game supper club', note:'Grouse, hare and a room that smells like October.', price:'£65', status:'8 places left'},
  {id:'d6', date:'Sat 18 Oct', time:'11am', type:'Classes', title:'Pasta by hand', note:'No machine. Four shapes, one sauce, lunch at the end of it.', price:'£75', status:'Available'},
  {id:'d7', date:'Wed 29 Oct', time:'6.30pm', type:'Tastings', title:'Cotes du Rhone, six glasses', note:'Six wines from one valley, poured next to the food they were made for.', price:'£45', status:'Available'},
  {id:'d8', date:'Any date', time:'By arrangement', type:'Private hire', title:'The long table, twelve to sixty', note:'One table or several. We write the menu with you, not at you.', price:'From £48 a head', status:'Enquire'}
];

const SEGMENTS = [
  {name:'Sunday lunch regulars', def:'Three or more Sunday bookings in twelve months.', count:'2,410'},
  {name:'Rooms guests who have never eaten in the Kitchen', def:'One or more stays, zero Kitchen bookings.', count:'640'},
  {name:'Lapsing coffee, 21 days quiet', def:'Weekly coffee pattern, nothing for three weeks.', count:'1,120'},
  {name:'Christmas 2025 party bookers', def:'Party enquiry converted last December.', count:'380'},
  {name:'Gift card recipients who have not redeemed', def:'Card issued over 30 days ago, balance untouched.', count:'510'},
  {name:'Champions with two or more friends', def:'Two or more shared links claimed and spent.', count:'96'},
  {name:'Walkers', def:'Arms bookings, weekend lunch, no rooms.', count:'1,760'},
  {name:'Dog owners', def:'Dog flag set on any booking or stay.', count:'890'},
  {name:'Commuters', def:'Three or more coffee visits before 9am on weekdays.', count:'1,340'},
  {name:'Birthday month, no booking', def:'Birthday within six weeks, nothing in the diary.', count:'420'},
  {name:'Corporate buyers', def:'Bulk order or Kitchen enquiry in twelve months.', count:'210'},
  {name:'Dietary: vegan or vegetarian', def:'Filter applied on any menu, or noted at booking.', count:'1,480'},
  {name:'High spend, low frequency', def:'Top quartile spend, two or fewer visits a year.', count:'560'},
  {name:'Feedback unresolved', def:'Score of two or less, issue still open. Suppressed.', count:'34'}
];

/* ---- Page content lifted from the prototype's render layer ---- */

const WHATS_ON = [
  {date:'From 18 September', title:'Autumn menu at the Kitchen', body:'Grouse, damsons, celeriac. The whole board changes on the Thursday.', price:'£34 for three courses'},
  {date:'Thursday 9 October', title:'Supper club at The Kitchen', body:'One long table, six courses, the kitchen in the room with you.', price:'£65 a head'},
  {date:'October half term', title:'Rooms at the Arms', body:'Four of the nine still free across the week. Breakfast at the long table.', price:'From £140 a night'}
];

const GIFT_TILES = [
  {name:'Gift card, any amount', price:'From £20'},
  {name:'Chef’s table for two', price:'£130'},
  {name:'Supper club ticket', price:'£65'}
];

const JOURNAL = [
  {id:'j1', date:'2 September', title:'What nine rooms teaches you about breakfast', shot:'The long table at breakfast'},
  {id:'j2', date:'21 August', title:'Where the grouse comes from, exactly', shot:'Moorland above Hathersage'},
  {id:'j3', date:'4 August', title:'Two years of the corner table', shot:'The corner table, Coffee House'}
];

const ROOMS = [
  {id:'r1', name:'Bank', line:'Double at the front, over the road, deepest bath in the building.', price:'From £150', shot:'Room — Bank'},
  {id:'r2', name:'Boot Room', line:'Ground floor twin, own door to the yard. Dogs welcome.', price:'From £140', shot:'Room — Boot Room'},
  {id:'r3', name:'Long View', line:'Top floor, two windows, the whole city on a clear morning.', price:'From £175', shot:'Room — Long View'}
];

const ASKS = [
  {field:'Your name', gets:'So we can write to you, not to “valued customer”.'},
  {field:'Your email', gets:'Two emails a month. Never more.'},
  {field:'Your mobile', gets:'One text if your table is at risk, and nothing else. No marketing by text.'},
  {field:'Your birthday', gets:'A table held for you and a glass on us. We will ask six weeks out, not the day before.'},
  {field:'Your anniversary', gets:'The same again on the date that matters to you, whatever it marks.'},
  {field:'Your postcode', gets:'We tell you what is on at your nearest place, and nothing about the other three.'},
  {field:'Where you go most', gets:'You hear about your place, not all four.'}
];

const VX_STEPS = [
  {when:'The day you join', what:'A drink on us on your next visit, whichever place you walk into.'},
  {when:'Your dates', what:'Birthday and anniversary tables held, asked about six weeks out.'},
  {when:'Every month', what:'Entered into the members’ draw. Dinner for two, no forms to fill in.'},
  {when:'The more you visit', what:'Better held back for you, based on coming in rather than on points.'}
];

/* March, September and November are pine-filled — birthday, joining anniversary, Christmas window. */
const MONTHS = [
  {label:'JAN', event:'First Friday table'}, {label:'FEB', event:'Quiet month, one email'},
  {label:'MAR', event:'Birthday table held'}, {label:'APR', event:'First Friday table'},
  {label:'MAY', event:'Rooms first refusal'}, {label:'JUN', event:'Supper club priority'},
  {label:'JUL', event:'First Friday table'}, {label:'AUG', event:'Quiet month, one email'},
  {label:'SEP', event:'Joining anniversary'}, {label:'OCT', event:'Rooms first refusal'},
  {label:'NOV', event:'Christmas priority window'}, {label:'DEC', event:'Table on the 27th'}
].map(function (m, i) { return Object.assign({}, m, {mark: (i === 2 || i === 8 || i === 10)}); });

const CONTACT_ROUTES = [
  {title:'Book a table', body:'Four taps and you are done. Faster than we can answer the phone at seven.', cta:'Go to booking', href:'book.html'},
  {title:'A party, twelve to sixty', body:'The Engine Room, party menus, Christmas. Tell us the numbers and we come back with a plan and a price.', cta:'Parties', href:'parties.html'},
  {title:'Classes and supper clubs', body:'The full diary, what is left and what has gone.', cta:'The Engine Room', href:'the-engine-room.html'},
  {title:'Gift cards and vouchers', body:'Balances, expiry, a card that will not scan. All of it is in the shop.', cta:'Gift Shop', href:'gift-shop.html'},
  {title:'Join the Joiners Club', body:'Your birthday and your special day remembered, competitions and rewards.', cta:'Joiners Club', href:'joiners-club.html'}
];

const ARMS_CHIPS = ['Step-free entry', 'Dog friendly', 'Parking', 'Allergen menu'];
const ENGINE_CHIPS = ['Step-free lift access', 'Hands-on, 8 to 12', '12 to 60 covers', 'Allergens catered'];
const MENU_UPDATED = 'Menus updated 2 September 2026';

w.JO = {
  VENUES: VENUES, MENUS: MENUS, DIETS: DIETS, PINS: PINS,
  CONTACT_OWNERS: CONTACT_OWNERS, DIARY_TYPES: DIARY_TYPES, DIARY: DIARY,
  SEGMENTS: SEGMENTS, WHATS_ON: WHATS_ON, GIFT_TILES: GIFT_TILES, JOURNAL: JOURNAL,
  ROOMS: ROOMS, ASKS: ASKS, VX_STEPS: VX_STEPS, MONTHS: MONTHS,
  CONTACT_ROUTES: CONTACT_ROUTES, ARMS_CHIPS: ARMS_CHIPS, ENGINE_CHIPS: ENGINE_CHIPS,
  MENU_UPDATED: MENU_UPDATED
};

})(window);
