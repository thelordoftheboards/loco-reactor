<html>

<body>

  <p>Hello {{name}},</p>
  <p>
    Forgot your password? No worries! You can reset it by clicking the link below:
  </p>
  <p>
    <a href="http://{{domain}}/auth/reset?code={{resetToken}}">Reset Your Password</a>
  </p>
  <p>
    Alternatively, you can visit
    <br>
    <strong>http://{{domain}}/auth/reset</strong>
    <br>
    and enter the code
    <br>
    <strong>{{resetToken}}</strong>
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
