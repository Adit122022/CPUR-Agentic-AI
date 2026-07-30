
<!-- 1. PHP Program to find the largest of three numbers.  -->

<!DOCTYPE html>
<html>
<head>
    <title>Largest Number</title>
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
        <input type="number" name="a" placeholder="Enter first number" required>
        <input type="number" name="b" placeholder="Enter second number" required>
        <input type="number" name="c" placeholder="Enter third number" required>
        <button type="submit">Find Largest</button>
    </form>
</div>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $a = $_POST['a'];
    $b = $_POST['b'];
    $c = $_POST['c'];

    $largest = max($a, $b, $c);

    echo "<h3>Largest Number: $largest</h3>";
}
?>

</body>
</html>
