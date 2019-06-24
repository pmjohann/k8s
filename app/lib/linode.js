const spawn = require('child_process').spawn;
const fs = require('fs');
const yaml = require('yaml');

const cities = require('./cities');

function city2region(city) {
    return cities[city]['linode'];
}

function config(token) {

    const confTemplatePath = '/app/.linode-cli.sample';
    const confPath = '/root/.linode-cli';

    return new Promise(resolve => {
        fs.unlink(confPath, () => {

            fs.readFile(confTemplatePath, 'utf8', function(err, contents) {
                if (err) throw err;

                contents = contents.replace('__TOKEN__', token);
                fs.writeFile(confPath, contents, 'utf8', function(err) {
                    if (err) throw err;

                    resolve();
                });
            });
        });
    });
}

module.exports = function(city, nodes) {

    return new Promise(resolve => {

        const opts = {
            'node-type': process.env.NODE_TYPE,
            'nodes': nodes,
            'master-type': process.env.MASTER_TYPE,
            'region': city2region(city),
            'ssh-public-key': process.env.SSH_PUBKEY_PATH,
            'auto-approve': null
        };

        config(process.env.TOKEN).then(() => {
            let cmd = 'linode-cli';
            const params = ['k8s-alpha', 'create'];
            Object.keys(opts).forEach(opt => {
                params.push(`--${opt}`);
                if (opts[opt]) {
                    params.push(`${opts[opt]}`);
                }
            });

            require('crypto').randomBytes(16, function(err, buffer) {
                if (err) throw err;

                const clusterName = (city + '-' + buffer.toString('hex')).substring(0, 16);
                let context = false;

                params.push(clusterName);


                console.log(cmd + ' ' + params.join(' '));
                const deploy = spawn(cmd, params);

                let steps = 0;

                deploy.stdout.on('data', (data) => {
                    process.stdout.write(`${city.toUpperCase()}::${data}`);
                    steps++;
                    //console.log('steps of', city, steps);
                    if(context === false){
                        context = parseSwitchToContext(data);
                    }
                });

                deploy.stderr.on('data', (data) => {
                    console.log(`ERROR::${city.toUpperCase()}:: ${data}`);
                });

                deploy.on('close', (code) => {
                    console.log(`child process exited with code ${code}`);

                    if(context !== false){
                        getKubeConfig(context).then(conf => {
                            resolve({name: clusterName, conf: conf});
                        });
                    }
                });
            });
        });
    });
}

function getKubeConfig(targetContext){
    return new Promise(resolve => {
        fs.readFile('/root/.kube/config', 'utf8', function(err, contents) {
            if (err) throw err;

            const template = getKubeConfigTemplate();
            kubeconfig = yaml.parse(contents);
            kubeconfig.contexts.forEach(ctx => {

                //WE FOUND THE TARGET CONTEXT
                if(ctx.name === targetContext){

                    template.contexts.push(ctx);
                    template["current-context"] = ctx.name;

                    kubeconfig.users.forEach(user => {
                        if(user.name === ctx.context.user){
                            template.users.push(user);
                        }
                    });

                    kubeconfig.clusters.forEach(cluster => {
                        if(cluster.name === ctx.context.cluster){
                            template.clusters.push(cluster);
                        }
                    });

                    resolve(yaml.stringify(template));
                }
            });
        });
    });
}

function getKubeConfigTemplate(){
    return {
        apiVersion: 'v1',
        kind: 'Config',
        preferences: {},
        clusters: [],
        contexts: [],
        users: [],
        'current-context': null
    };
}

function parseSwitchToContext(stdout) {
    var re1 = '(Switched)'; // Word 1
    var re2 = '( )'; // White Space 1
    var re3 = '(to)'; // Word 2
    var re4 = '( )'; // White Space 2
    var re5 = '(context)'; // Word 3
    var re6 = '( )'; // White Space 3
    var re7 = '(".*?")'; // Double Quote String 1

    var p = new RegExp(re1 + re2 + re3 + re4 + re5 + re6 + re7, ["i"]);
    var m = p.exec(stdout);
    if (m && m[7]) {
        return m[7].replace(/['"]+/g, '');
    }
    return false;
}
