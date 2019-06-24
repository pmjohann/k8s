<?php

$baseFolder = '/tmp/linodes';

$locations = json_decode(file_get_contents('/app/php/locations.json'), true);
$response = [];

foreach(scandir($baseFolder) as $region){
    if(in_array($region, ['.', '..'])){
        continue;
    }

    $reg = str_replace('.json', '', $region);

    if(!isset($response[$reg])){
        $response[$reg] = [];
    }

    $linodes = json_decode(file_get_contents($baseFolder . '/' . $region),true);

    foreach($linodes as $linode){

        if(isset($linode['ipv4'][0])){
            $response[$linode['region']][] = [
                'ip' => $linode['ipv4'][0],
                'color' => $linode['status'] === 'running' ? 'green' : 'yellow'
            ];
        }
    }
}

echo json_encode($response);
exit;
