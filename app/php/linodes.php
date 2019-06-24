<?php

$baseFolder = '/tmp/linodes';

if (!file_exists($baseFolder)) {
    mkdir($baseFolder, 0777, true);
}

$locations = json_decode(file_get_contents('/app/php/locations.json'), true);

while(true){
    if(file_exists('/root/.linode-cli')){
        foreach($locations['linode'] as $location => $coords){

            $linodes = json_decode(shell_exec("linode-cli linodes list --region $location --json"), true);
            if($linodes){
                $fp = fopen($baseFolder . '/' . $location . '.json', 'w');
                fwrite($fp, json_encode($linodes));
                fclose($fp);
                continue;
            }

            //THERE ARE NO LINODES IN THIS REGION, UNLINK FILE
            if(empty($linodes) && file_exists($baseFolder . '/' . $location . '.json')){
                unlink($baseFolder . '/' . $location . '.json');
            }
        }
    }
    echo date('Y-m-d H:i:s') . ' Server scraping loop done.' . "\n";
    sleep(10);
}
