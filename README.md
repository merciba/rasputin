# rasputin

a small business helper bot

Rasputin is a Node.js API on top of a RethinkDB instance. He is deployed using Docker Compose, and can even run on a Raspberry Pi. 

Rasputin is a means to accomplish four things: 

1. Get your clients and invoices using the Freshbooks API
2. Get your bank transactions using Plaid (a PCI-compliant 3rd party API)
3. Schedule events which perform specific tasks on these data points
4. Integrate with Slack and give you an interactive #accounting channel

This allows small businesses to keep track of their finances in new ways, thus automating the invoice fulfillment process. 

## Installation

Open a Docker Quickstart Terminal and run:

```
npm install -g rasputin
rasputin install
```

You will be prompted to supply a hostname or ip address for your app.

Then a `docker-compose.yml` will be created with your settings. If you already have one, Rasputin will check to see if the base image and container instance already exist, and print the results to the Terminal.

`rasputin run` will run automatically, using `docker` to manage the instances. 

You should eventually be able to navigate to `http://<your-hostname>` and see the Rasputin portal home page.
