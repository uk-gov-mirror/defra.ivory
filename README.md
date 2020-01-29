# Ivory root project

Digital service to support the Ivory Act.


## Development Team

This module was developed by the Ivory team as part of a digital transformation project at [DEFRA](https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs), a department of the UK government


## Prerequisites

Node v10+
Docker v18+


## Installing the project

```bash
git clone https://github.com/DEFRA/ivory.git
```
This will clone the [ivory-services](https://github.com/DEFRA/ivory-services), [ivory-front-office](https://github.com/DEFRA/ivory-front-office) and [ivory-back-office](https://github.com/DEFRA/ivory-back-office) applications as well as the [defra-hapi-utils](https://github.com/DEFRA/defra-hapi-utils) and [ivory-data-mapping](https://github.com/DEFRA/ivory-data-mapping) modules

## Installing the services

```bash
/bin/bash initialise.sh
```
This will perform an npm install on each module and service.

### Making sure the services have installed successfully

The best way to check this is to make sure the unit-tests run successfully for each service by doing the following:

Open a terminal, navigate to the defra-hapi-utils directory and run the defra-hapi-utils tests:
```bash
cd defra-hapi-utils
npm test
```
Navigate to the ivory-data-mapping directory and run the ivory-data-mapping tests:
```bash
cd ../ivory-data-mapping
npm test
```
Navigate to the ivory-service directory and run the ivory-service tests:
```bash
cd ../ivory-service
npm test
```
Navigate to the ivory-front-office directory and run the ivory-front-office tests:
```bash
cd ../ivory-front-office
npm test
```
Navigate to the ivory-back-office directory and run the ivory-back-office:
```bash
cd ../ivory-back-office
npm test
```

## Setting up the environment variables

Once you are happy the tests run successfully, the environment variables will need to be set correctly within the ``.env`` file of each of the three services in order to test the three services together.
If working on this project within DEFRA it's possible that web operations will have a development environment with values that can be used found on a private instance of gitlab.

## Building and running the applications using docker

```bash
docker-compose up --build
```
This will get or generate the required images and then create the containers

Note that although this seems to work fine in the jenkins build (see web-ops),
I don't seem to be able to get the sharp dependency to compile correctly within docker locally for both the
front and back office services.

Instead, I do the following:

Open a terminal, navigate to the ivory directory and run the redis and postgres instances within docker:
```bash
docker-compose up redis postgres
```
Open a second terminal, navigate to the ivory-services directory and run the ivory-service:
```bash
npm start
```
Open a third terminal, navigate to the ivory-front-office directory and run the ivory-front-office:
```bash
npm start
```
Open a fourth terminal, navigate to the ivory-back-office directory and run the ivory-back-office:
```bash
npm start
```


## Project structure

Here's the default structure for your project files.

* **[defra-hapi-utils](https://github.com/DEFRA/defra-hapi-utils)** (created withinin npm install)
* **[ivory-data-mapping](https://github.com/DEFRA/ivory-data-mapping)** (created withinin npm install)
* **[ivory-services](https://github.com/DEFRA/ivory-services)** (created withinin npm install)
* **[ivory-front-office](https://github.com/DEFRA/ivory-front-office)** ((created withinin npm install))
* **[ivory-back-office](https://github.com/DEFRA/ivory-back-office)** ((created withinin npm install))
* **temp**
* LICENCE
* README.md
* docker-compose.yml (will build the docker containers and run them)


## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

>Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

