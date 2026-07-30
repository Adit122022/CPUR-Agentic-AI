<!-- 7. Live digital clock using JavaScript.  -->
 <!DOCTYPE html>
<html>
<head>
    <title>JavaScript Clock</title>
    <style>
        body {
            font-family: Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f3f3f3;
        }
        .clock {
            font-size: 50px;
            font-weight: bold;
            padding: 20px 40px;
            border: 2px solid #333;
            background: white;
            border-radius: 10px;
        }
    </style>
</head>
<body>

<div class="clock" id="clock">00:00:00</div>

<script>
    function updateClock() {
        let now = new Date();

        let h = now.getHours().toString().padStart(2, '0');

         let session = "AM";

        // Convert 24h → 12h
        if (h == 0) {
            h = 12; // midnight becomes 12
        } else if (h > 12) {
            h = h - 12;
            session = "PM";
        } else if (h == 12) {
            session = "PM";
        }

        h = h.toString().padStart(2, '0');


        let m = now.getMinutes().toString().padStart(2, '0');
        let s = now.getSeconds().toString().padStart(2, '0');

        document.getElementById("clock").innerHTML = `${h}:${m}:${s} ${session}`;
    }

    // Run clock every 1 second
    setInterval(updateClock, 1000);

    // Run immediately also
    updateClock();
</script>

</body>
</html>
