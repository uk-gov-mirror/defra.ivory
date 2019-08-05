# Ivory root project

Digital service to support the Ivory Act.

[![Build Status](https://travis-ci.com/DEFRA/ivory.svg?branch=master)](https://travis-ci.com/DEFRA/ivory)
[![Known Vulnerabilities](https://snyk.io/test/github/defra/ivory/badge.svg)](https://snyk.io/test/github/defra/ivory)
[![Code Climate](https://codeclimate.com/github/DEFRA/ivory/badges/gpa.svg)](https://codeclimate.com/github/DEFRA/ivory)
[![Test Coverage](https://codeclimate.com/github/DEFRA/ivory/badges/coverage.svg)](https://codeclimate.com/github/DEFRA/ivory/coverage)

## Development Team

This module was developed by the Ivory team as part of a digital transformation project at [DEFRA](https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs), a department of the UK government

# Prerequisites

Node v10+
Docker v18+

# Installing the project

```bash
git clone https://github.com/DEFRA/ivory.git && cd ivory
npm install
```

This will clone the [ivory-api](https://github.com/DEFRA/ivory-api), [ivory-front-office](https://github.com/DEFRA/ivory-front-office) and [ivory-back-office](https://github.com/DEFRA/ivory-back-office) applications and perform an npm install

# Building and running the applications using docker

```bash
docker-compose up --build
```

This will get or generate the required images and then create the containers

## Project structure

Here's the default structure for your project files.

* **[ivory-api](https://github.com/DEFRA/ivory-api)** (created withinin npm install)
* **[ivory-front-office](https://github.com/DEFRA/ivory-front-office)** ((created withinin npm install))
* **[ivory-back-office](https://github.com/DEFRA/ivory-back-office)** ((created withinin npm install))
* **temp**
* **source**
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

