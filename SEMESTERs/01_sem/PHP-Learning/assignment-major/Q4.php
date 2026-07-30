<!-- 4. PHP Program to display sum of even and odd numbers from 1 to 50.  -->
 <!DOCTYPE html>
<html>
<head>
    <title>Even & Odd Sum</title>
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
    </style>
</head>
<body>

<div class="box">
<h3>Sum of Even & Odd Numbers (1 to 50)</h3>

<?php
$evenSum = 0;
$oddSum = 0;

for ($i = 1; $i <= 50; $i++) {
    if ($i % 2 == 0) {
        $evenSum += $i;
    } else {
        $oddSum += $i;
    }
}

echo "<p><b>Sum of Even Numbers:</b> $evenSum</p>";
echo "<p><b>Sum of Odd Numbers:</b> $oddSum</p>";
?>

</div>

</body>
</html>
