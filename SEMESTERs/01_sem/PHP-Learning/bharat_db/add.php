<?php
include "db.php";

if (isset($_POST['submit'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $age = (int)$_POST['age'];
    $gender = mysqli_real_escape_string($conn, $_POST['gender']);
    $contact = mysqli_real_escape_string($conn, $_POST['contact']);
    $disease = mysqli_real_escape_string($conn, $_POST['disease']);
    $admission_date = $_POST['admission_date'] ?: date('Y-m-d');

    $sql = "INSERT INTO patients (name, age, gender, contact, disease, admission_date, status)
            VALUES ('$name', $age, '$gender', '$contact', '$disease', '$admission_date', 'Admitted')";
    mysqli_query($conn, $sql);
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Add Patient</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <a href="index.php" class="btn-edit">&larr; Back</a>
    <h2>Add New Patient</h2>

    <form method="POST" class="form-card">
      <label>Name</label>
      <input type="text" name="name" required>

      <label>Age</label>
      <input type="number" name="age" min="0" required>

      <label>Gender</label>
      <select name="gender" required>
        <option value="">Select</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <label>Contact</label>
      <input type="text" name="contact">

      <label>Disease / Symptoms</label>
      <input type="text" name="disease">

      <label>Admission Date</label>
      <input type="date" name="admission_date">

      <button type="submit" name="submit" class="btn-add">Admit Patient</button>
    </form>
  </div>
</body>
</html>
