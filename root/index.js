var token = process.env.TOKEN ? process.env.TOKEN : '63931af6dad339754782d344471c7e7b8458bc6ea19a486e97d58b7d3c4f99a2';
const exec = require('child_process').exec;
const fs = require('fs');
const confPath = '/root/.linode-cli';
const params = {
    'node-type': process.env.NODE_TYPE,
    'nodes': process.env.NODES,
    'master-type': process.env.MASTER_TYPE,
    'region': process.env.REGION,
    'ssh-public-key': process.env.SSH_PUBKEY_PATH
};


fs.readFile(confPath + '.sample', 'utf8', function(err, contents) {
    if (err) throw err;

    contents = contents.replace('__TOKEN__', params.token);
    fs.writeFile(confPath, contents, 'utf8', function(err) {
        if (err) throw err;

        let cmd = 'linode-cli k8s-alpha create';
        Object.keys(params).forEach(param => {
            cmd += ` --${param} ${params[param]}`;
        });
        cmd += ` ${process.env.CLUSTERNAME}`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) throw err;

            console.log('STDOUT: ', stdout);
            console.log('STDERR: ', stderr);
        });
    });
});


//linode-cli k8s-alpha create --node-type g6-standard-1 --nodes 2 --master-type g6-standard-2 --reguion eu-west --ssh-public-key /root/.ssh/id_rsa.pub
