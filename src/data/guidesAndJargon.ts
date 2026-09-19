import { TaskGuide, JargonItem, SafetyDrillQuestion } from '../types';

export const TASK_GUIDES: TaskGuide[] = [
  {
    id: 'whatsapp-video-call',
    title: 'How to Video Call Your Family on WhatsApp',
    category: 'Family & Calling',
    iconName: 'Video',
    estimatedMinutes: 3,
    prerequisites: ['Smartphone with WhatsApp', 'Home Wi-Fi or Mobile Data', 'Reading glasses if needed'],
    description: 'See your children and grandchildren smile on screen from anywhere in the world.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open WhatsApp',
        instruction: 'Find the green WhatsApp icon with the white telephone handset and tap it gently once.',
        visualNote: 'Green circular icon with a white phone receiver inside.',
        actionHint: 'Tap once. No need to double-tap or hold down.',
        audioText: 'Step 1: Open WhatsApp by tapping the green telephone icon on your home screen.'
      },
      {
        stepNumber: 2,
        title: 'Find Your Family Member',
        instruction: 'Look at the chat list or tap the magnifying glass icon at the top to type their name (e.g., "Rahul" or "Priya").',
        visualNote: 'Top search bar with a magnifying glass.',
        actionHint: 'Tap their name once to open your chat window with them.',
        audioText: 'Step 2: Find your family member in the list or search their name.'
      },
      {
        stepNumber: 3,
        title: 'Tap the Little Video Camera Icon',
        instruction: 'At the very top right corner of the chat, look for the small video camera icon next to the regular telephone icon.',
        visualNote: 'Top right corner: small video camera outline.',
        actionHint: 'Tap the video camera icon. WhatsApp will ask "Start video call?". Tap "Call".',
        audioText: 'Step 3: Look at the top right corner and tap the little video camera icon.'
      },
      {
        stepNumber: 4,
        title: 'Hold Your Phone Up and Smile!',
        instruction: 'Hold the phone at eye level so your family can see your face clearly. When they answer, their face appears large and yours in a small corner.',
        visualNote: 'Hold phone 1 foot away in good room light.',
        actionHint: 'When finished, tap the bright RED circle button at the bottom to end the call.',
        audioText: 'Step 4: Hold your phone comfortably at eye level. When done, tap the red button to hang up.'
      }
    ]
  },
  {
    id: 'pay-utility-bill',
    title: 'How to Safely Pay an Electricity or Water Bill Online',
    category: 'Health & Bills',
    iconName: 'Receipt',
    estimatedMinutes: 5,
    prerequisites: ['Paper bill with Consumer Number', 'Banking app or UPI (Google Pay, PhonePe, Paytm)', 'Private quiet space'],
    description: 'Pay your utility bills directly from your sofa without waiting in long post office or counter lines.',
    steps: [
      {
        stepNumber: 1,
        title: 'Keep Your Paper Bill Next to You',
        instruction: 'Find your electricity bill paper. Look for your "Consumer Account Number" (usually a 10 or 12 digit number printed in bold).',
        visualNote: 'Look near the top right of your paper electricity receipt.',
        actionHint: 'Have a pen to check off the numbers if helpful.',
        audioText: 'Step 1: Place your paper bill on the table so you can clearly see the consumer number.'
      },
      {
        stepNumber: 2,
        title: 'Open Your Official Payment App',
        instruction: 'Open your verified app (like your Bank App, Google Pay, or PhonePe). Never pay through links received in random text messages!',
        visualNote: 'Only open apps you already use and trust.',
        actionHint: 'Tap on "Bills" or "Electricity".',
        audioText: 'Step 2: Open your trusted bank or payment app. Never click links inside SMS messages.'
      },
      {
        stepNumber: 3,
        title: 'Choose Your Electricity Board & Enter Number',
        instruction: 'Select your state provider (e.g., Tata Power, BSES, State Electricity Board) and type your Consumer Number.',
        visualNote: 'The app will automatically fetch your exact bill amount and your name.',
        actionHint: 'Check that the name displayed on screen matches your name before continuing.',
        audioText: 'Step 3: Choose your provider and type your number. Make sure the bill amount matches your paper bill.'
      },
      {
        stepNumber: 4,
        title: 'Confirm and Keep the Digital Receipt',
        instruction: 'Review the amount, enter your secret 4 or 6 digit PIN privately on your phone screen, and tap Submit.',
        visualNote: 'A green checkmark will appear saying "Bill Paid Successfully".',
        actionHint: 'Take a screenshot or tap "Share Receipt" to send it to your son or daughter for peace of mind.',
        audioText: 'Step 4: Enter your secret PIN privately, confirm payment, and save the green receipt.'
      }
    ]
  },
  {
    id: 'order-medicines',
    title: 'How to Order Prescription Medicines to Your Doorstep',
    category: 'Health & Bills',
    iconName: 'Pill',
    estimatedMinutes: 6,
    prerequisites: ['Doctor prescription paper in good light', 'Smartphone camera', 'Delivery address'],
    description: 'Never run out of daily blood pressure or diabetes medicines. Upload a photo and have it delivered.',
    steps: [
      {
        stepNumber: 1,
        title: 'Place Your Doctor Prescription Flat',
        instruction: 'Lay the paper prescription on a flat wooden table near a window or under a good lamp so all doctor writing is sharp.',
        visualNote: 'No shadows over the medicine names.',
        actionHint: 'Ensure the date and doctor signature are visible.',
        audioText: 'Step 1: Put your doctor prescription on a flat surface with bright lighting.'
      },
      {
        stepNumber: 2,
        title: 'Open Pharmacy App & Tap "Upload Prescription"',
        instruction: 'Open your trusted pharmacy app (e.g. Apollo, 1mg, PharmEasy, or local pharmacy app) and tap the big camera button "Upload Prescription".',
        visualNote: 'Big icon labeled "Order with Prescription".',
        actionHint: 'Allow camera access if prompted.',
        audioText: 'Step 2: Tap the upload prescription button in your pharmacy app.'
      },
      {
        stepNumber: 3,
        title: 'Snap the Photo and Review',
        instruction: 'Align the camera rectangle over the entire sheet and tap the white circle button to take the photo.',
        visualNote: 'Review the preview to ensure you can read the names.',
        actionHint: 'Tap "Use this photo" or "Retake" if blurry.',
        audioText: 'Step 3: Take a clear photo of the prescription and tap continue.'
      },
      {
        stepNumber: 4,
        title: 'A Pharmacist Will Call You to Confirm',
        instruction: 'You do not have to type difficult medicine names! A registered pharmacist will call your phone to verify the doses and schedule your delivery.',
        visualNote: 'The app will say "Under Pharmacist Review".',
        actionHint: 'Choose "Pay upon delivery (Cash / Card)" if you prefer paying at your doorstep.',
        audioText: 'Step 4: Relax. A qualified pharmacist will call you to confirm your doses before delivery.'
      }
    ]
  },
  {
    id: 'block-spam-calls',
    title: 'How to Block Annoying Spam & Telemarketing Calls',
    category: 'Safety',
    iconName: 'ShieldAlert',
    estimatedMinutes: 2,
    prerequisites: ['Phone with recent call log'],
    description: 'Silence persistent sales calls and scammers trying to sell loans or lottery schemes.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Your Phone App (Recent Calls)',
        instruction: 'Tap the green Phone app on your screen and open the "Recents" or "Call History" tab.',
        visualNote: 'Shows the list of incoming and missed calls.',
        actionHint: 'Locate the strange or unwanted number.',
        audioText: 'Step 1: Open your phone app and find the unwanted call in your call history.'
      },
      {
        stepNumber: 2,
        title: 'Tap the Little Info "i" or Details Button',
        instruction: 'Next to the spam phone number, tap the small circle with the letter "i" inside, or tap and hold the number.',
        visualNote: 'Small circular "i" symbol on the right side.',
        actionHint: 'A details card for that caller will open.',
        audioText: 'Step 2: Tap the small info circle next to the telephone number.'
      },
      {
        stepNumber: 3,
        title: 'Tap "Block this Caller" or "Block Number"',
        instruction: 'Scroll down to the bottom and tap "Block this Caller". Tap "Block Contact" to confirm.',
        visualNote: 'Red text at the bottom: "Block this Caller".',
        actionHint: 'They will never be able to ring or text your phone again!',
        audioText: 'Step 3: Scroll down and tap Block this Caller. The number is now silenced forever.'
      }
    ]
  }
];

export const JARGON_ITEMS: JargonItem[] = [
  {
    id: 'otp',
    term: 'OTP (One-Time Password)',
    category: 'Security',
    everydayAnalogy: 'Like a wax seal on an official envelope, or a secret handshake valid for only 5 minutes.',
    plainExplanation: 'A temporary 4 or 6 digit number sent to your SMS to prove you are really the person making a payment or logging in.',
    isDangerousOrPaid: 'Free to receive. DANGER: NEVER share an OTP with anyone calling you on the phone. Real bank managers never ask for OTPs.',
    commonAction: 'Check your SMS, type the code into your secure banking app, and keep it strictly secret.'
  },
  {
    id: 'cloud',
    term: 'The Cloud',
    category: 'Internet',
    everydayAnalogy: 'A secure fireproof bank locker in the sky for your family photo albums and documents.',
    plainExplanation: 'Instead of storing files only on your phone glass (which could break if dropped), a safety copy is stored on secure Google or Apple servers.',
    isDangerousOrPaid: 'Usually completely free with your phone account. It keeps your photos safe forever.',
    commonAction: 'When prompted "Back up photos to Cloud?", tap "Yes" so you never lose family memories.'
  },
  {
    id: 'two-factor-auth',
    term: 'Two-Factor Authentication (2FA)',
    category: 'Security',
    everydayAnalogy: 'A front door with two locks: one key that you turn, plus a deadbolt latch.',
    plainExplanation: 'A two-step safety check. Even if a thief guesses your password, they still cannot enter without the verification code sent to your physical phone.',
    isDangerousOrPaid: 'Free and highly recommended! It is the number one protection against modern internet fraud.',
    commonAction: 'Turn it ON for your email and bank accounts for total peace of mind.'
  },
  {
    id: 'cookies',
    term: 'Browser Cookies',
    category: 'Internet',
    everydayAnalogy: 'A cloakroom ticket at an auditorium or a paper bookmark in your favorite novel.',
    plainExplanation: 'A small digital note a website leaves on your browser so it remembers your language and what you were reading.',
    isDangerousOrPaid: 'Harmless and free. They do not steal your money.',
    commonAction: 'When an annoying banner pops up, tap "Accept Necessary" or "Got It" to read in peace.'
  },
  {
    id: 'bluetooth',
    term: 'Bluetooth',
    category: 'Phone Basics',
    everydayAnalogy: 'An invisible wire connecting two devices sitting in the same living room.',
    plainExplanation: 'A short-range wireless radio that connects your phone to hearing aids, car speakers, or wireless headphones without cords.',
    isDangerousOrPaid: 'Free. It works within 10 meters.',
    commonAction: 'Turn it on when using wireless hearing aids or car speakers, turn it off when outdoors to save battery.'
  },
  {
    id: 'app-permissions',
    term: 'App Permissions (Camera/Microphone)',
    category: 'Security',
    everydayAnalogy: 'Giving someone a visitor badge into your house with permission only to enter the kitchen, not the bedroom.',
    plainExplanation: 'A question the phone asks before an app is allowed to look through your camera or listen to your microphone.',
    isDangerousOrPaid: 'Standard security. Only allow Camera for apps that need it (like WhatsApp or Pharmacy app).',
    commonAction: 'Choose "While using the app" for safe and balanced privacy.'
  },
  {
    id: 'phishing',
    term: 'Phishing / Scam Links',
    category: 'Security',
    everydayAnalogy: 'A fake fisherman dangling shiny fake bait on a hook to lure in curious fish.',
    plainExplanation: 'A fake text message or email pretending to be from your bank, electric company, or post office, tempting you to click a dangerous link.',
    isDangerousOrPaid: 'Dangerous if clicked. Scammers try to steal your money or passwords.',
    commonAction: 'Always paste suspicious texts into Suno Beta or show your family helper before clicking!'
  },
  {
    id: 'qr-code',
    term: 'QR Code (Quick Response Code)',
    category: 'Payments',
    everydayAnalogy: 'A black-and-white square barcode, like the price tag printed on grocery boxes.',
    plainExplanation: 'A square puzzle pattern that your phone camera can read in a split second to open a store menu or merchant payment.',
    isDangerousOrPaid: 'Safe to scan at retail stores. WARNING: You scan a QR code ONLY to SEND money, never to RECEIVE money.',
    commonAction: 'Open your payment app camera, point it at the store counter QR code, and verify the merchant name.'
  }
];

export const SAFETY_DRILL_QUESTIONS: SafetyDrillQuestion[] = [
  {
    id: 'drill-1',
    sender: 'Unknown Number (+91-98765-XXXXX)',
    channel: 'SMS',
    messageText: 'URGENT: Dear consumer, your electricity connection will be disconnected tonight at 9:30 PM because your previous bill was not updated. Immediately call our officer at 9876543210 to prevent power cutoff.',
    isScam: true,
    scamType: 'Fake Utility Disconnection Scam',
    clues: [
      'Creates artificial urgency ("tonight at 9:30 PM") to trigger panic.',
      'Asks you to call a personal mobile number instead of an official helpline.',
      'Real utility companies send official paper bills and statutory postal notices weeks in advance.'
    ],
    seniorLesson: 'Whenever any message threatens immediate power cut, block, or penalty within hours, it is almost always a scam. Pause and call your local electricity board directly.'
  },
  {
    id: 'drill-2',
    sender: 'Apollo Clinic (AP-CLINIC)',
    channel: 'SMS',
    messageText: 'Appointment Confirmed: Your appointment with Dr. Mehta is scheduled for Friday, 10:30 AM at Apollo Care Center. Please arrive 15 minutes early. No payment required.',
    isScam: false,
    clues: [
      'Sent from an official 6-character sender ID (AP-CLINIC).',
      'Does not ask you to click strange links or pay money.',
      'Mentions your doctor and timing clearly.'
    ],
    seniorLesson: 'Legitimate appointment reminders provide clear details without asking for money, passwords, or immediate panicked actions.'
  },
  {
    id: 'drill-3',
    sender: 'Lottery Winner Alert (WhatsApp)',
    channel: 'WhatsApp',
    messageText: 'CONGRATULATIONS!! Your mobile number has been awarded $100,000 in International Telecom Lucky Draw 2026. Send your Bank Passbook photo and transfer a registration fee of $50 to release your prize money.',
    isScam: true,
    scamType: 'Advance Fee Lottery Scam',
    clues: [
      'You cannot win a lottery you never bought a ticket for.',
      'Demands an "advance processing fee" to release fake money.',
      'Asks for private photos of your bank passbook.'
    ],
    seniorLesson: 'Remember the golden rule: If someone offers you free money out of nowhere, it is 100% a trick to take your own money. Delete immediately.'
  },
  {
    id: 'drill-4',
    sender: 'Bank Alert (+1-800-FAKE)',
    channel: 'SMS',
    messageText: 'SBI ALERT: Dear user, your net banking account is blocked due to expired PAN KYC. Click http://bit.ly/update-kyc-now to verify your account within 24 hours.',
    isScam: true,
    scamType: 'Banking KYC Phishing',
    clues: [
      'Uses a shortened suspicious link (bit.ly) instead of the official bank website.',
      'Threatens account blockage within 24 hours.',
      'Real banks never ask you to update KYC through random text links.'
    ],
    seniorLesson: 'Never click links inside text messages claiming your bank is blocked. Walk into your bank branch or use your official bookmarked app.'
  }
];
