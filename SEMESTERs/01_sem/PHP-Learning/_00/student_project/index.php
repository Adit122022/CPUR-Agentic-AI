<?php
include "db.php";

// Delete Code
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    mysqli_query($conn, "DELETE FROM students WHERE id=$id");
    header("Location: index.php");
}
?>


<!-- local -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Management System</title>
    <link rel="stylesheet" href="style.css">
    
</head>

<body>
    <div class="container">
        <h2>Student Management System</h2>

        <a href="add.php" class="btn-add">+ Add New Student</a>

        <table>
            <tr>
                <th>ID</th>
                
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Action</th>
            </tr>

            <?php
            $result = mysqli_query($conn, "SELECT * FROM students ORDER BY id ASC");
            while ($row = mysqli_fetch_assoc($result)) {
                echo "
                <tr>
                    <td>{$row['id']}</td>
                    <td>{$row['name']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['department']}</td>
                    <td>{$row['marks']}</td>
                    <td>{$row['grade']}</td>
                    <td>
                        <a href='edit.php?id={$row['id']}' class='btn-edit'>✏️</a>
                        <a href='index.php?delete={$row['id']}' class='btn-delete' onclick='return confirm(\"Are you sure?\")'>📦</a>
                    </td>
                </tr>";
            }
            ?>
        </table>
    </div>
</body>
</html>
