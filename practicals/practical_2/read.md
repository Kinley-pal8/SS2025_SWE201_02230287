
### Practical Report: Implementing Authentication with Supabase

### 1. What I Have Done

I implemented three authentication methods using Supabase:

- **Email and Password Authentication**: Set up user sign-up and login functionality using Supabase's `auth.signUp` and `auth.signInWithPassword` methods. Configured email verification to ensure secure account creation.

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image.png" width="30%">
  <img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%201.png" width="30%">
  <img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%202.png" width="30%">
  <img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%203.png" width="30%">
</div>

- **Magic Link Authentication**: Enabled passwordless login by implementing Supabase's `auth.signInWithOtp` method, allowing users to receive a one-time magic link via email for seamless access.

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%204.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%205.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%206.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e вдоль by a user.

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%207.png" width="30%">

- **Phone Login Authentication**: Integrated phone-based authentication using `auth.signInWithOtp` for sending OTPs to users’ phone numbers and `auth.verifyOtp` for verification. Tested workflows for both SMS delivery and user login.

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%208.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%209.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%2010.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%2011.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%2012.png" width="30%">

<img src="SWE%20p2%201d3d813d6e42803bb026e600f08631cf/image%2013.png" width="30%">

All implementations were tested in a development environment, ensuring proper integration with a front-end interface and Supabase’s dashboard for user management.

### 2. What I Have Learnt

- **Supabase Auth API**: I've gotten a decent grasp on Supabase's authentication methods. I can now work with email logins, those convenient magic links, and phone-based logins, though I'm still learning the finer details.
- **Twilio Integration**: Figuring out how to connect Supabase with Twilio was quite the adventure! I managed to set up phone-based OTP authentication by configuring all those credentials (Account SID, Auth Token, and Sender Phone Number) in the Supabase dashboard. Even played around with customizing the SMS templates.
- **Security Stuff**: I quickly realized how crucial email verification is. Those OTP delivery systems need proper security too - definitely don't want unauthorized folks getting in!
- **User Experience Insights**: It was eye-opening to see how much smoother magic links and phone OTPs make the login process compared to the old-school email/password dance. Users seem to appreciate these options.
- **Finding My Way Around**: The Supabase dashboard isn't so intimidating anymore. I can monitor user activity and fiddle with auth settings without breaking everything (well, most of the time).
- **Dealing with Problems**: I've gotten better at handling those pesky authentication errors - invalid credentials, expired OTPs, and all that jazz. Makes the app much more robust when things don't go exactly as planned.

### 3. What Challenges I Have Faced

- **Email Nightmares**: Some poor users never got their verification emails or magic links. Turns out email settings can be finicky, and spam filters love to eat important messages.
- **SMS Delivery Drama**: SMS delivery is far from perfect - some regions had serious issues, and hitting rate limits for OTP requests was a real pain. Nothing like explaining to users why they haven't received their code!
- **Cryptic Error Messages**: Supabase sometimes throws these vague error messages that had me scratching my head for hours. Trying to figure out what "invalid payload format" actually means isn't exactly fun.
- **Dashboard Confusion**: I totally messed up the auth settings in the Supabase dashboard at first. Cue authentication flows failing and me wondering where it all went wrong.

### 4. How Did I Overcome

- **Fixing Email Issues**: After some late nights, I set up a custom SMTP server in Supabase and added those "please check your spam folder" messages that everyone ignores. Testing with different email providers helped confirm things were actually working.
- **SMS Solutions**: I dug into Supabase's SMS provider limitations and cobbled together some fallback logic to retry OTP requests. Also had to set proper expectations with users about potential delays in certain regions - "your code is coming, I promise!"
- **Error Detective Work**: I practically lived in Supabase's documentation and community forums trying to decode those mysterious error messages. Adding detailed logging helped trace issues like those annoying malformed API calls.
- **UI Juggling Act**: State management to the rescue! Used React's useState (and occasionally Redux when things got complex) to handle those async auth states. Lots of testing to make sure loading indicators and error messages showed up when they should.
- **Dashboard Mastery**: Eventually went through Supabase's auth settings with a fine-tooth comb, making sure all the right providers were enabled and double-checking those redirect URLs. End-to-end testing saved my bacon here.
