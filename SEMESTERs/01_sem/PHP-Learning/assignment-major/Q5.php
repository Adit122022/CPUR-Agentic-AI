<!-- 5. Write a PHP program that Display student result with grade calculation -->

<!DOCTYPE html>
<html>
<head>
    <title>Student Result</title>
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
        .result {
            margin-top: 20px;
        }
    </style>
</head>
<body>

<div class="box">
    <h3>Student Result</h3>
    <form method="post">
        <input type="number" name="m1" placeholder="Enter Marks of Subject 1" required>
        <input type="number" name="m2" placeholder="Enter Marks of Subject 2" required>
        <input type="number" name="m3" placeholder="Enter Marks of Subject 3" required>
        <button type="submit">Calculate Result</button>
    </form>
</div>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $m1 = $_POST['m1'];
    $m2 = $_POST['m2'];
    $m3 = $_POST['m3'];

    $total = $m1 + $m2 + $m3;
    $total_Marks =300;
    $percentage = ($total / $total_Marks) * 100;

    // Grade Calculation
    if ($percentage >= 90) {
        $grade = "A+";
    } elseif ($percentage >= 80) {
        $grade = "A";
    } elseif ($percentage >= 70) {
        $grade = "B";
    } elseif ($percentage >= 60) {
        $grade = "C";
    } elseif ($percentage >= 50) {
        $grade = "D";
    } else {
        $grade = "F (Fail)";
    }

    echo "<div class='result'>";
    echo "<h3>Total Marks: $total /  $total_Marks</h3>";
    echo "<h3>Percentage: " . round($percentage, 2) . "%</h3>";
    echo "<h3>Grade: $grade</h3>";
    echo "</div>";
}
?>

</body>
</html>
