
# Intro

This is a simple app made with Ionic 4 +Angular 7, which can be plugged to any API (or static) GeoJSON data source to display locations on a map (Leaflet) using OpenStreetMaps.

It provides also a listing of locations, with a simple search. The search looks into the name, description and address fields.

**If your GPS is turned on and you allow your brower permission to access it, the listing will be sorted by those nearest to you first.**

For privacy reasons, we don't use a third party provider to find the locations near by. Instead we use the Haversine Formula, which calculates the distance over a single line: https://en.wikipedia.org/wiki/Haversine_formula

For the directions, we are calling the native maps app for mobiles, and for desktop, temporarily gmaps. We will replace the latter as soon as we have a working replacement.

The GeoJSON looks like this:
```
{
    "geometry": {
        "coordinates": [
            "4.865687699999967",
            "52.3600834"
        ],
        "type": "Point"
    },
    "properties": {
        "address": "Overtoom 301, Amsterdam, Netherlands",
        "categories": {
            "category.name": {
                "icon_name": "icon_name",
                "name": "category_name"
            }
        },
        "date": "Feb/2019",
        "description": "",
        "faircoin_address": "xxxx",
        "hours": "Mon-Sun: 24hs",
        "id": 24326,
        "image": "",
        "name": "OT301",
        "phone": "+4423235235235234",
        "updated": "Feb/2019",
        "website": "https://fair.coop"
    },
    "type": "Feature"
},

```

That means that if you have a backend with locations which can output on that format, you could easily plug this app to it and see your own locations.

You might need to tweak the fields according to your data structure.


# Install

#### 1) Check your Ionic installation

This app is made with Ionic 4, so you need to install it first.
You do that essentialy with:
```
 npm install -g ionic
```
For more details see: https://ionicframework.com/docs/installation/cli

You can check your Ionic version by running:
```
ionic --version
```

### 2. Install dependencies

Once you have ionic 4, run the following on your copy of this repository to install all dependencies for this project:

```
$ npm i
```
### 3. Run the app in development mode

If all went well, run the development server with:
```
ionic serve -c
```
# Contributing

Fork this project, clone the fork and do your commits there.
After you push your changes, send us a pull request that we will review and merge if applies.

# Roadmap

* Rename project to something more generic
* Move project to GitHub
* Feature freeze
* Finish some layout and cosmetics
* Open for beta
* Fix bugs or issues
* Release
* Announce

# Next milestone

* Implement QR code for donation address
* Implement multilanguage
* Implement categories


# History

This software started a proof-of-concept on how to use a dettached UI which gets data from a backend via an API serving JSON with the locations from use.fair-coin.org.

The backend started being an independent OCP (valuenetwork) install using GraphQL to serve the contents to this UI. Later we changed to a REST API provided by faircoop's site. You can find the GraphQL example use on the first commits of this repo.

This was started in collaboration with several FairCoop members and is open for ideas, feature requests, pull requests (mostly!), and contributions.
