
const cities = require('./lib/cities');
const clusters = parseClusters();
const deployers = {
    linode: require('./lib/linode'),
    digitalocaean: require('./lib/digitalocean')
}
const fs = require('fs');
const deployed = [];

Object.keys(clusters).forEach(provider => {
    const deployables = clusters[provider];
    Object.keys(deployables).forEach(city => {
        const nodes = deployables[city];
        deployers[provider](city, nodes).then(conf => {
            deployed.push(conf);
            fs.writeFile(`/out/${conf.name}.yaml`, conf.conf, (err) => {
                if(err) throw err;

                if(deployed.length === process.argv[2].split(',').length){
                    console.log(JSON.stringify(deployed));
                }
            });
        });
    });
});

function parseClusters(){
    if(process.argv[2]){

        const clusters = {};
        process.argv[2].split(',').forEach((cluster) => {
            const meta = cluster.split(':');
            const city = meta[0];
            const providers = cities[city];
            if(providers){
                const nodes = meta[1];
                const providerNames = Object.keys(providers);
                if(providerNames.length === 1){
                    const onlyProvider = providerNames[0];
                    if(!clusters[onlyProvider]){
                        clusters[onlyProvider] = {};
                    }
                }
                let added = false;
                providerNames.forEach(providerName => {
                    if(clusters[providerName]){
                        clusters[providerName][city] = nodes;
                        added = true;
                    }
                });
                if(added === false){
                    clusters[providerNames[0]] = {};
                    clusters[providerNames[0]][city] = nodes;
                }
                return clusters;
            }
            throw `city ${meta[0]} not available!`;
        });
        return clusters;
    }
    throw 'CLUSTERS env var not defined!';
}

//linode-cli k8s-alpha create --node-type g6-standard-1 --nodes 2 --master-type g6-standard-2 --reguion eu-west --ssh-public-key /root/.ssh/id_rsa.pub
