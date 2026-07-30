<!-- 6. Pricing table using CSS Grid with 3 columns and highlight the middle column.  -->
 <!DOCTYPE html>
<html>
<head>
    <title>Pricing Table</title>
    <style>
        body {
            font-family: Arial;
            padding: 20px;
            background: #f7f7f7;
        }

        .pricing-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            max-width: 900px;
            margin: auto;
        }

        .card {
            background: #fff;
            padding: 20px;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 6px;
            transition: 0.3s;
        }

        /* Highlight the middle column */
        .card.featured {
            background: #4b8df8;
            color: #fff;
            transform: scale(1.05);
            border: none;
        }

        .card h2 {
            margin-bottom: 10px;
        }

        .card p {
            margin: 8px 0;
        }

        .price {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 0;
        }

        button {
            padding: 10px 20px;
            border: none;
            background: #222;
            color: white;
            cursor: pointer;
            margin-top: 10px;
        }

        .card.featured button {
            background: #fff;
            color: #4b8df8;
        }

    </style>
</head>
<body>

<h2 style="text-align:center; margin-bottom: 30px;">Pricing Plans</h2>

<div class="pricing-container">

    <div class="card">
        <h2>Basic</h2>
        <p class="price">$9/mo</p>
        <p>✔ 5 Projects</p>
        <p>✔ Basic Support</p>
        <p>✔ Access to Tutorials</p>
        <button>Select</button>
    </div>

    <div class="card featured">
        <h2>Pro</h2>
        <p class="price">$19/mo</p>
        <p>✔ 15 Projects</p>
        <p>✔ Priority Support</p>
        <p>✔ All Tutorials</p>
        <button>Select</button>
    </div>

    <div class="card">
        <h2>Premium</h2>
        <p class="price">$29/mo</p>
        <p>✔ Unlimited Projects</p>
        <p>✔ 24/7 Support</p>
        <p>✔ All Features Access</p>
        <button>Select</button>
    </div>

</div>

</body>
</html>
