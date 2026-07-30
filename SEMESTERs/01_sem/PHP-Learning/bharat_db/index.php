<?php
include "db.php";

// Delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM patients WHERE id=$id");
    header("Location: index.php");
    exit;
}

// Discharge quick action via GET (optional)
if (isset($_GET['discharge_id'])) {
    $id = (int)$_GET['discharge_id'];
    $today = date('Y-m-d');
    mysqli_query($conn, "UPDATE patients SET status='Discharged', discharge_date='$today' WHERE id=$id");
    header("Location: index.php");
    exit;
}

// Fetch
$q = "SELECT * FROM patients ORDER BY id DESC";
if (isset($_GET['filter'])) {
    $f = $_GET['filter'];
    if ($f == 'admitted') $q = "SELECT * FROM patients WHERE status='Admitted' ORDER BY id DESC";
    if ($f == 'discharged') $q = "SELECT * FROM patients WHERE status='Discharged' ORDER BY id DESC";
}
$result = mysqli_query($conn, $q);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hospital Patient Records</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h2>Hospital Patient Record System</h2>

    <div class="topbar">
      <a href="add.php" class="btn-add">+ Add Patient</a>
      <div class="filters">
        <a href="index.php" class="filter-btn">All</a>
        <a href="index.php?filter=admitted" class="filter-btn">Admitted</a>
        <a href="index.php?filter=discharged" class="filter-btn">Discharged</a>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Disease</th>
          <th>Admission</th>
          <th>Discharge</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = mysqli_fetch_assoc($result)) : ?>
          <tr>
            <td><?php echo $row['id']; ?></td>
            <td><?php echo htmlspecialchars($row['name']); ?></td>
            <td><?php echo $row['age']; ?></td>
            <td><?php echo $row['gender']; ?></td>
            <td><?php echo htmlspecialchars($row['disease']); ?></td>
            <td><?php echo $row['admission_date']; ?></td>
            <td><?php echo $row['discharge_date']; ?></td>
            <td><?php echo $row['status']; ?></td>
            <td>
              <a class="btn-view" href="view.php?id=<?php echo $row['id']; ?>">View</a>
              <a class="btn-edit" href="edit.php?id=<?php echo $row['id']; ?>">Edit</a>
              <?php if ($row['status'] == 'Admitted'): ?>
                <a class="btn-discharge" href="view.php?id=<?php echo $row['id']; ?>#discharge">Discharge</a>
              <?php endif; ?>
              <a class="btn-delete" href="index.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete this record?')">Delete</a>
            </td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>

  </div>
</body>
</html>
