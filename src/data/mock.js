// Sample data. Rows are kept as arrays to stay compact; selectors.js turns them into objects.

// [id, name, handle, photo, type, city, sign up method, status, followers, following, joined]
export const USERS = [
  ['aisha', 'Aisha Khan', '@aisha.khan', 'brideRed', 'Host', 'Lahore', 'Mobile', 'Active', '2,418', '812', '14 Jan 2026'],
  ['zain', 'Zain Ahmed', '@zain.ahmed', 'groomSehra', 'Host', 'Lahore', 'Google', 'Active', '1,936', '644', '14 Jan 2026'],
  ['zainab', 'Zainab Malik', '@zainab.malik', 'sariRed', 'Guest', 'Lahore', 'Mobile', 'Active', '3,104', '420', '02 Feb 2026'],
  ['priya', 'Priya Sharma', '@priya.s', 'pinkDress', 'Guest', 'Delhi', 'Email', 'Active', '1,212', '388', '19 Feb 2026'],
  ['noor', 'Noor Studios', '@noor.studios', 'couplePose', 'Vendor', 'Karachi', 'Email', 'Active', '48.2k', '312', '08 Nov 2025'],
  ['rabia', 'Rabia Hussain', '@mehndi.by.rabia', 'mehndiHands', 'Vendor', 'Karachi', 'Instagram', 'Active', '22.6k', '190', '21 Dec 2025'],
  ['dholi', 'Dholi Brothers', '@dholi.brothers', 'baraat', 'Vendor', 'Lahore', 'Mobile', 'Active', '9,840', '76', '03 Mar 2026'],
  ['lhrb', 'Lahore Brides', '@lahore.brides', 'brideFloral', 'Feature page', 'Lahore', 'Email', 'Active', '186k', '41', '12 Oct 2025'],
  ['sikhuk', 'Sikh Weddings UK', '@sikh.weddings.uk', 'turbanMirror', 'Feature page', 'London', 'Apple', 'Active', '74.1k', '58', '30 Oct 2025'],
  ['hina', 'Hina Raza', '@hina.raza', 'sariGreen', 'Host', 'Islamabad', 'Mobile', 'Active', '1,044', '510', '11 Mar 2026'],
  ['zoya', 'Zoya Mirza', '@zoya.m', 'yellowRedBridal', 'Host', 'Lahore', 'Apple', 'Active', '2,880', '702', '27 Nov 2025'],
  ['sana', 'Sana Iqbal', '@sana.iqbal', 'redDressPortrait', 'Host', 'Karachi', 'Google', 'Active', '1,620', '598', '05 Apr 2026'],
  ['simran', 'Simran Kaur', '@simran.k', 'purpleDress', 'Host', 'Amritsar', 'Apple', 'Pending', '684', '301', '22 Sep 2026'],
  ['omar', 'Omar Abbasi', '@omar.a', 'couplePair', 'Guest', 'London', 'Google', 'Active', '902', '455', '16 Jun 2026'],
  ['faiza', 'Faiza Rehman', '@faiza.r', 'sariSmile', 'Guest', 'Karachi', 'Mobile', 'Active', '1,388', '612', '09 May 2026'],
  ['waleed', 'Waleed Butt', '@waleed.butt', 'coupleTrad', 'Guest', 'Lahore', 'Mobile', 'Suspended', '214', '190', '28 Aug 2026'],
  ['rohan', 'Rohan Mehta', '@rohan.m', 'couplePlus', 'Guest', 'Delhi', 'Email', 'Banned', '36', '812', '01 Sep 2026'],
  ['ayesha', 'Ayesha Noor', '@ayesha.n', 'twoWomen', 'Guest', 'Islamabad', 'Mobile', 'Active', '540', '322', '30 Sep 2026'],
]

// [id, name, code, photo, hosts, dates, venue, privacy, status, invited, joined, app rate, photos, storage]
export const WEDDINGS = [
  ['az', 'Aisha and Zain', 'AISHA-ZAIN-26', 'couplePose', 'Aisha Khan, Zain Ahmed', '12 to 14 Oct 2026', 'Royal Palm, Lahore', 'Invite only', 'Live', '184', '117', 64, '418', '2.1 GB'],
  ['ha', 'Hina and Ali', 'HINA-ALI-26', 'sariGreen', 'Hina Raza, Ali Shah', '24 to 26 Oct 2026', 'Serena, Islamabad', 'Private', 'Published', '260', '131', 50, '0', '0.2 GB'],
  ['zf', 'Zoya and Faris', 'ZOYA-FARIS-25', 'yellowRedBridal', 'Zoya Mirza, Faris Haq', '19 to 21 Dec 2025', 'Pearl Continental, Lahore', 'Public', 'Ended', '340', '268', 79, '2,904', '14.6 GB'],
  ['sb', 'Sana and Bilal', 'SANA-BILAL-26', 'redDressPortrait', 'Sana Iqbal, Bilal Chaudhry', '05 Oct 2026', 'Clifton Marquee, Karachi', 'Invite only', 'Live', '210', '152', 72, '611', '3.4 GB'],
  ['sa', 'Simran and Arjun', 'SIMRAN-ARJUN-26', 'purpleDress', 'Simran Kaur, Arjun Gill', '05 Oct 2026', 'Ranjit Vilas, Amritsar', 'Invite only', 'Live', '420', '288', 69, '1,120', '5.8 GB'],
  ['ol', 'Omar and Leila', 'OMAR-LEILA-26', 'couplePair', 'Omar Abbasi, Leila Haddad', '04 to 05 Oct 2026', 'Hurlingham, London', 'Private', 'Live', '140', '96', 69, '386', '1.9 GB'],
  ['pr', 'Priya and Rohit', 'PRIYA-ROHIT-26', 'pinkDress', 'Priya Sharma, Rohit Verma', '15 to 18 Nov 2026', 'Taj Palace, Delhi', 'Invite only', 'Published', '520', '204', 39, '0', '0.4 GB'],
  ['fn', 'Faiza and Nabeel', 'FAIZA-NABEEL-26', 'sariSmile', 'Faiza Rehman, Nabeel Ansari', 'Dates not set', 'Karachi', 'Private', 'Draft', '0', '0', 0, '0', '0 GB'],
  ['mh', 'Maryam and Hassan', 'MARYAM-HASSAN-24', 'brideWhite', 'Maryam Ali, Hassan Raza', '08 to 10 Mar 2024', 'Faletti’s, Lahore', 'Public', 'Archived', '300', '244', 81, '3,610', '18.2 GB'],
  ['kj', 'Kiran and Jasdeep', 'KIRAN-JASDEEP-26', 'turbanMirror', 'Kiran Sandhu, Jasdeep Bains', '14 Nov 2026', 'Southall, London', 'Invite only', 'Published', '190', '88', 46, '0', '0.1 GB'],
]

// [name, photo, side, RSVP, app, meal, plus ones, functions]
export const GUESTS = [
  ['Zainab Malik', 'sariRed', 'Bride side . Cousin', 'Going', 'Installed', 'Mutton karahi', '+1', 'Nikah, Walima'],
  ['Priya Sharma', 'pinkDress', 'Bride side . Friend', 'Going', 'Installed', 'Vegetarian', '0', 'All'],
  ['Omar Abbasi', 'couplePair', 'Groom side . Friend', 'Maybe', 'Installed', 'Chicken', '+1', 'Walima'],
  ['Faiza Rehman', 'sariSmile', 'Bride side . Friend', 'Going', 'Installed', 'Chicken', '0', 'Mehndi, Nikah'],
  ['Waleed Butt', 'coupleTrad', 'Groom side . Brother', 'Going', 'Installed', 'Mutton karahi', '+2', 'All'],
  ['Ayesha Noor', 'twoWomen', 'Bride side . Aunt', 'No reply', 'Not installed', '', '0', ''],
  ['Hassan Qureshi', 'groomSehra', 'Groom side . Uncle', 'Going', 'Not installed', 'Chicken', '+1', 'Nikah'],
  ['Mehreen Javed', 'brideFloral', 'Bride side . Cousin', 'Not going', 'Installed', '', '0', ''],
  ['Imran Sheikh', 'couplePlus', 'Groom side . Colleague', 'No reply', 'Not installed', '', '0', ''],
  ['Nadia Farooq', 'seatedBride', 'Bride side . Friend', 'Going', 'Installed', 'Vegetarian', '0', 'Mehndi'],
]

// [id, name, category, city, photo, rating, weddings, verified, plan, enquiries, usually replies in]
export const VENDORS = [
  ['shalimar', 'Shalimar Decor Studio', 'Decor and floral', 'Lahore', 'decorCeiling', '4.9', '214', true, 'Premium', '312', '1h 40m'],
  ['royalpalm', 'The Royal Palm', 'Venues', 'Lahore', 'canopy', '4.8', '486', true, 'Premium', '268', '35m'],
  ['zarish', 'Zarish Couture', 'Bridal couture', 'Delhi', 'yellowRedBridal', '4.9', '172', true, 'Growth', '190', '3h 10m'],
  ['meraki', 'Meraki Artistry', 'Makeup', 'Birmingham', 'twoWomen', '4.7', '138', true, 'Growth', '164', '2h 05m'],
  ['hafeez', 'Hafeez and Sons', 'Jewellery', 'Amritsar', 'bangles', '4.8', '301', true, 'Premium', '121', '4h 20m'],
  ['saffron', 'Saffron Table', 'Catering', 'Leicester', 'flowerArrangement', '4.6', '96', true, 'Growth', '118', '1h 15m'],
  ['rang', 'Rang Invitations', 'Invitations', 'Southall', 'ritualObject', '4.7', '88', false, 'Starter', '72', '6h 40m'],
  ['noor', 'Noor Studios', 'Photo and film', 'Karachi', 'couplePose', '4.9', '244', true, 'Premium', '284', '55m'],
  ['rabia', 'mehndi.by.rabia', 'Mehndi artist', 'Karachi', 'mehndiHands', '4.9', '410', true, 'Growth', '203', '25m'],
  ['dholi', 'dholi.brothers', 'Dhol', 'Lahore', 'baraat', '4.8', '156', false, 'Starter', '61', '1h 50m'],
]

// Businesses that applied and are waiting for approval.
export const APPLICATIONS = [
  { id: 'kesar', n: 'Kesar Events', cat: 'Decor and floral', city: 'Delhi', img: 'flowerGroup', docs: ['GST certificate', 'PAN card', 'Trade licence'], links: ['instagram.com/kesar.events', 'kesarevents.in'], at: '03 Oct 2026', note: '42 weddings listed, 8 in Lahore portfolio' },
  { id: 'lantern', n: 'Lens and Lantern', cat: 'Photo and film', city: 'London', img: 'coupleWalk', docs: ['Companies House', 'Public liability insurance'], links: ['instagram.com/lensandlantern', 'lensandlantern.co.uk'], at: '04 Oct 2026', note: 'Shot 3 weddings already on Mubarakan as guests' },
  { id: 'gulnar', n: 'Gulnar Mehndi', cat: 'Mehndi artist', city: 'Lahore', img: 'mehndiHandsTwo', docs: ['CNIC', 'NTN certificate'], links: ['instagram.com/gulnar.mehndi'], at: '05 Oct 2026', note: 'Tagged in 118 Mubarakan posts' },
  { id: 'beats', n: 'Baraat Beats', cat: 'Dhol', city: 'Birmingham', img: 'baraat', docs: ['Companies House'], links: ['tiktok.com/@baraatbeats'], at: '05 Oct 2026', note: 'Missing insurance document' },
]

// [id, business, ad type, headline, cities, seen by, clicks, enquiries, spent, photo]
export const ADS = [
  ['a1', 'Shalimar Decor Studio', 'Before and after', 'The room they will remember', 'Lahore, Islamabad', '1.84M', '31.2k', '214', 'PKR 412,600', 'decorCeiling'],
  ['a2', 'The Royal Palm', 'Open dates calendar', 'Four Saturdays left in November', 'Lahore', '2.61M', '52.4k', '268', 'PKR 980,200', 'canopy'],
  ['a3', 'Noor Studios', 'Single photo', 'Films, not highlight reels', 'Karachi', '920k', '14.1k', '96', 'PKR 188,000', 'couplePose'],
  ['a4', 'Zarish Couture', 'Product cards', 'Made for you, in fourteen weeks', 'Delhi', '1.12M', '19.8k', '88', 'INR 2,10,400', 'yellowRedBridal'],
  ['a5', 'Meraki Artistry', 'Before and after', 'Your face, at its own best', 'London', '410k', '7.9k', '52', 'GBP 1,320', 'twoWomen'],
  ['a6', 'Hafeez and Sons', 'Product grid', 'Polki, rented or owned', 'Delhi', '1.46M', '22.6k', '121', 'INR 3,94,100', 'bangles'],
  ['a7', 'Saffron Table', 'Menu and prices', 'Three hundred guests, one kitchen', 'London', '188k', '3.4k', '31', 'GBP 640', 'flowerArrangement'],
  ['a8', 'Rang Invitations', 'Product grid', 'Paper that arrives before you do', 'London', '322k', '4.1k', '44', 'GBP 2,000', 'ritualObject'],
  ['a9', 'The Royal Palm', 'Top of search', 'Book Royal Palm for 2027', 'Lahore', '212k', '6.8k', '40', 'PKR 96,000', 'canopy'],
]

export const BUSINESS_CATEGORY = {
  'Shalimar Decor Studio': 'Decor and flowers', 'The Royal Palm': 'Venue', 'Noor Studios': 'Photo and film', 'Meraki Artistry': 'Makeup',
  'Saffron Table': 'Catering', 'Zarish Couture': 'Bridal wear', 'Hafeez and Sons': 'Jewellery', 'Rang Invitations': 'Wedding cards',
}

// [reference, business, ad, customer, phone, prefers, delivery, consent, replied in, received]
export const LEADS = [
  ['MBK-L-20481', 'Shalimar Decor Studio', 'Before and after', 'Aisha Khan', '+92 300 4418 270', 'WhatsApp', 'Delivered', 'Approved', '18m', '05 Oct 2026, 14:12'],
  ['MBK-L-20479', 'The Royal Palm', 'Availability calendar', 'Hina Raza', '+92 321 5508 113', 'Call', 'Delivered', 'Approved', '9m', '05 Oct 2026, 13:40'],
  ['MBK-L-20476', 'Noor Studios', 'Single image', 'Sana Iqbal', '+92 333 2207 914', 'In app', 'Delivered', '—', '42m', '05 Oct 2026, 12:58'],
  ['MBK-L-20470', 'Meraki Artistry', 'Before and after', 'Omar Abbasi', '+44 7700 900 412', 'WhatsApp', 'Failed', 'Approved', '—', '05 Oct 2026, 11:21'],
  ['MBK-L-20466', 'Saffron Table', 'Menu per head', 'Faiza Rehman', '+44 7700 900 188', 'WhatsApp', 'Delivered', 'Approved', '1h 06m', '05 Oct 2026, 10:02'],
  ['MBK-L-20461', 'Zarish Couture', 'Product carousel', 'Priya Sharma', '+91 98110 22341', 'Call', 'Retrying', 'Approved', '—', '05 Oct 2026, 09:47'],
  ['MBK-L-20455', 'Hafeez and Sons', 'Catalogue grid', 'Simran Kaur', '+91 98720 11904', 'WhatsApp', 'Delivered', 'Approved', '2h 31m', '04 Oct 2026, 21:15'],
  ['MBK-L-20449', 'Shalimar Decor Studio', 'Before and after', 'Zoya Mirza', '+92 300 8812 007', 'In app', 'Delivered', '—', '27m', '04 Oct 2026, 19:33'],
  ['MBK-L-20442', 'Rang Invitations', 'Catalogue grid', 'Kiran Sandhu', '+44 7700 900 655', 'WhatsApp', 'Disputed', 'Approved', '5h 12m', '04 Oct 2026, 16:20'],
  ['MBK-L-20438', 'The Royal Palm', 'Sponsored search', 'Maryam Ali', '+92 322 4190 556', 'Call', 'Delivered', 'Approved', '14m', '04 Oct 2026, 15:02'],
]

// [bill, business, what for, amount, status, date, city]
export const PAYMENTS = [
  ['INV-2026-1042', 'Shalimar Decor Studio', 'Premium plan, October', 'PKR 180,000', 'Paid', '01 Oct 2026', 'Lahore'],
  ['INV-2026-1041', 'The Royal Palm', 'Venue ad, October', 'PKR 420,000', 'Paid', '01 Oct 2026', 'Lahore'],
  ['INV-2026-1040', 'Meraki Artistry', 'Growth plan, October', 'GBP 240', 'Paid', '01 Oct 2026', 'London'],
  ['INV-2026-1039', 'Zarish Couture', '60 enquiries pack', 'INR 72,000', 'Late', '28 Sep 2026', 'Delhi'],
  ['INV-2026-1038', 'Saffron Table', 'Growth plan, October', 'GBP 240', 'Card declined', '01 Oct 2026', 'London'],
  ['INV-2026-1037', 'Hafeez and Sons', 'Product grid ad', 'INR 1,10,000', 'Paid', '25 Sep 2026', 'Delhi'],
  ['INV-2026-1036', 'Rang Invitations', 'Starter plan, October', 'GBP 60', 'Refunded', '01 Oct 2026', 'London'],
  ['INV-2026-1035', 'Noor Studios', 'Premium plan, October', 'PKR 180,000', 'Paid', '01 Oct 2026', 'Karachi'],
  ['INV-2026-1034', 'mehndi.by.rabia', 'Growth plan, October', 'PKR 72,000', 'Paid', '01 Oct 2026', 'Karachi'],
  ['INV-2026-1033', 'dholi.brothers', 'Starter plan, October', 'PKR 18,000', 'Late', '24 Sep 2026', 'Lahore'],
]

// [reference, what, channel, to, status, time, city]
export const MESSAGES = [
  ['WA-88213', 'Wedding invite', 'WhatsApp', 'Zainab Malik', 'Read', '14:22', 'Lahore'],
  ['WA-88212', 'Reminder to reply', 'WhatsApp', 'Faiza Rehman', 'Delivered', '14:21', 'Karachi'],
  ['SMS-40118', 'Wedding invite', 'SMS', 'Imran Sheikh', 'Not delivered', '14:21', 'Lahore'],
  ['WA-88210', 'New enquiry alert', 'WhatsApp', 'Meraki Artistry', 'Not delivered', '14:20', 'London'],
  ['WA-88209', 'Wedding invite', 'WhatsApp', 'Priya Sharma', 'Sent', '14:19', 'Delhi'],
  ['PUSH-77120', 'Highlight video ready', 'App notification', '1,204 guests', 'Delivered', '14:18', 'Lahore'],
  ['EM-11002', 'Wedding invite', 'Email', 'Omar Abbasi', 'Delivered', '14:17', 'London'],
  ['WA-88207', 'Wedding invite', 'WhatsApp', 'Hassan Qureshi', 'Read', '14:16', 'Islamabad'],
  ['SMS-40112', 'Wedding invite', 'SMS', 'Ayesha Noor', 'Not delivered', '14:12', 'Islamabad'],
  ['WA-88201', 'Reminder to reply', 'WhatsApp', 'Mehreen Javed', 'Read', '14:05', 'Lahore'],
]

const P = (n, s, img) => ({ n, s, img })

// Posts waiting for a human to keep or remove.
export const REVIEW_QUEUE = [
  { id: 'm1', type: 'Album upload', img: 'couplePose2', who: P('Waleed Butt', '@waleed.butt', 'coupleTrad'), where: 'AISHA-ZAIN-26 . Walima', ai: ['Auto flagged, low confidence', 38, 'gold'], reps: 0, reasons: [], at: '2m ago', cap: 'Uploaded to the Walima moment' },
  { id: 'm2', type: 'Comment', text: 'Who even invited this lot, the food was a joke …', who: P('Rohan Mehta', '@rohan.m', 'couplePlus'), where: 'Public feed . @zoya.m', ai: ['Harassment, high confidence', 91, 'maroon'], reps: 6, reasons: ['Harassment', 'Spam'], at: '6m ago', cap: 'On Zoya and Faris, one year ago today' },
  { id: 'm3', type: 'Reel', img: 'celebration', who: P('dholi.brothers', '@dholi.brothers', 'baraat'), where: 'Public feed', ai: ['Copyrighted audio, medium', 62, 'gold'], reps: 2, reasons: ['Copyright'], at: '11m ago', cap: 'Baraat entry, Royal Palm. Dhol by us 🥁' },
  { id: 'm4', type: 'Post', img: 'brideFloral', who: P('Lahore Brides', '@lahore.brides', 'brideFloral'), where: 'Public feed', ai: ['Clear', 4, 'green'], reps: 3, reasons: ['Not my photo', 'Privacy'], at: '18m ago', cap: 'Bridal look of the week. Credit in comments' },
  { id: 'm5', type: 'Chat message', text: 'Send me your number, I can get you discounted lehengas 👍', who: P('Imran Sheikh', '@imran.sh', 'couplePlus'), where: 'AISHA-ZAIN-26 . Bride side chat', ai: ['Spam, high confidence', 88, 'maroon'], reps: 4, reasons: ['Spam'], at: '24m ago', cap: 'Escalated by host Aisha Khan' },
  { id: 'm6', type: 'Sponsored', img: 'flowerArrangement', who: P('Saffron Table', 'Catering . Leicester', 'flowerArrangement'), where: 'Feed ad . Menu per head', ai: ['Clear', 2, 'green'], reps: 14, reasons: ['Report this ad: misleading price', 'Hide this ad x 212'], at: '40m ago', cap: 'Three hundred guests, one kitchen. From 28 per head' },
  { id: 'm7', type: 'Story', img: 'mehndiHands', who: P('Faiza Rehman', '@faiza.r', 'sariSmile'), where: 'Public stories', ai: ['Auto flagged, low confidence', 31, 'gold'], reps: 1, reasons: ['Nudity'], at: '52m ago', cap: 'Mehndi night ✨' },
  { id: 'm8', type: 'Post', img: 'redGoldOutfit', who: P('Waleed Butt', '@waleed.butt', 'coupleTrad'), where: 'Public feed', ai: ['Clear', 6, 'green'], reps: 0, reasons: ['Appeal: removed in error'], at: '1h ago', cap: 'Removed 4 Oct. User says the outfit is his sister’s own design.' },
  { id: 'm9', type: 'Album upload', img: 'havanFire', who: P('Simran Kaur', '@simran.k', 'purpleDress'), where: 'SIMRAN-ARJUN-26 . Anand Karaj', ai: ['Violence, low confidence', 27, 'gold'], reps: 0, reasons: [], at: '1h ago', cap: 'Fire in frame, likely ritual' },
]

// [name, what it is, photo, usual time, dress code, traditions, on by default]
export const WEDDING_EVENTS = [
  ['Mehndi', 'Henna night', 'mehndiHands', '7:00 pm', 'Yellow and green', 'Muslim, Hindu, Sikh', true], ['Nikah', 'The ceremony', 'ceremony', '4:00 pm', 'Ivory and gold', 'Muslim', true],
  ['Walima', 'The reception feast', 'canopy', '8:00 pm', 'Formal, jewel tones', 'Muslim', true], ['Baraat', 'The groom arrives', 'baraat', '7:30 pm', 'Red and gold', 'Muslim, Hindu, Sikh', true],
  ['Haldi', 'Turmeric and blessings', 'haldiYellow', '11:00 am', 'Yellow', 'Hindu, Sikh', true], ['Sangeet', 'Music and dancing', 'celebration', '8:00 pm', 'Festive, bright', 'Hindu, Sikh, mixed', true],
  ['Dholki', 'Songs before the wedding', 'handsClose', '8:30 pm', 'Casual traditional', 'Muslim, mixed', true], ['Anand Karaj', 'The Sikh ceremony', 'turbanMirror', '10:00 am', 'Pastels, heads covered', 'Sikh', true],
  ['Reception', 'The final party', 'decorCeiling', '8:00 pm', 'Black tie or formal', 'Mixed', true], ['Qawwali night', 'Sufi music evening', 'couplePose3', '9:30 pm', 'White and pastel', 'Muslim', true],
  ['Engagement', 'The promise', 'ringHands', '6:00 pm', 'Smart festive', 'Mixed', true], ['After party', 'Late night', 'diyaGirl', '11:30 pm', 'Anything goes', 'Mixed', false],
]

// [who, what they did, when, icon, tone]
export const RECENT_ACTIVITY = [
  ['Aisha Khan', 'created a new wedding, Aisha and Zain', '2 min ago', 'plus', 'green'],
  ['Mahnoor Baig', 'removed a post by Waleed Butt', '6 min ago', 'close', 'maroon'],
  ['Hamza Qureshi', 'approved the business Gulnar Mehndi', '18 min ago', 'check', 'gold'],
  ['The Royal Palm', 'paid PKR 420,000 for October', '34 min ago', 'money', 'green'],
  ['Simran Kaur', 'invited 420 guests to Simran and Arjun', '1 hour ago', 'send', 'blue'],
  ['Usman Tariq', 'paused the Royal Palm search ad', '1 hour ago', 'pause', 'grey'],
  ['Areeba Siddiqui', 'sent a password reset to Hina Raza', '2 hours ago', 'lock', 'grey'],
]
