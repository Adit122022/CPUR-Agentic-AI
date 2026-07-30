<?php
include "db.php";

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}
$id = (int)$_GET['id'];

if (isset($_POST['update'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $age = (int)$_POST['age'];
    $gender = mysqli_real_escape_string($conn, $_POST['gender']);
    $contact = mysqli_real_escape_string($conn, $_POST['contact']);
    $disease = mysqli_real_escape_string($conn, $_POST['disease']);
    $admission_date = $_POST['admission_date'];

    $sql = "UPDATE patients SET
            name='$name',
            age=$age,
            gender='$gender',
            contact='$contact',
            disease='$disease',
            admission_date='$admission_date'
            WHERE id=$id";
    mysqli_query($conn, $sql);
    header("Location: index.php");
    exit;
}

$res = mysqli_query($conn, "SELECT * FROM patients WHERE id=$id");
$row = mysqli_fetch_assoc($res);
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Edit Patient</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <a href="index.php" class="btn-edit">&larr; Back</a>
    <h2>Edit Patient</h2>

    <form method="POST" class="form-card">
      <label>Name</label>
      <input type="text" name="name" value="<?php echo htmlspecialchars($row['name']); ?>" required>

      <label>Age</label>
      <input type="number" name="age" value="<?php echo $row['age']; ?>" required>

      <label>Gender</label>
      <select name="gender" required>
        <option <?php if($row['gender']=='Male') echo 'selected'; ?>>Male</option>
        <option <?php if($row['gender']=='Female') echo 'selected'; ?>>Female</option>
        <option <?php if($row['gender']=='Other') echo 'selected'; ?>>Other</option>
      </select>

      <label>Contact</label>
      <input type="text" name="contact" value="<?php echo htmlspecialchars($row['contact']); ?>">

      <label>Disease / Symptoms</label>
      <input type="text" name="disease" value="<?php echo htmlspecialchars($row['disease']); ?>">

      <label>Admission Date</label>
      <input type="date" name="admission_date" value="<?php echo $row['admission_date']; ?>">

      <button type="submit" name="update" class="btn-add">Update</button>
    </form>
  </div>
</body>
</html>
