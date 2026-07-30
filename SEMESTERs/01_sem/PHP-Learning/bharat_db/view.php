<?php
include "db.php";

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}
$id = (int)$_GET['id'];

// Save diagnosis/prescription
if (isset($_POST['save_notes'])) {
    $diagnosis = mysqli_real_escape_string($conn, $_POST['diagnosis']);
    $prescription = mysqli_real_escape_string($conn, $_POST['prescription']);
    mysqli_query($conn, "UPDATE patients SET diagnosis='$diagnosis', prescription='$prescription' WHERE id=$id");
    header("Location: view.php?id=$id");
    exit;
}

// Discharge
if (isset($_POST['discharge'])) {
    $discharge_date = $_POST['discharge_date'] ?: date('Y-m-d');
    $summary = mysqli_real_escape_string($conn, $_POST['discharge_summary']);
    mysqli_query($conn, "UPDATE patients SET discharge_date='$discharge_date', discharge_summary='$summary', status='Discharged' WHERE id=$id");
    header("Location: view.php?id=$id");
    exit;
}

$res = mysqli_query($conn, "SELECT * FROM patients WHERE id=$id");
$row = mysqli_fetch_assoc($res);
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>View Patient</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <a href="index.php" class="btn-edit">&larr; Back</a>
    <h2>Patient Details</h2>

    <div class="detail-grid">
      <div><strong>Name:</strong> <?php echo htmlspecialchars($row['name']); ?></div>
      <div><strong>Age:</strong> <?php echo $row['age']; ?></div>
      <div><strong>Gender:</strong> <?php echo $row['gender']; ?></div>
      <div><strong>Contact:</strong> <?php echo htmlspecialchars($row['contact']); ?></div>
      <div><strong>Disease:</strong> <?php echo htmlspecialchars($row['disease']); ?></div>
      <div><strong>Admission:</strong> <?php echo $row['admission_date']; ?></div>
      <div><strong>Discharge:</strong> <?php echo $row['discharge_date']; ?></div>
      <div><strong>Status:</strong> <?php echo $row['status']; ?></div>
    </div>

    <hr>

    <h3>Diagnosis & Prescription</h3>
    <form method="POST" class="form-card">
      <label>Diagnosis</label>
      <textarea name="diagnosis" rows="4"><?php echo htmlspecialchars($row['diagnosis']); ?></textarea>

      <label>Prescription</label>
      <textarea name="prescription" rows="4"><?php echo htmlspecialchars($row['prescription']); ?></textarea>

      <button type="submit" name="save_notes" class="btn-add">Save Notes</button>
    </form>

    <hr id="discharge">

    <h3>Discharge Patient</h3>
    <?php if ($row['status'] == 'Discharged'): ?>
      <div class="discharged-box">
        <strong>Already Discharged on:</strong> <?php echo $row['discharge_date']; ?>
        <p><?php echo nl2br(htmlspecialchars($row['discharge_summary'])); ?></p>
      </div>
    <?php else: ?>
      <form method="POST" class="form-card">
        <label>Discharge Date</label>
        <input type="date" name="discharge_date">

        <label>Discharge Summary</label>
        <textarea name="discharge_summary" rows="4"></textarea>

        <button type="submit" name="discharge" class="btn-discharge">Discharge Patient</button>
      </form>
    <?php endif; ?>

  </div>
</body>
</html>
