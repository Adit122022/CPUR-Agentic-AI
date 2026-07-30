<?php
include("db.php");

if(isset($_POST['submit'])){
    $name = $_POST['name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];

    $conn->query("INSERT INTO products (name, category, price, stock) 
                  VALUES ('$name', '$category', '$price', '$stock')");

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
    <h2>Add Product</h2>
    <form method="POST">
        <input type="text" name="name" placeholder="Product Name" required><br><br>
        <input type="text" name="category" placeholder="Category" required><br><br>
        <input type="number" step="0.01" name="price" placeholder="Price" required><br><br>
        <input type="number" name="stock" placeholder="Stock Quantity" required><br><br>
        <button class="btn" name="submit">Add</button>
    </form>
</div>
</body>
</html>
