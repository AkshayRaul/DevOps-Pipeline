const got = require("got");
const chalk = require('chalk');
const os = require('os');

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
			"size": "512mb",
			"image": imageName,
			"ssh_keys": ["8e:3a:be:93:8c:86:ba:55:1c:37:dc:4d:ed:fc:9c:56"],
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

		console.log(response.body.droplet.networks.v4);

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

		console.log(response.statusCode);
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
	var name = "araul";
	var region = "nyc1"; // Fill one in from #1
	var image = "ubuntu-14-04-x64-do"; // Fill one in from #2
	var dropletId = await client.createDroplet(name, region, image);
	await client.dropletInfo(parseInt(dropletId));
	//Uncomment to delete droplet
	//await client.deleteDroplet(dropletId);
	await setTimeout(client.dropletInfo,20000,dropletId);
}


(async () => {
	await provision();
})();