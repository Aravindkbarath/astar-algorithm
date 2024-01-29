<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>A star</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="astar.css" rel="stylesheet">
	<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <div class="row">
            <h1 class="display-4 text-center">A* - Path Finding Algorithm</h1>
            <div class="col-12 text-center">
                <button type="button" class="btn btn-primary m15" onclick="startCell();">Start</button>
                <button type="button" class="btn btn-danger m15" onclick="endCell();">End</button>
                <button type="button" class="btn btn-dark m15" onclick="wallCell();">Wall</button>
                <button type="button" class="btn btn-success m15" onclick="findPath();";>Find Path</button>
            </div>
            <div class="col-12 table-responsive ">
                <table class="table table-bordered world mx-auto" style="border: 1px solid black;">
                    <?php
                        for($i = 0; $i < 10; $i++){
                            echo '<tr class="tr">';
                            for($j = 0; $j < 10; $j++){
                                echo '<td onclick="changeColor(this)" data-x="'.$i.'" data-y="'.$j.'" class="tdClass"></td>';
                            }
                            echo '</tr>';
                        }
                    ?>
                </table>
            </div>
        </div>
	</div>
    <div id="tempStart" class="d-none"></div>
    <div id="tempEnd" class="d-none"></div>
    <script src="astar.js"></script>
</body>
</html>