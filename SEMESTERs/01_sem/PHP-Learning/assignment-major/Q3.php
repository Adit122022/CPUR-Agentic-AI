<!DOCTYPE html>
<html>
<head>
    <title>Login Page</title>
    <style>
        body {
            font-family: Arial;
            padding: 20px;
        }
        .box {
            width: 300px;
            padding: 15px;
            border: 1px solid #ccc;
        }
        input {
            width: 100%;
            padding: 6px;
            margin: 6px 0;
        }
        button {
            padding: 8px 12px;
            cursor: pointer;
        }
        .error {
            color: red;
        }
        .success {
            color: green;
        }
    </style>
</head>
<body>

<div class="box">
    <form method="post">
        <input type="text" name="username" placeholder="Enter Username" required>
        <input type="password" name="password" placeholder="Enter Password" required>
        <button type="submit">Login</button>
    </form>
</div>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Correct login details
    $correctUser = "admin";
    $correctPass = "12345";

    if ($user == $correctUser && $pass == $correctPass) {
        echo "<h3 class='success'>Login Successful! Welcome, $user ❤️</h3>";
    } else {
        echo "<h3 class='error'>Invalid Username or Password ❌</h3>";
    }
}
?>

</body>
</html>
