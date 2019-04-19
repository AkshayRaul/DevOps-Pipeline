## DigitalOcean VM Provision

##### Set your token

In your account on DigitalOcean, under the API tab, create your own personal access token. Copy the token, as it will no longer be visible once you leave the page. Set the token to your environment as:

```bash
# Mac/Linux
export DOTOKEN="xxx"
# Windows
setx DOTOKEN xxx
```


##### Register SSH Keys

Create SSH keys using `$ ssh-keygen`. The created keys will be `id_rsa` and `id_rsa.pub` (These are default names). Go to the security tab in your Account. Register your SSH key by pasting the public key. Once registered, you can SSH into your VM.
 
You can retreive the id, fingerprint by:

```bash
$ curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer $DOTOKEN' "https://api.digitalocean.com/v2/account/keys"
```

#### VMConfig
To create the VM we need to set the configuration. Uncomment the following methods in [`main.js`](main.js) and execute to get results

- Get List of Regions- `listRegions()` will get all the regions and their associated slug values
https://developers.digitalocean.com/documentation/v2/#list-all-regions

- Get List of images in that region- `listImages()` will get all the images in that region
https://developers.digitalocean.com/documentation/v2/#images

Config:
```js
{
    "name": dropletName,
    "region": region,
    "size": "512mb",
    "image": imageName,
    "ssh_keys": [ssh_key_ids or fingerprints or public_keys],
    "backups": false,
    "ipv6": false,
    "user_data": null,
    "private_networking": null
};
```

#### Methods

- Create Droplet - createDroplet(name, region, image)

https://developers.digitalocean.com/documentation/v2/#create-a-new-droplet

- Droplet Info - dropletInfo(dropletId)

https://developers.digitalocean.com/documentation/v2/#retrieve-an-existing-droplet-by-id

Get the IP from this method, which can be used to ssh into the VM

- Delete Droplet  - deleteDroplet(dropletId)

https://developers.digitalocean.com/documentation/v2/#delete-a-droplet


##### Run the node program

`node main.js`
