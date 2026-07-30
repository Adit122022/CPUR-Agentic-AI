<?php
include "db.php";

// Get student data when Edit button is clicked
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $result = mysqli_query($conn, "SELECT * FROM students WHERE id=$id");
    $row = mysqli_fetch_assoc($result);
}

// Update data when form is submitted
if (isset($_POST['update'])) {

    $id = $_POST['id'];
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

    $sql = "UPDATE students SET 
            name='$name', 
            email='$email', 
            department='$department',
            marks='$marks',
            grade='$grade'
            WHERE id=$id";

    mysqli_query($conn, $sql);

    header("Location: index.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Student</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container">

        <a href="index.php" class="btn-edit"><- Back</a>
        <h2>Edit Student Details</h2>

        <form method="POST" style="display: flex; flex-direction: column; gap: 15px;">
            
            <input type="hidden" name="id" value="<?php echo $row['id']; ?>">

            <label>Name:</label>
            <input type="text" name="name" value="<?php echo $row['name']; ?>" required>

            <label>Email:</label>
            <input type="email" name="email" value="<?php echo $row['email']; ?>" required>

            <label>Department:</label>
            <input type="text" name="department" value="<?php echo $row['department']; ?>" required>

            <label>Marks:</label>
            <input type="number" name="marks" value="<?php echo $row['marks']; ?>" required>

            <button type="submit" name="update" class="btn-add">Update Student</button>
        </form>

    </div>
</body>
</html>
