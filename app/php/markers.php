<?php

$baseFolder = '/tmp/linodes';

$locations = json_decode(file_get_contents('/app/php/locations.json'), true);
$response = [];

foreach(scandir($baseFolder) as $region){
    if(in_array($region, ['.', '..'])){
        continue;
    }

    $linodes = json_decode(file_get_contents($baseFolder . '/' . $region),true);
    $coords = $locations['linode'][str_replace('.json', '', $region)]['coords'];
    $response[$coords] = count($linodes);
}

echo json_encode($response);
exit;
