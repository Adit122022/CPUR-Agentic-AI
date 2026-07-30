<!-- 2. PHP Program to count vowels in a given string.  -->

<!DOCTYPE html>
<html>
<head>
    <title>Vowel Counter</title>
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
    </style>
</head>
<body>

<div class="box">
    <form method="post">
        <input type="text" name="text" placeholder="Enter a string" required>
        <button type="submit">Count Vowels</button>
    </form>
</div>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $str = strtolower($_POST['text']); // lowercase for easy checking
    $vowels = ['a', 'e', 'i', 'o', 'u'];
    $count = 0;

    for ($i = 0; $i < strlen($str); $i++) {
        if (in_array($str[$i], $vowels)) {
            $count++;
        }
    }

    echo "<h3>Total Vowels: $count</h3>";
}
?>

</body>
</html>
