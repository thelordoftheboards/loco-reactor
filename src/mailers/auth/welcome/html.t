<html>

<body>

  <p>Hello {{name}},</p>
  <p>
    Welcome to Loco Reactor! Your account has been created.
    Before you get started, please verify your account by clicking the link below:
  </p>
  <p>
    <a href="http://{{domain}}/auth/verify?code={{verifyToken}}">
      Verify Your Account
    </a>
  </p>
  <p>
    Alternatively, you can visit
    <br>
    <u>http://{{domain}}/auth/verify</u>
    <br>
    and enter the code
    <br>
    <strong>{{verifyToken}}</strong>
    <br>
    when prompted.
  </p>
  <p>
    Best regards,
    <br>
    The Loco Reactor Team
  </p>

</body>

</html>
