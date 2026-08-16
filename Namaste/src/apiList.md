## -DEV TINDER API'S

## -For authRouter
- Post /Login
- Post /Signup
- Post /Logout

# -For ProfileRouter

-Get /profile/view
-Patch /profile/password
-Patch /profile/edit

# connectionRouter

-Post /request/send/interested/:userId
-Post /request/send/ignore/:userId
-Post /request/review/accepted/:requestId
-Post /request/review/rejected/:requestId

# -User Router

-Post /user/connection
-Post /user/feed
-Post /user/connection

# status :ignore,rejected,accepeted,interested