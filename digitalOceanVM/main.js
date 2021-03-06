const got = require("got");
const chalk = require('chalk');
const os = require('os');
const fs = require('fs')
var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.DOTOKEN;

if (!config.token) {
	console.log(chalk`{red.bold DOTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}


// Configure our headers to use our token when making REST api requests.
const headers =
{
	'Content-Type': 'application/json',
	Authorization: 'Bearer ' + config.token
};


class DigitalOceanProvider {

	async listRegions() {
		let response = await got('https://api.digitalocean.com/v2/regions', { headers: headers, json: true })
			.catch(err => console.error(`listRegions ${err}`));

		if (!response) return;

		if (response.body.regions) {
			for (let region of response.body.regions) {
				// Print out
				console.log(region.name + '-' + region.slug)
			}
		}

		if (response.headers) {
			console.log(chalk.yellow(`Calls remaining ${response.headers["ratelimit-remaining"]}`));
		}
	}

	async listImages() {
		let response = await got('https://api.digitalocean.com/v2/images', { headers: headers, json: true })
			.catch(err => console.error(`listImages ${err}`));

		if (!response) return;

		if (response.body.images) {
			for (let image of response.body.images) {
				console.log(image.distribution+" "+image.name+' - '+image.slug)
			}
		}

		if (response.headers) {
			console.log(chalk.yellow(`Calls remaining ${response.headers["ratelimit-remaining"]}`));
		}
	}

	async createDroplet(dropletName, region, imageName) {
		if (dropletName == "" || region == "" || imageName == "") {
			console.log(chalk.red("You must provide non-empty parameters for createDroplet!"));
			return;
		}

		var data =
		{
			"name": dropletName,
			"region": region,
			"size": "2gb",
			"image": imageName,
			"ssh_keys": ["<SSH-KEY HERE"],
			"backups": false,
			"ipv6": false,
			"user_data": null,
			"private_networking": null
		};

		console.log("Attempting to create: " + JSON.stringify(data));

		let response = await got.post("https://api.digitalocean.com/v2/droplets", 
		{
			headers:headers,
			json:true,
			body: data
		}).catch( err => 
			console.error(err) 
		);

		if( !response ) return;

		console.log(response.statusCode);
		console.log(response.body);
		return response.body.droplet.id

		if(response.statusCode == 202)
		{
			console.log(chalk.green(`Created droplet id ${response.body.droplet.id}`));
		}
	}

	async dropletInfo(id) {
		if (typeof id != "number") {
			console.log(chalk.red("You must provide an integer id for your droplet!"));
			return;
		}

		let response = await got.get("https://api.digitalocean.com/v2/droplets/"+id, 
		{
			headers:headers,
			json:true,
		}).catch( err => 
			console.error(err) 
		);

		if( !response ) return;

		return response.body.droplet;

	}

	async deleteDroplet(id) {
		let response = await got.delete("https://api.digitalocean.com/v2/droplets/"+id, 
		{
			headers:headers,
			json:true,
		}).catch( err => 
			console.error(err) 
		);

		if( !response ) return;

		onsole.log(response.statusCode);
		console.log(response.body);

		if(response.statusCode == 204)
		{
			console.log(chalk.green(`Deleted droplet `));
		}
	}

};


async function provision() {
	let client = new DigitalOceanProvider();

	await client.listRegions();
	await client.listImages();

	//credentials
	var name = "deployment-srv";
	var region = "nyc1"; // Fill one in from #1
	var image = "ubuntu-16-04-x64"; // Fill one in from #2
	var dropletId = await client.createDroplet(name, region, image);
        console.log("IP Stored in file")
	setTimeout(setIp,20000,client,dropletId)
}
async function setIp(client,dropletId){
	
	var dropletInfo = await client.dropletInfo(parseInt(dropletId));
	var ip_address= dropletInfo.networks.v4[0].ip_address;

        // create inventory file 
        var inventoryString=`[web] 
deployment-srv ansible_host=${ip_address} ansible_ssh_user=root ansible_python_interpreter=/usr/bin/python3 ansible_ssh_private_key_file=/keys/do_rsa1 
[web:vars]
ansible_python_interpreter=/usr/bin/python3`

        fs.writeFile('../deployment-srv/inventory', inventoryString, function (err) {
                if (err) throw err;
                console.log('Saved!');
        });

}


(async () => {
	await provision();
})();
