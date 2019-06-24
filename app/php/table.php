<?php
$baseFolder = '/tmp/linodes';

$locations = json_decode(file_get_contents('/app/php/locations.json'), true);
$response = [];

$cities = [];

foreach ($locations['linode'] as $region => $meta) {
    $cities[$region] = $meta['city'];
}

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script   src="https://code.jquery.com/jquery-3.4.1.min.js"   integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="   crossorigin="anonymous"></script>
    <title>Live output</title>
    <style media="screen">
        #spinner {
            position: fixed;
            bottom: 0;
            right: 0;
        }
    </style>
</head>

<body>
    <div id="spinner"><img src="/spin.gif"/></div>
    <table class="table table-striped table-dark">
        <thead>
            <tr>
                <?php foreach ($cities as $city): ?>
                <th scope="col"><?php echo $city ?></th>
                <?php endforeach; ?>
            </tr>
        </thead>
        <tbody>
            <tr>
                <?php foreach (array_keys($cities) as $region): ?>
                    <td>
                        <table>
                            <tbody>
                                <tr id="#<?php echo $region ?>">
                                    <!-- HERE WILL BE THE IPS -->
                                </tr>
                            </tbody>
                        </table>
                    </td>
                <?php endforeach; ?>
            </tr>
        </tbody>
    </table>

    <script type="text/javascript">
        setInterval(function(){

            axios.get('/lists.php').then(function (response) {

                Object.keys(response.data).forEach(function(region){
                    var tr = document.getElementById('#' + region);
                    var cell = '';
                    response.data[region].forEach(function(node){
                        var result = '<font color="' + node.color + '">';
                        result+= node.ip;
                        result += '</font><br>';
                        cell += result;
                    });
                    tr.innerHTML = cell;
                });
            });
        },1000);
    </script>
</body>

</html>
