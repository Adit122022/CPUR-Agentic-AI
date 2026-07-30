<?php
include "db.php";

// Insert Code
if (isset($_POST['submit'])) {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $department = $_POST['department'];
    $marks = $_POST['marks'];

    // Auto Grade Calculation
    if ($marks >= 90) $grade = "A+";
    else if ($marks >= 75) $grade = "A";
    else if ($marks >= 60) $grade = "B";
    else if ($marks >= 40) $grade = "C";
    else $grade = "F";

    $sql = "INSERT INTO students (name, email, department, marks, grade)
            VALUES ('$name', '$email', '$department', '$marks', '$grade')";

    mysqli_query($conn, $sql);

    header("Location: index.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container">
          <a href="index.php" class="btn-edit"><- Back</a>
        <h2>Add New Student</h2>

        <form method="POST" style="display: flex;flex-direction: column;gap: 15px;">
            <label>Name:</label>
            <input type="text" name="name" required>

            <label>Email:</label>
            <input type="email" name="email" required>

            <label>Department:</label>
            <input type="text" name="department" required>

            <label>Marks:</label>
            <input type="number" name="marks" required>

            <button type="submit" name="submit" class="btn-add">Save Student</button>
          
        </form>

    </div>
</body>
</html>
