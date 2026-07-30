<?php
include("db.php");

$id = $_GET['id'];
$data = $conn->query("SELECT * FROM products WHERE id=$id")->fetch_assoc();

if(isset($_POST['update'])){
    $name = $_POST['name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];

    $conn->query("UPDATE products 
                  SET name='$name', category='$category', price='$price', stock='$stock'
                  WHERE id=$id");

    header("Location: index.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>

<body>
<div class="container">
    <h2>Edit Product</h2>
    <form method="POST">
        <input type="text" name="name" value="<?= $data['name'] ?>" required><br><br>
        <input type="text" name="category" value="<?= $data['category'] ?>" required><br><br>
        <input type="number" step="0.01" name="price" value="<?= $data['price'] ?>" required><br><br>
        <input type="number" name="stock" value="<?= $data['stock'] ?>" required><br><br>
        <button class="btn" name="update">Update</button>
    </form>
</div>
</body>
</html>
