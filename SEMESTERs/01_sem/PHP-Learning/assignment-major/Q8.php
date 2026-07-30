<!-- 8. Generate a random 4-digit or 6-digit OTP. -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Generator</title>
</head>
<body>

<h2>OTP Generator</h2>

<button onclick="generateOTP()">Generate OTP</button>

<p>Your OTP: <span id="otpBox"></span></p>

<input type="number" id="userInput" placeholder="Enter OTP">
<button onclick="checkOTP()">Verify</button>

<p id="result"></p>

<script>
    let generatedOTP = "";

    // Generate 4-digit or 6-digit OTP
    function generateOTP() {
        // 4-digit OTP → 1000 to 9999
        generatedOTP = Math.floor(1000 + Math.random() * 9000);

        // If you want 6-digit OTP → uncomment below
        // generatedOTP = Math.floor(100000 + Math.random() * 900000);

        document.getElementById("otpBox").innerHTML = generatedOTP;
    }

    // Verify OTP
    function checkOTP() {
        let userOtp = document.getElementById("userInput").value;

        if (userOtp == generatedOTP) {
            document.getElementById("result").innerHTML = "<span style='color:green'>OTP Verified ✔</span>";
        } else {
            document.getElementById("result").innerHTML = "<span style='color:red'>Invalid OTP ❌</span>";
        }
    }
</script>

</body>
</html>
