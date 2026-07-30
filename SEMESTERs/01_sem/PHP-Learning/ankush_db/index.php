<?php include("db.php"); ?>

<!DOCTYPE html>
<html>
<head>
    <title>Inventory System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h2>Inventory & Stock Management</h2>
    <a class="btn" href="add.php">+ Add Product</a>

    <table>
        <tr>
            <th>ID</th><th>Name</th><th>Category</th>
            <th>Price</th><th>Stock</th><th>Action</th>
        </tr>

        <?php
        $result = $conn->query("SELECT * FROM products");
        while($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['name']}</td>
                    <td>{$row['category']}</td>
                    <td>{$row['price']}</td>
                    <td>{$row['stock']}</td>
                    <td>
                        <a class='btn' href='edit.php?id={$row['id']}'>Edit</a>
                        <a class='btn' href='delete.php?id={$row['id']}'>Delete</a>
                    </td>
                  </tr>";
        }
        ?>
    </table>
</div>

</body>
</html>
